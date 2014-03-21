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

from xoutil.string import cut_suffix
from xoutil.iterators import first_non_null
from dateutil.parser import parse as parse_date

from django.db.models import DateField, TimeField, DateTimeField
from django.db.models.query import QuerySet
from django.db.models.fields import related
from django.db.models.fields.related import ManyRelatedObjectsDescriptor
from django.forms.models import modelform_factory
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.views.generic import View
from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _

from .utils import get_app_label, flatten_dict
from .utils import select_fields, check_permissions, login_required
from .api_meta import SpineAPIMeta
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
        local = [field.name for field in model._meta.fields if not field.rel]
        local.append('__unicode__')

        single, multiple = [], []

        related_types = {
            related.ManyRelatedObjectsDescriptor: multiple,
            related.ReverseManyRelatedObjectsDescriptor: multiple,
            related.ForeignRelatedObjectsDescriptor: multiple,
            related.SingleRelatedObjectDescriptor: single,
            related.ReverseSingleRelatedObjectDescriptor: single,
        }

        fields = [
            (fname, getattr(model, fname))
            for fname in dir(model)
            if fname not in local
        ]

        for field_name, field in fields:
            field_type = type(field)
            if field_type in related_types:
                related_types[field_type].append(field_name)

        _model_field_names_cache[model] = (local, single, multiple)

    return _model_field_names_cache[model]


class BadRequest(HttpResponse):
    def __init__(self, content='Bad request', status=400, *args, **kwargs):
        super(BadRequest, self).__init__(
            content=content, status=status, *args, **kwargs
        )


class SpineAPI(View):
    """
    Abstract class view, which makes it easy for subclasses to talk to
    Spine.js.

    Supported operations (copied from spine.js docs):
        create -> POST   /api/app_name/ModelName
        read   -> GET    /api/app_name/ModelName[/id]
        update -> PUT    /api/app_name/ModelName/id
        update -> PUT    /api/app_name/ModelName/id/method
        delete -> DELETE /api/app_name/ModelName/id
    """

    __metaclass__ = SpineAPIMeta

    # Key pattern for url with id
    pk_pattern = r'(?P<id>\d+)'
    # Prefix for url with id
    pk_name = 'pk_'

    # Manager methods allowed to use for queryset
    manager_methods = ()

    # Model methods allowed to use in PUT requests
    model_methods = ()

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
    #   def get(self, ...):
    #      ....
    # or:
    #
    #   get = method_decorator(login_required)(SpineAPI.get)
    #
    method_decorators = {}

    # Checks the permissions for the get, post, put and delete request
    permission_checking = True

    def __init__(self, *args, **kwargs):
        super(SpineAPI, self).__init__(*args, **kwargs)
        self._data = None

    @property
    def base_queryset(self):
        """
        Override this to return another query set
        Ex: self.model.objects.filter(user=self.request.user)
        """
        return self.model.objects

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

            # Delete the page_param and manager_methods from the data
            data.pop(self.page_param_name, None)
            for manager_method_name in self.manager_methods:
                data.pop(manager_method_name, None)

            # Extract the pks of related fields
            local, single, multiple = self.get_serialize_fields()
            relational = list(chain(single, multiple))
            date_fields = {
                field.name
                for field in self.model._meta.fields
                if isinstance(field, (DateField, TimeField, DateTimeField))
            }

            for field_name, value in data.items():
                cuted_field = cut_suffix(field_name, '_id')
                if field_name.endswith('_id') and cuted_field in relational:
                    field_name = cuted_field
                field_base_name = field_name.split('__', 1)[0]
                if value is not None and field_base_name in date_fields:
                    value = parse_date(value)
                data[field_name] = value
            self._data = data
        return self._data

    @property
    def _real_data(self):
        content_type = self.request.META.get('CONTENT_TYPE') or ''
        if content_type.startswith('application/json'):
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
    @login_required
    def get(self, request, id=None, *args, **kwargs):
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
        method_name = first_non_null(
            (
                manager_method_name
                for manager_method_name in self.manager_methods
                if manager_method_name in self._real_data
            ),
            default='filter'
        )
        method = getattr(self.base_queryset, method_name)
        queryset = method(**self.data)
        if queryset is None:
            queryset = []
        return self.success_response(queryset)

    # POST & PUT requests
    @check_permissions('add')
    def post(self, request, *args, **kwargs):
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

    @check_permissions('change')
    def put(self, request, id=None, method=None):
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

        if method is None:
            return self._process_form(self.edit_form_class, instance=instance)
        else:
            if method in self.model_methods:
                getattr(instance, method)(**self._real_data)
                instance.save()
                return self.success_response(instance)
            else:
                return self.validation_error_response(
                    instance,
                    output=_('Method "{0}" not allowed').format(method)
                )

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
            if form.instance.pk:
                item = self.model.objects.get(pk=form.instance.pk)
            else:
                item = form.instance

            errors = {
                name: ' '.join(msgs)
                for name, msgs in form.errors.items()
            }
            return self.validation_error_response(item, errors)

    # Delete request
    @check_permissions('delete')
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

    def validation_error_response(self, item, output, *args, **kwargs):
        """
        Return an BadRequest indicating that input validation failed.

        The form_errors argument contains the contents of form.errors, and you
        can override this method is you want to use a specific error
        response format.
        By default, the output is a simple text response.
        """
        output = {'instance': item, 'errors': output}
        return self.response(
            output=output,
            http_response_class=BadRequest,
            *args, **kwargs
        )

    # Response processing and paginating

    def response(self, output='', http_response_class=HttpResponse):
        """
        Takes some object and serialize it, then converts it to HttpResponse
        with the correct content type

        If nothing is passed the response is empty
        """
        if output != '':
            output = self._serialize(self._paginate(output))
        return http_response_class(output, content_type='application/json')

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
        pk_pattern = ''
        if add_pk:
            pk_pattern = r'/' + cls.pk_pattern + r'(/(?P<method>\w+))?'

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
    def get_url(cls, url_pattern=r'/api/{0}/{1}'):
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
            all_fields = get_field_names(cls.model)
            all_fields = select_fields(all_fields, cls.serialize_fields)
            cls._serialize_fields_cache = all_fields

        return cls._serialize_fields_cache

    @classmethod
    def get_all_serialize_field_names(cls):
        local, single, multiple = cls.get_serialize_fields()
        return chain(local, single, multiple)

    @classmethod
    def get_all_serialized_field_names_wih_ids(cls):
        local, single, multiple = cls.get_serialize_fields()
        single = [s + '_id' for s in single]
        multiple = [s + '_ids' for s in multiple]
        return chain(local, single, multiple)

    @classmethod
    def get_form_fields(cls):
        fields = cls.get_all_serialize_field_names()
        model_fields = cls.model._meta.get_all_field_names()
        return [
            f
            for f in fields
            if f in model_fields and
            not isinstance(
                getattr(cls.model, f, None),
                ManyRelatedObjectsDescriptor
            )
        ]
