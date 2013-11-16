// Generated by CoffeeScript 1.6.3
(function() {
  var ENTER, RIGHT_MOUSE_BUTTON, csrf_token, _base, _base1, _base10, _base11, _base12, _base13, _base14, _base15, _base16, _base17, _base18, _base19, _base2, _base20, _base21, _base22, _base23, _base24, _base25, _base26, _base27, _base28, _base29, _base3, _base30, _base31, _base32, _base33, _base34, _base35, _base36, _base4, _base5, _base6, _base7, _base8, _base9, _ref, _ref1, _ref2,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $.query = function(query_data) {
    return {
      data: JSON.stringify(query_data || {}),
      contentType: 'application/json'
    };
  };

  $.fn.htmlTemplate = function() {
    var args, _ref, _ref1;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.html()) != null ? (_ref1 = _ref.trim()) != null ? _ref1.template.apply(_ref1, args) : void 0 : void 0;
  };

  $.getSelectedElements = function(selector) {
    var range, selection;
    selection = window.getSelection();
    range = [];
    if (selection.rangeCount) {
      range = selection.getRangeAt(0).cloneContents().childNodes;
    }
    if (selector != null) {
      return jQuery(selector, range);
    } else {
      return jQuery(range);
    }
  };

  $.getCookies = function() {
    var attr_name, cookie, cookies, value, _i, _len, _ref, _ref1;
    cookies = {};
    _ref = document.cookie.split('; ');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cookie = _ref[_i];
      _ref1 = cookie.split('='), attr_name = _ref1[0], value = _ref1[1];
      cookies[attr_name] = value;
    }
    return cookies;
  };

  $.setCookie = function(name, value) {
    return document.cookie = "" + name + "=" + value;
  };

  $.getCookie = function(name) {
    return $.getCookies()[name];
  };

  $.fn.setChecked = function(value) {
    if (value) {
      return this.attr('checked', 'checked');
    } else {
      return this.removeAttr('checked');
    }
  };

  if ((_base = Array.prototype).each == null) {
    _base.each = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.each.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base1 = Array.prototype).map == null) {
    _base1.map = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.map.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base2 = Array.prototype).reduce == null) {
    _base2.reduce = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.reduce.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base3 = Array.prototype).find == null) {
    _base3.find = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.find.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base4 = Array.prototype).filter == null) {
    _base4.filter = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.filter.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base5 = Array.prototype).extend == null) {
    _base5.extend = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.extend.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base6 = Array.prototype).reject == null) {
    _base6.reject = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.reject.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base7 = Array.prototype).every == null) {
    _base7.every = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.every.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base8 = Array.prototype).all == null) {
    _base8.all = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.all.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base9 = Array.prototype).some == null) {
    _base9.some = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.some.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base10 = Array.prototype).any == null) {
    _base10.any = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.any.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base11 = Array.prototype).max == null) {
    _base11.max = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.max.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base12 = Array.prototype).min == null) {
    _base12.min = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.min.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base13 = Array.prototype).sortBy == null) {
    _base13.sortBy = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.sortBy.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base14 = Array.prototype).groupBy == null) {
    _base14.groupBy = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.groupBy.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base15 = Array.prototype).countBy == null) {
    _base15.countBy = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.countBy.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base16 = Array.prototype).first == null) {
    _base16.first = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.first.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base17 = Array.prototype).initial == null) {
    _base17.initial = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.initial.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base18 = Array.prototype).last == null) {
    _base18.last = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.last.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base19 = Array.prototype).rest == null) {
    _base19.rest = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.rest.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base20 = Array.prototype).tail == null) {
    _base20.tail = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.tail.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base21 = Array.prototype).flatten == null) {
    _base21.flatten = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.flatten.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base22 = Array.prototype).without == null) {
    _base22.without = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.without.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base23 = Array.prototype).union == null) {
    _base23.union = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.union.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base24 = Array.prototype).intersection == null) {
    _base24.intersection = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.intersection.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base25 = Array.prototype).difference == null) {
    _base25.difference = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.difference.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base26 = Array.prototype).uniq == null) {
    _base26.uniq = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.uniq.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base27 = Array.prototype).zip == null) {
    _base27.zip = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.zip.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base28 = Array.prototype).object == null) {
    _base28.object = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.object.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base29 = Array.prototype).indexOf == null) {
    _base29.indexOf = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.indexOf.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base30 = Array.prototype).lastIndexOf == null) {
    _base30.lastIndexOf = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.lastIndexOf.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base31 = Array.prototype).sortedIndex == null) {
    _base31.sortedIndex = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.sortedIndex.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base32 = Array.prototype).compact == null) {
    _base32.compact = function() {
      return _.compact(this);
    };
  }

  if ((_base33 = Array.prototype).shuffle == null) {
    _base33.shuffle = function() {
      return _.shuffle(this);
    };
  }

  if ((_base34 = String.prototype).template == null) {
    _base34.template = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.template.apply(_, [this].concat(__slice.call(args)));
    };
  }

  if ((_base35 = String.prototype).escape == null) {
    _base35.escape = function() {
      return _.escape(this);
    };
  }

  if ((_base36 = String.prototype).unescape == null) {
    _base36.unescape = function() {
      return _.unescape(this);
    };
  }

  csrf_token = $.getCookie('csrftoken');

  $(document).ajaxSend(function(e, xhr, settings) {
    return xhr.setRequestHeader('X-CSRFToken', csrf_token);
  });

  $(function() {
    var $loading;
    $loading = $('#loading-img');
    if ($loading.length) {
      $(document).ajaxStart(function() {
        return $loading.fadeIn();
      });
      return $(document).ajaxStop(function() {
        return $loading.fadeOut('fast');
      });
    }
  });

  Spine.Model.updateInstance = function(old_instance, instance) {
    var attr, value, _ref;
    _ref = (typeof instance.attributes === "function" ? instance.attributes() : void 0) || instance;
    for (attr in _ref) {
      value = _ref[attr];
      old_instance[attr] = value;
    }
    old_instance.trigger('update');
    return old_instance;
  };

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.FormController = (function(_super) {
      __extends(FormController, _super);

      FormController.prototype.Model = null;

      FormController.prototype.elements = {
        '[name]': 'fields',
        '.control-group': 'control_groups'
      };

      FormController.prototype.events = {
        'submit': 'submit'
      };

      FormController.prototype.get_field = function(name) {
        return this.fields.filter("[name=" + name + "]");
      };

      FormController.prototype.field_value = function(name, value) {
        var field;
        field = this.get_field(name);
        if (value != null) {
          field.val(value);
          return field.filter('img').attr('src', value);
        } else {
          return field.val();
        }
      };

      function FormController() {
        this.on_saved = __bind(this.on_saved, this);
        this.save = __bind(this.save, this);
        this.submit = __bind(this.submit, this);
        this.populate_instance = __bind(this.populate_instance, this);
        this.populate_fields = __bind(this.populate_fields, this);
        this.reset_form = __bind(this.reset_form, this);
        this.hide_errors = __bind(this.hide_errors, this);
        this.show_errors = __bind(this.show_errors, this);
        FormController.__super__.constructor.apply(this, arguments);
        this.init_instance();
      }

      FormController.prototype.init_instance = function(options) {
        if ((options != null ? options.instance : void 0) != null) {
          this.instance = options.instance;
        }
        if (options != null ? options.force : void 0) {
          this.instance = new this.Model;
        } else {
          if (this.instance == null) {
            this.instance = new this.Model;
          }
        }
        this.populate_fields();
        return this.bind_instance();
      };

      FormController.prototype.bind_instance = function() {
        this.instance.bind('ajaxError', this.show_errors);
        return this.instance.bind('ajaxSuccess', this.on_saved);
      };

      FormController.prototype.unbind_instance = function() {
        this.instance.unbind('ajaxError', this.show_errors);
        return this.instance.unbind('ajaxSuccess', this.on_saved);
      };

      FormController.prototype.show_errors = function(_instance, xhr) {
        var errors, instance, parse_error_response, restore_instance_state, show_errors, _ref,
          _this = this;
        parse_error_response = function(xhr) {
          var error, error_data;
          try {
            error_data = JSON.parse(xhr.responseText);
            if (!'errors' in error_data || !'instance' in error_data) {
              throw SyntaxError;
            }
          } catch (_error) {
            error = _error;
            if (xhr.status !== 200) {
              alert('Error: there is a communication error!');
            }
            throw error;
          }
          return [error_data.instance, error_data.errors];
        };
        _ref = parse_error_response(xhr), instance = _ref[0], errors = _ref[1];
        (restore_instance_state = function() {
          if (_this.instance.cid === _this.instance.id) {
            _this.instance.id = null;
          }
          return _this.instance = Spine.Model.updateInstance(_this.instance, instance);
        })();
        return (show_errors = function() {
          var attr, msg, _results;
          if (errors.__all__ != null) {
            _this.el.prepend("<div class=\"alert hide alert-error text-center\">\n    " + errors.__all__ + "\n</div>");
            _this.$('.alert').slideDown();
          }
          _results = [];
          for (attr in errors) {
            msg = errors[attr];
            _results.push((_this.get_field(attr)).parents('.control-group').addClass('error').tooltip({
              title: msg
            }).tooltip('show'));
          }
          return _results;
        })();
      };

      FormController.prototype.hide_errors = function() {
        (this.control_groups.removeClass('error')).tooltip('destroy');
        return this.$('.alert').slideUp('fast', function() {
          return this.remove();
        });
      };

      FormController.prototype.reset_form = function() {
        this.fields.val('');
        return this.hide_errors();
      };

      FormController.prototype.populate_fields = function() {
        var attr, value, _ref, _results;
        this.reset_form();
        _ref = this.instance.attributes();
        _results = [];
        for (attr in _ref) {
          value = _ref[attr];
          _results.push(this.field_value(attr, value));
        }
        return _results;
      };

      FormController.prototype.populate_instance = function() {
        var $field, field, modified, name, value, _i, _len, _ref;
        modified = false;
        _ref = this.fields;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          $field = $(field);
          name = $field.attr('name');
          value = this.field_value(name);
          if (this.instance[name] !== value) {
            this.instance[name] = value;
            modified = true;
          }
        }
        return modified;
      };

      FormController.prototype.submit = function(e) {
        if (e != null) {
          if (typeof e.preventDefault === "function") {
            e.preventDefault();
          }
        }
        return this.save();
      };

      FormController.prototype.save = function() {
        if (this.populate_instance()) {
          this.hide_errors();
          return this.instance.save();
        }
      };

      FormController.prototype.on_saved = function(old_instance, new_instance) {
        var _ref;
        this.reset_form();
        this.instance = Spine.Model.updateInstance(this.instance, new_instance);
        this.unbind_instance();
        return (_ref = this.parent) != null ? typeof _ref.hide === "function" ? _ref.hide() : void 0 : void 0;
      };

      return FormController;

    })(Spine.Controller);
  };

  ENTER = 13;

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.ItemController = (function(_super) {
      __extends(ItemController, _super);

      ItemController.prototype.elements = {
        '[contenteditable]': 'fields',
        '[contenteditable]': 'control_groups'
      };

      ItemController.prototype.events = {
        'keydown [contenteditable][name]': 'trigger_field_change',
        'blur [contenteditable][name]': 'trigger_field_change',
        'change [name]': 'save'
      };

      function ItemController() {
        this.unbind_instance = __bind(this.unbind_instance, this);
        this.reset_form = __bind(this.reset_form, this);
        this.render = __bind(this.render, this);
        this.render_on_update = __bind(this.render_on_update, this);
        this.destroy = __bind(this.destroy, this);
        this.destroy_instance = __bind(this.destroy_instance, this);
        this.trigger_field_change = __bind(this.trigger_field_change, this);
        this.bind_instance = __bind(this.bind_instance, this);
        ItemController.__super__.constructor.apply(this, arguments);
      }

      ItemController.prototype.field_value = function(name, value) {
        var field;
        field = this.get_field(name);
        if (value != null) {
          return field.text(String(value).escape());
        } else {
          return (field.text() || '').trim().unescape();
        }
      };

      ItemController.prototype.bind_instance = function() {
        ItemController.__super__.bind_instance.apply(this, arguments);
        this.instance.bind('update', this.render_on_update);
        return this.instance.bind('destroy', this.destroy);
      };

      ItemController.prototype.trigger_field_change = function(e) {
        if (e.keyCode === ENTER) {
          e.preventDefault();
        }
        if (e.type === 'focusout' || e.keyCode === ENTER) {
          return $(e.target).trigger('change');
        }
      };

      ItemController.prototype.destroy_instance = function() {
        if (confirm(gettext('Are you sure?'))) {
          return this.instance.destroy();
        }
      };

      ItemController.prototype.destroy = function() {
        return this.el.fadeOut('fast', this.release);
      };

      ItemController.prototype.render_on_update = function() {
        this.render();
        return window.getSelection().removeAllRanges();
      };

      ItemController.prototype.render = function() {
        return this.replace(this.template(this.instance));
      };

      ItemController.prototype.reset_form = function() {
        this.fields.text('');
        return this.hide_errors();
      };

      ItemController.prototype.unbind_instance = function() {};

      return ItemController;

    })(Spine.FormController);
  };

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.ModalController = (function(_super) {
      __extends(ModalController, _super);

      ModalController.prototype.BodyController = null;

      ModalController.prototype.elements = {
        '.title': 'title',
        '.modal-body': 'body',
        '[name]:visible': 'first_visible_field'
      };

      ModalController.prototype.events = {
        'click .cancel': 'hide',
        'click .save': 'save'
      };

      function ModalController() {
        this.save = __bind(this.save, this);
        this.shown = __bind(this.shown, this);
        this.hidden = __bind(this.hidden, this);
        this.hide = __bind(this.hide, this);
        this.show = __bind(this.show, this);
        ModalController.__super__.constructor.apply(this, arguments);
        this.el.on('hidden', this.hidden);
        this.el.on('shown', this.shown);
        this.body_controller = new this.BodyController({
          parent: this,
          el: this.body,
          options: this.body_init
        });
      }

      ModalController.prototype.show = function(options) {
        var _base37;
        if ((options != null ? options.title : void 0) != null) {
          this.title.html(title);
        }
        if (typeof (_base37 = this.body_controller).init_instance === "function") {
          _base37.init_instance(options);
        }
        return this.el.modal('show');
      };

      ModalController.prototype.hide = function() {
        return this.el.modal('hide');
      };

      ModalController.prototype.hidden = function() {
        var _base37;
        return typeof (_base37 = this.body_controller).init_instance === "function" ? _base37.init_instance({
          force: true
        }) : void 0;
      };

      ModalController.prototype.shown = function() {
        return this.$('[type][name]:visible:first').focus();
      };

      ModalController.prototype.save = function() {
        var _ref;
        return (_ref = this.body_controller) != null ? typeof _ref.save === "function" ? _ref.save() : void 0 : void 0;
      };

      return ModalController;

    })(Spine.Controller);
  };

  RIGHT_MOUSE_BUTTON = 3;

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.DropdownController = (function(_super) {
      __extends(DropdownController, _super);

      function DropdownController() {
        this.hide = __bind(this.hide, this);
        this.show = __bind(this.show, this);
        _ref = DropdownController.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DropdownController.open = null;

      DropdownController.set_open = function(menu) {
        menu.el.slideDown('fast');
        Spine.DropdownController.hide_open();
        return Spine.DropdownController.open = menu;
      };

      DropdownController.hide_open = function(e) {
        var _ref1;
        if ((e == null) || (e != null ? e.which : void 0) !== RIGHT_MOUSE_BUTTON) {
          return (_ref1 = Spine.DropdownController.open) != null ? _ref1.hide() : void 0;
        }
      };

      DropdownController.prototype.show = function(e) {
        var positionate_under_the_mouse,
          _this = this;
        if (((e != null ? e.pageX : void 0) != null) && ((e != null ? e.pageY : void 0) != null)) {
          (positionate_under_the_mouse = function() {
            return _this.el.css({
              left: e.pageX,
              top: e.pageY
            });
          })();
        }
        return Spine.DropdownController.set_open(this);
      };

      DropdownController.prototype.hide = function() {
        this.el.slideUp('fast');
        if (Spine.DropdownController.open === this) {
          return Spine.DropdownController.open = null;
        }
      };

      return DropdownController;

    })(Spine.Controller);
  };

  if ((typeof Spine !== "undefined" && Spine !== null ? Spine.DropdownController : void 0) != null) {
    $(window).bind('click', Spine.DropdownController.hide_open);
  }

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.EditionDropdown = (function(_super) {
      __extends(EditionDropdown, _super);

      function EditionDropdown() {
        this.remove_instances = __bind(this.remove_instances, this);
        this.selected_references = __bind(this.selected_references, this);
        this.focus_name = __bind(this.focus_name, this);
        _ref1 = EditionDropdown.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      EditionDropdown.prototype.events = {
        'click .rename-action': 'focus_name',
        'click .remove-action': 'remove_instances'
      };

      EditionDropdown.prototype.name_attr = 'name';

      EditionDropdown.prototype.focus_name = function(e) {
        if (e != null) {
          e.preventDefault();
        }
        return (this.item.get_field(this.name_attr)).focus();
      };

      EditionDropdown.prototype.selected_references = function() {
        var selected, _i, _len, _ref2, _results;
        _ref2 = $('.ui-selected[data-model][data-id]');
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          selected = _ref2[_i];
          _results.push({
            model: selected.getAttribute('data-model'),
            id: +selected.getAttribute('data-id')
          });
        }
        return _results;
      };

      EditionDropdown.prototype.remove_instances = function(e) {
        var reference, references, _i, _len, _results;
        if (e != null) {
          e.preventDefault();
        }
        references = this.selected_references();
        if (references.length && confirm(gettext('Are you sure?'))) {
          _results = [];
          for (_i = 0, _len = references.length; _i < _len; _i++) {
            reference = references[_i];
            _results.push(eval(reference.model).destroy(reference.id));
          }
          return _results;
        } else {
          return this.item.destroy_instance();
        }
      };

      return EditionDropdown;

    })(Spine.DropdownController);
  };

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.ItemWithContextualMenu = (function(_super) {
      __extends(ItemWithContextualMenu, _super);

      function ItemWithContextualMenu() {
        this.show_dropdown = __bind(this.show_dropdown, this);
        this.refreshElements = __bind(this.refreshElements, this);
        _ref2 = ItemWithContextualMenu.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      ItemWithContextualMenu.prototype.DropdownController = Spine.DropdownController;

      ItemWithContextualMenu.prototype.events = _.extend(_.clone(Spine.ItemController.prototype.events), {
        'contextmenu .contextual-dropdown': 'show_dropdown'
      });

      ItemWithContextualMenu.prototype.elements = _.extend(_.clone(Spine.ItemController.prototype.elements), {
        'ul.dropdown-menu': 'menu'
      });

      ItemWithContextualMenu.prototype.refreshElements = function() {
        var _ref3;
        ItemWithContextualMenu.__super__.refreshElements.apply(this, arguments);
        if ((_ref3 = this.menu_controller) != null) {
          _ref3.release();
        }
        return this.menu_controller = new this.DropdownController({
          el: this.menu,
          item: this
        });
      };

      ItemWithContextualMenu.prototype.show_dropdown = function(e) {
        e.preventDefault();
        return this.menu_controller.show(e);
      };

      return ItemWithContextualMenu;

    })(Spine.ItemController);
  };

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.ListController = (function(_super) {
      __extends(ListController, _super);

      ListController.prototype.item_controllers = {};

      ListController.prototype.default_query = function() {
        return {};
      };

      ListController.prototype.container = function() {
        return this.el;
      };

      function ListController() {
        this.release_item = __bind(this.release_item, this);
        this.add = __bind(this.add, this);
        var Model, name, query, _i, _len, _ref3;
        ListController.__super__.constructor.apply(this, arguments);
        this.items = [];
        _ref3 = (function() {
          var _results;
          _results = [];
          for (name in this.item_controllers) {
            _results.push(eval(name));
          }
          return _results;
        }).call(this);
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          Model = _ref3[_i];
          query = this.default_query(Model);
          if (query != null) {
            Model.bind('refresh', this.add);
            Model.fetch($.query(query));
          }
        }
      }

      ListController.prototype.add = function(instances) {
        var added_items, instance, item, _i, _len;
        added_items = [];
        for (_i = 0, _len = instances.length; _i < _len; _i++) {
          instance = instances[_i];
          item = this.get_item(instance);
          if (item && __indexOf.call(this.items, item) < 0) {
            this.container().append(item.render());
            this.items.push(item);
            added_items.push(item);
          }
        }
        return added_items;
      };

      ListController.prototype.release_item = function(item) {
        return this.items = this.items.without(item);
      };

      ListController.prototype.get_item = function(instance) {
        var ItemController, item;
        item = this.items.find(function(item) {
          return instance.constructor === item.instance.constructor && ((instance.cid === item.instance.cid) || (instance.id && instance.id === item.instance.id));
        });
        if (item != null) {
          Spine.Model.updateInstance(item.instance, instance);
        } else {
          ItemController = _.find(this.item_controllers, function(controller, name) {
            return instance.constructor.className === name;
          });
          item = new ItemController({
            instance: instance
          });
          item.bind('release', this.release_item);
        }
        return item;
      };

      return ListController;

    })(Spine.Controller);
  };

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.InfiniteListController = (function(_super) {
      __extends(InfiniteListController, _super);

      InfiniteListController.prototype.ScrollingModel = null;

      function InfiniteListController() {
        this.activate_infinite_loading = __bind(this.activate_infinite_loading, this);
        this.load_more = __bind(this.load_more, this);
        this.add = __bind(this.add, this);
        InfiniteListController.__super__.constructor.apply(this, arguments);
        this.page_number = 1;
        this.infinite_load = false;
      }

      InfiniteListController.prototype.add = function() {
        var items_added, last_item;
        items_added = InfiniteListController.__super__.add.apply(this, arguments);
        last_item = items_added.last();
        if ((last_item != null ? last_item.instance.constructor : void 0) === this.ScrollingModel) {
          if (this.infinite_load) {
            this.load_more();
          } else {
            last_item.el.waypoint(this.load_more, {
              continuous: false,
              triggerOnce: true,
              offset: 'bottom-in-view'
            });
          }
        }
        return items_added;
      };

      InfiniteListController.prototype.load_more = function() {
        var query;
        this.page_number += 1;
        query = this.default_query(this.ScrollingModel);
        query.p = this.page_number;
        return this.ScrollingModel.fetch($.query(query));
      };

      InfiniteListController.prototype.activate_infinite_loading = function() {
        this.infinite_load = true;
        return this.load_more();
      };

      return InfiniteListController;

    })(Spine.ListController);
  };

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.InfiniteGridController = (function(_super) {
      __extends(InfiniteGridController, _super);

      function InfiniteGridController() {
        this.arrange = __bind(this.arrange, this);
        this.release_item = __bind(this.release_item, this);
        this.add = __bind(this.add, this);
        InfiniteGridController.__super__.constructor.apply(this, arguments);
        $(window).resize(this.arrange);
      }

      InfiniteGridController.prototype.add = function() {
        var added_items, items, last_item;
        last_item = this.items.last();
        items = last_item ? [last_item] : [];
        added_items = InfiniteGridController.__super__.add.apply(this, arguments);
        items = items.concat(added_items);
        this.arrange(items);
        return added_items;
      };

      InfiniteGridController.prototype.release_item = function(item) {
        var index;
        index = this.items.indexOf(item);
        this.arrange(this.items.slice(index + 1));
        return InfiniteGridController.__super__.release_item.apply(this, arguments);
      };

      InfiniteGridController.prototype.arrange = function(items) {
        var item, item_top, last_top, _i, _len, _results;
        if (!_.isArray(items)) {
          items = this.items;
        }
        if (items.length) {
          last_top = items.first().el.offset().top;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            item.el.removeClass('first');
            item_top = item.el.offset().top;
            if (item_top !== last_top) {
              item.el.addClass('first');
              item_top = item.el.offset().top;
            }
            _results.push(last_top = item_top);
          }
          return _results;
        }
      };

      return InfiniteGridController;

    })(Spine.InfiniteListController);
  };

}).call(this);

/*
//@ sourceMappingURL=helpers.map
*/
