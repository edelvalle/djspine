#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

version = '1.2.23'

setup(
    name='spine',
    version=version,
    author='Eddy Ernesto del Valle Pino',
    author_email='xigmatron@gmail.com',
    description=(
        'Provides a REST API between Django and  Spine.js',
    ),
    long_description=read('README'),
    license='GPL',
    classifiers=[
        'Development Status :: 5 - Stable',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: GPL',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP',
    ],
    keywords='rest api spine django',
    url='',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'Django>=1.5,<1.8',
        'xoutil>=1.6,<1.7',
        'xoyuz>=1.1,<1.2',
        'python-dateutil>=2.1,<3'
    ],
)
