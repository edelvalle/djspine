#!/usr/bin/env python
# -*- encoding: utf-8 -*-
#----------------------------------------------------------------------
# spine.encoder
#----------------------------------------------------------------------
# Copyright (c) 2014 Merchise Autrement and Contributors
# All rights reserved.
#
# Author: Eddy Ernesto del Valle Pino <eddy@merchise.org>
# Contributors: see CONTRIBUTORS and HISTORY file
#
# This is free software; you can redistribute it and/or modify it under the
# terms of the LICENCE attached (see LICENCE file) in the distribution
# package.


from __future__ import (absolute_import as _py3_abs_imports,
                        division as _py3_division,
                        print_function as _py3_print,
                        unicode_literals as _py3_unicode)


from itertools import chain

from django.db.models.fields.files import FieldFile
from django.db.models.query import QuerySet

from .encoder_streamer import JSONEncoderStreamer
from .utils import object_to_dict


class SpineJSONEncoder(JSONEncoderStreamer):
    """JSON encoder that converts additional Python types to JSON."""

    def default(self, obj):
        """Convert during json serialization.

        - datetime objects to ISO-compatible strings
        - RelatedManagers to QuerySet
        - FieldFile to its download URL
        - QuerySet to tuple
        - Model into a dictionary with all its serializable fields
        - Call the callables

        """
        from .api_meta import api_handlers

        if hasattr(obj, '__json__'):
            return obj.__json__()

        if isinstance(obj, FieldFile):
            return obj.url if obj else None

        elif isinstance(obj, QuerySet) or hasattr(obj, '__iter__'):
            return tuple(obj)

        elif type(obj) in api_handlers:
            api_handler = api_handlers[type(obj)]
            local, single, multiple = api_handler.get_serialize_fields()
            obj = self.object_to_dict(obj, chain(local, single, multiple))
            if obj is not None:
                for field_name in obj.keys():
                    is_multiple = (
                        field_name in multiple or
                        hasattr(obj[field_name], 'all')
                    )
                    if field_name in single:
                        instance = obj.pop(field_name)
                        if instance is not None:
                            instance = instance.pk
                        obj[field_name + '_id'] = instance
                    elif is_multiple:
                        qs = obj.pop(field_name).all()
                        obj[field_name + '_id'] = qs.values_list(
                            'pk', flat=True
                        )
            return obj

        elif callable(obj):
            return obj()
        else:
            return super(SpineJSONEncoder, self).default(obj)

    def object_to_dict(self, obj, fields):
        try:
            return object_to_dict(obj, fields)
        except Exception as error:
            import logging
            import traceback
            logging.error(
                "Can't serialize: %s, because: %s.\n\nTraceback: %s.",
                obj,
                error,
                traceback.format_exc()
            )
            return None
