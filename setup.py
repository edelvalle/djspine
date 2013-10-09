#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from setuptools import setup, find_packages


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

version = '1.0.0'

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
    setup_requires=['setuptools-git'],
    install_requires=[
        'Django',
    ],
)
