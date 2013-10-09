
from django.conf import settings
from django.utils.importlib import import_module


api_modules = set()

for app_name in settings.INSTALLED_APPS:
    try:
        api_modules.add(import_module('%s.api' % app_name))
    except ImportError:
        pass
