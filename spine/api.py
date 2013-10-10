#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#       api.py
#
#       Copyright 2012-2013 Eddy Ernesto del Valle Pino <xigmatron@gmail.cu>
#       Copyright 2011 Aaron Franks <aaron.franks+djangbone@gmail.com>
#
#       This program is free software; you can redistribute it and/or modify
#       it under the terms of the GNU General Public License as published by
#       the Free Software Foundation; either version 2 of the License, or
#       (at your option) any later version.
#
#       This program is distributed in the hope that it will be useful,
#       but WITHOUT ANY WARRANTY; without even the implied warranty of
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#       GNU General Public License for more details.
#
#       You should have received a copy of the GNU General Public License
#       along with this program; if not, write to the Free Software
#       Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#       MA 02110-1301, USA.
#
#

import json
from itertools import chain

from django.db.models.query import QuerySet
from django.db.models.fields import related
from django.forms.models import modelform_factory
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.views.generic import View
from django.conf.urls import url

from .utils import get_app_label, flatten_dict, get_related_model
from .utils import select_fields
from .api_meta import SpineAPIMeta, api_handlers
from .encoder import SpineJSONEncoder

_model_field_names_cache = {}


def get_field_names(model):
    """
    Returns
        local: fields declared in the model
        simple: "has one" relations
        multple: "has many" relations
    """
    global _model_field_names_cache
    if model not in _model_field_names_cache:
        local = [
            (field.name, None) for field in model._meta.fields
            if not field.rel
        ]

        single, multiple = [], []

        related_types = {
            related.ManyRelatedObjectsDescriptor: multiple,
            related.ReverseManyRelatedObjectsDescriptor: multiple,
            related.ForeignRelatedObjectsDescriptor: multiple,
            related.SingleRelatedObjectDescriptor: single,
            related.ReverseSingleRelatedObjectDescriptor: single,
        }

        fields = [(fname, getattr(model, fname)) for fname in dir(model)]
        for field_name, field in fields:
            field_type = type(field)
            if field_type in related_types:
                related_model = get_related_model(field)
                if related_model in api_handlers:
                    related_types[field_type].append(
                        (field_name, related_model)
                    )

        _model_field_names_cache[model] = (
            dict(local, __unicode__=None), dict(single), dict(multiple)
        )

    return _model_field_names_cache[model]


class BadRequest(HttpResponse):
    def __init__(self, content='Bad request', status=400, *args, **kwargs):
        super(BadRequest, self).__init__(
                content=content, status=status, *args, **kwargs)


class SpineAPI(View):
    """
    Abstract class view, which makes it easy for subclasses to talk to
    Spine.js.

    Supported operations (copied from spine.js docs):
        create -> POST   /api/app_name/ModelName
        read ->   GET    /api/app_name/ModelName[/id]
        update -> PUT    /api/app_name/ModelName/id
        delete -> DELETE /api/app_name/ModelName/id
    """

    __metaclass__ = SpineAPIMeta

    # Key pattern for url with id
    pk_pattern = r'(?P<id>\d+)'
    # Prefix for url with id
    pk_name = 'pk_'

    # Methods allowed by the API View
    http_method_names = ('get', 'post', 'put', 'delete')

    # Model to use for all data accesses
    model = None

    # Tuple of field names that should appear in json output
    serialize_fields = None

    # Optional pagination settings:
    # Set to an integer to enable GET pagination (at the specified page size)
    page_size = None
    # HTTP GET parameter to use for accessing pages (eg. /widgets?p=2)
    page_param_name = 'p'

    # Override these attributes with ModelForm instances to support PUT and
    #   POST requests:
    # Form class to be used for POST requests
    add_form_class = None
    # Form class to be used for PUT requests
    edit_form_class = None

    # Override these if you have custom JSON encoding/decoding needs:
    JSONEncoder = SpineJSONEncoder
    JSONDecoder = json.JSONDecoder

    # Decoratos to apply to class methods
    #
    # Ex: {'get': [login_required]}
    # is equivalent to:
    #
    #   @method_decorator(login_required)
    #   def get(sefl, ...):
    #      ....
    # or:
    #
    #   get = method_decorator(login_required)(SpineAPI.get)
    #
    method_decorators = {}

    def __init__(self, *args, **kwargs):
        super(SpineAPI, self).__init__(*args, **kwargs)
        self._data = None

    @property
    def base_queryset(self):
        """
        Override this to return another query set
        Ex: self.model.objects.filter(user=self.request.user)
        """
        return self.model.objects.all()

    @property
    def page_number(self):
        return int(self._real_data.get(self.page_param_name, 1))

    # Request data processing

    @property
    def data(self):
        """
        Returns the data passed in the request method data
        """
        if self._data is None:
            data = self._real_data

            # Delete the page_param from the data
            if self.page_param_name in data:
                data.pop(self.page_param_name)

            # Extract the pks of related fields
            for field_name, value in data.items():
                if isinstance(value, dict):
                    field, _, _, _ = self.model._meta.get_field_by_name(
                        field_name
                    )
                    if field.rel:
                        pk_name = field.rel.to._meta.pk.name
                        if pk_name in value:
                            data[field_name] = value[pk_name]

            self._data = data
        return self._data

    @property
    def _real_data(self):
        content_type = self.request.META.get('CONTENT_TYPE') or ''
        if content_type == 'application/json':
            try:
                data = self._decode_request()
            except ValueError:
                raise BadRequest()
        else:
            # This is a hack!
            method = self.request.method.upper()
            method = 'POST' if method == 'PUT' else method
            data = flatten_dict(getattr(self.request, method))
        return data

    @property
    def _decode_request(self, decoder_prefix='_get_data_for_'):
        decoder_name = decoder_prefix + self.request.method.lower()
        return getattr(self, decoder_name)

    def _get_data_for_get(self):
        """
        Decodes the data for GET requests
        """
        keys = self.request.GET.keys()
        data = None
        if keys:
            data = keys[0]
        return self.JSONDecoder().decode(data or '{}')

    def _get_data_for_post(self):
        """
        Decodes the data for POST and PUT requests
        """
        return self.JSONDecoder().decode(self.request.body)
    _get_data_for_put = _get_data_for_post

    # GET request

    def get(self, request, id=None):
        """
        Handle GET requests, either for a single resource or a collection.
        """
        if id is None:
            return self._get_collection()
        else:
            return self._get_single_item(id)

    def _get_single_item(self, id):
        """
        Handle a GET request for a single model instance.
        """
        try:
            instance = self.base_queryset.get(pk=id)
        except self.model.DoesNotExist:
            raise Http404()
        return self.success_response(instance)

    def _get_collection(self):
        """
        Handle a GET request for a full collection (when no id was provided).
        """
        return self.success_response(self.base_queryset.filter(**self.data))

    # POST & PUT requests

    def post(self, request):
        """
        Handle a POST request by adding a new model instance.

        This view will only do something if SpineAPI.add_form_class
        is specified by the subclass. This should be a ModelForm corresponding
        to the model.
        """
        if self.has_add_permissions(request):
            return self._process_form(self.add_form_class)
        else:
            return HttpResponse('POST not allowed', status=403)

    def has_add_permissions(self, request):
        return True

    def put(self, request, id=None):
        """
        Handle a PUT request by editing an existing model.

        This view will only do something if SpineAPI.edit_form_class
        is specified by the subclass. This should be a ModelForm corresponding
        to the model.
        """
        if id is None:
            return HttpResponse('PUT not supported', status=405)
        try:
            instance = self.base_queryset.get(pk=id)
        except ObjectDoesNotExist:
            raise Http404()

        return self._process_form(self.edit_form_class, instance=instance)

    # Form Processing methods

    def _process_form(self, FormClass, instance=None):
        form = self._get_form(FormClass, instance)
        return self._save_form(form)

    def _get_form(self, FormClass, instance):
        Form = self._get_form_class(FormClass)
        form = Form(
            self.data,
            files=self.request.FILES,
            instance=instance
        )
        return form

    @classmethod
    def _get_form_class(cls, FormClass):
        return FormClass or modelform_factory(
            cls.model,
            fields=cls.get_form_fields(),
        )

    def _save_form(self, form):
        """
        Saves the form and returs the corresponding response
        """
        form.request = self.request
        if form.is_valid():
            item = form.save()
            return self.success_response(item)
        else:
            return self.validation_error_response(form.errors)

    # Delete request

    def delete(self, request, *args, **kwargs):
        """
        Respond to DELETE requests by deleting the model and returning its
        JSON representation.
        """
        if 'id' not in kwargs:
            return HttpResponse(
                'DELETE is not supported for collections',
                status=405
            )
        qs = self.base_queryset.filter(id=kwargs['id'])
        if qs:
            qs.delete()
            return self.success_response()
        else:
            raise Http404()

    # Response methods

    def success_response(self, *args, **kwargs):
        """
        Takes some object and serialize it, then converts it to HttpResponse
        with the correct mimetype

        If nothig is passed the response is empty
        """
        return self.response(http_response_class=HttpResponse, *args, **kwargs)

    def validation_error_response(self, output, *args, **kwargs):
        """
        Return an BadRequest indicating that input validation failed.

        The form_errors argument contains the contents of form.errors, and you
        can override this method is you want to use a specific error
        response format.
        By default, the output is a simple text response.
        """
        output = {'errors': output}
        return self.response(
            output=output,
            http_response_class=BadRequest,
            *args, **kwargs
        )

    # Response processing and paginating

    def response(self, output='', http_response_class=HttpResponse):
        """
        Takes some object and serialize it, then converts it to HttpResponse
        with the correct mimetype

        If nothig is passed the response is empty
        """
        if output != '':
            output = self._serialize(self._paginate(output))
        return http_response_class(output, mimetype='application/json')

    def _paginate(self, queryset):
        """
        Paginates the response if it is a QuerySet, a list or a tuple
        """
        if (isinstance(queryset, (QuerySet, list, tuple)) and
                self.page_size is not None):
            offset = (self.page_number - 1) * self.page_size
            queryset = queryset[offset:offset + self.page_size]
        return queryset

    def _serialize(self, data):
        """
        Serialize a queryset or anything into a JSON object that can be
        consumed by Spine.js.
        """
        kwargs = {}
        if not self.request.is_ajax():
            kwargs['indent'] = 2

        return self.JSONEncoder(**kwargs).encode(data)

    # Class methods

    @classmethod
    def get_urls(cls):
        """
        Returns the URLs for the API handler, so you don't have to do anything
        just:

            api_urls = UserAPI.get_urls()

            urlpatterns = patterns('',
                url(r'^users/$', EditUsers.as_view(),
                    name='users_edit'),
                *api_urls
            )
        """
        urls = (
            cls._get_url_pattern(),
            cls._get_url_pattern(add_pk=True),
        )
        return urls

    @classmethod
    def _get_url_pattern(cls, add_pk=False):
        pk_pattern = cls.pk_pattern if add_pk else r''
        my_url = r'^{0}{1}$'.format(cls.get_url()[1:], pk_pattern)

        pk_name = cls.pk_name if add_pk else ''
        url_name = '{0}_{1}_{2}api'.format(
            cls.get_application_label(),
            cls.get_model_name(),
            pk_name
        )

        url_pattern = url(my_url, cls.as_view(), name=url_name)
        return url_pattern

    @classmethod
    def get_url(cls, url_pattern=r'/api/{0}/{1}/'):
        args = cls.get_application_label(), cls.get_model_name()
        return url_pattern.format(*args)

    @classmethod
    def get_application_label(cls):
        return get_app_label(cls)

    @classmethod
    def get_model_name(cls):
        if cls.model is not None:
            return cls.model._meta.object_name

    @classmethod
    def get_serialize_fields(cls):
        """
        Returns
            local: regular fields declared in the model
            simple: "has one" relations
            multple: "has many" relations
        """
        if not hasattr(cls, '_serialize_fields_cache'):
            all_fields = [fs.keys() for fs in get_field_names(cls.model)]
            all_fields = select_fields(all_fields, cls.serialize_fields)
            cls._serialize_fields_cache = all_fields

        return cls._serialize_fields_cache

    @classmethod
    def get_all_serialize_field_names(cls):
        local, single, multiple = cls.get_serialize_fields()
        fields = [f + '_id' for f in chain(single, multiple)]
        fields.extend(local)
        return fields

    @classmethod
    def get_form_fields(cls):
        fields = cls.get_all_serialize_field_names()
        model_fields = cls.model._meta.get_all_field_names()
        return [f for f in fields if f in model_fields]