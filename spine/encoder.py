
import json
import datetime
from decimal import Decimal
from itertools import chain

from django.db.models.fields.files import FieldFile
from django.db.models.query import QuerySet

from .utils import object_to_dict


class SpineJSONEncoder(json.JSONEncoder):
    """
    JSON encoder that converts additional Python types to JSON.
    """
    def default(self, obj):
        """
        Converts during json serialization:
            - datetime objects to ISO-compatible strings
            - RelatedManagers to QuerySet
            - FieldFile to its download URL
            - QuerySet to tuple
            - Model into a dictionary with all its serializable fields
            - Call the callables
        """
        from .api import api_handlers

        if isinstance(obj, Decimal):
            return float(obj)

        if isinstance(obj, (datetime.datetime, datetime.date, datetime.time)):
            return obj.isoformat()

        elif isinstance(obj, FieldFile):
            return obj.url if obj else None

        elif isinstance(obj, QuerySet) or hasattr(obj, '__iter__'):
            return tuple(obj)

        elif type(obj) in api_handlers:
            api_handler = api_handlers[type(obj)]
            local, single, multiple = api_handler.get_serialize_fields()
            obj = object_to_dict(obj, chain(local, single, multiple))
            for field_name in obj.keys():
                if field_name in single:
                    instance = obj.pop(field_name)
                    if instance is not None:
                        instance = instance.pk
                    obj[field_name + '_id'] = instance
                elif field_name in multiple:
                    qs = obj.pop(field_name).all()
                    obj[field_name + '_id'] = qs.values_list('pk', flat=True)
            return obj
        elif callable(obj):
            return obj()

        msg = '%s: %s, is not JSON serializable' % (type(obj), repr(obj))
        raise TypeError(msg)
