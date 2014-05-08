
# Uses bash instead of sh, so that .bashrc works correctly
SHELL = /bin/bash

all: js locale
	@echo "Done"


js:
	@echo "Compiling CoffeeScript..."
	@coffee -c --no-header spine/static

locale:
	@echo "Compiling locales..."
	@cd spine; django-admin.py compilemessages
