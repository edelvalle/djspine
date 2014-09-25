#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# --------------------------------------------------------------------------
# spine.apps
# --------------------------------------------------------------------------
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


from django.conf import settings
from django.utils.importlib import import_module
from django.apps import AppConfig, apps


class SpineConfig(AppConfig):

    name = 'spine'

    def ready(self):
        xoyuz = apps.get_app_config('xoyuz')
        xoyuz.register_bundle(
            'spine.js',
            files=(
                'js/underscore.js',
                'js/spine/spine.js',
                'js/spine/ajax.js',
                'js/spine-contrib/helpers.js',
            )
        )

        # TODO: use apps registry.
        for app_name in settings.INSTALLED_APPS:
            try:
                import_module('%s.api' % app_name)
            except ImportError:
                pass
