#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#       utils.py
#
#       Copyright 2012 Eddy Ernesto del Valle Pino <edelvalle@hab.uci.cu>
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


import sys
from functools import wraps
from django.http import HttpResponseForbidden


def get_app_label(any_thing):
    """
    If any thing is not a class it is converted to its type
    Resolves the application label of the class
    If the class is a Model this function can get better results
    """
    klass = any_thing if isinstance(any_thing, type) else type(any_thing)
    if hasattr(klass, '_meta') and hasattr(klass._meta, 'app_label'):
        app_label = klass._meta.app_label
    else:
        model_module = sys.modules[klass.__module__]
        app_label = model_module.__name__.split('.')[-2]
    return app_label


def flatten_dict(dct):
    """
    Converts a MultiDict into a dict
    """
    result = {}
    for k in dct.keys():
        result[str(k)] = dct.get(k)
    return result


def object_to_dict(obj, attrs):
    """
    Converts a object to a dict using the attrs parameter, if the attribute is
    not found is not returned in the dict
    """
    result = {}
    for attr in attrs:
        try:
            value = getattr(obj, attr, None)
            if callable(value):
                value = value()
            result[attr] = value
        except ValueError:
            if obj.pk is not None:
                raise
    return result


def get_api_classes(api_module):
    """
    Given a module returns all the SpineAPI subclasses that
    has a model deffined
    """
    from .api import SpineAPI
    for attr_name in dir(api_module):
        attr = getattr(api_module, attr_name)
        if (isinstance(attr, type) and
                attr is not SpineAPI and
                issubclass(attr, SpineAPI) and
                attr.get_model_name()):
            yield attr


def select_fields(all_fields, suggested=None):
    if suggested is not None:
        suggested = set(suggested)
        all_fields = [set(fs).intersection(suggested) for fs in all_fields]
        for field_set in all_fields:
            suggested.difference_update(field_set)
        all_fields[0] = all_fields[0].union(suggested)
    return all_fields


def check_permissions(*actions):
    def decorator(method):
        @wraps(method)
        def wrapper(self, request, *args, **kwargs):
            if self.permission_checking:
                has_perm = request.user.has_perm
                app = self.model._meta.app_label
                model = self.model._meta.module_name
                perms = [
                    '{app}.{action}_{model}'.format(**locals())
                    for action in actions
                ]
                if all(not has_perm(perm) for perm in perms):
                    return HttpResponseForbidden('Error 403: Forbidden')
            return method(self, request, *args, **kwargs)
        return wrapper
    return decorator
