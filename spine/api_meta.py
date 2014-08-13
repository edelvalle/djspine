
from django.utils.decorators import method_decorator


api_handlers = {}


def regist(api_class):
    if api_class.model is not None:
        global api_handlers
        api_handlers[api_class.model] = api_class


def model_get_api_url(cls):
    return api_handlers[cls].get_url()


def model_api_url(self):
    return self.get_api_url() + str(self.pk)


class SpineAPIMeta(type):
    def __new__(cls, *args, **kwargs):
        """Register the new handler for future models serializations.

        Apply decorators to methods.

        """
        new_class = super(SpineAPIMeta, cls).__new__(cls, *args, **kwargs)

        #register
        regist(new_class)

        #inject get_api_url method
        if new_class.model:
            new_class.model.get_api_url = classmethod(model_get_api_url)
            new_class.model.api_url = property(model_api_url)

        #decorate
        for method, decorators in new_class.method_decorators.iteritems():
            class_method = getattr(new_class, method, None)
            if class_method:
                for decorator in decorators:
                    class_method = method_decorator(decorator)(class_method)
                setattr(new_class, method, class_method)

        return new_class
