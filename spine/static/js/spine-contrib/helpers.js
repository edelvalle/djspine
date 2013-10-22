// Generated by CoffeeScript 1.6.3
(function() {
  var ENTER, csrf_token, update, _ref, _ref1,
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
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.html().trim()).template.apply(_ref, args);
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

  Array.prototype.each = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.each.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.map = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.map.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.reduce = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.reduce.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.find = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.find.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.filter = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.filter.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.extend = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.extend.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.reject = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.reject.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.every = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.every.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.all = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.all.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.some = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.some.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.any = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.any.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.max = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.max.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.min = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.min.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.sortBy = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.sortBy.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.groupBy = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.groupBy.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.countBy = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.countBy.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.first = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.first.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.initial = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.initial.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.last = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.last.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.rest = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.rest.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.tail = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.tail.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.flatten = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.flatten.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.without = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.without.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.union = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.union.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.intersection = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.intersection.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.difference = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.difference.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.uniq = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.uniq.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.zip = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.zip.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.object = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.object.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.indexOf = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.indexOf.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.lastIndexOf = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.lastIndexOf.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.sortedIndex = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.sortedIndex.apply(_, [this].concat(__slice.call(args)));
  };

  Array.prototype.compact = function() {
    return _.compact(this);
  };

  Array.prototype.shuffle = function() {
    return _.shuffle(this);
  };

  String.prototype.template = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.template.apply(_, [this].concat(__slice.call(args)));
  };

  String.prototype.escape = function() {
    return _.escape(this);
  };

  String.prototype.unescape = function() {
    return _.unescape(this);
  };

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

  update = function(old_instance, instance) {
    instance = _.extend(old_instance, instance);
    instance.trigger('update');
    return instance;
  };

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.FormController = (function(_super) {
      __extends(FormController, _super);

      FormController.prototype.Model = null;

      FormController.prototype.elements = {
        '[name]': 'fields',
        '.control-group': 'control_groups'
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
        this.el.submit(this.submit);
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
          return _this.instance = update(_this.instance, instance);
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
        this.instance = update(this.instance, new_instance);
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
        this.instance.bind('update', this.populate_fields);
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
        if (confirm('Sure?')) {
          return this.instance.destroy();
        }
      };

      ItemController.prototype.destroy = function() {
        return this.el.fadeOut('fast', this.release);
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
          el: this.body
        });
      }

      ModalController.prototype.show = function(options) {
        if ((options != null ? options.title : void 0) != null) {
          this.title.html(title);
        }
        this.body_controller.init_instance(options);
        return this.el.modal('show');
      };

      ModalController.prototype.hide = function() {
        return this.el.modal('hide');
      };

      ModalController.prototype.hidden = function() {
        return this.body_controller.init_instance({
          force: true
        });
      };

      ModalController.prototype.shown = function() {
        return this.$('[name]:visible').focus();
      };

      ModalController.prototype.save = function() {
        var _ref;
        return (_ref = this.body_controller) != null ? typeof _ref.save === "function" ? _ref.save() : void 0 : void 0;
      };

      return ModalController;

    })(Spine.Controller);
  };

    if (typeof Spine !== "undefined" && Spine !== null) {
    Spine.DropdownController = (function(_super) {
      __extends(DropdownController, _super);

      DropdownController.prototype.events = {
        'click li': 'hide'
      };

      DropdownController.prototype.elements = {
        '*': 'children'
      };

      function DropdownController() {
        this.hide = __bind(this.hide, this);
        this.mouseout = __bind(this.mouseout, this);
        this.show = __bind(this.show, this);
        DropdownController.__super__.constructor.apply(this, arguments);
        this.el.bind('mouseout', this.mouseout);
      }

      DropdownController.prototype.show = function(e) {
        var positionate_under_the_mouse,
          _this = this;
        if (((e != null ? e.pageX : void 0) != null) && e.pageY) {
          (positionate_under_the_mouse = function() {
            return _this.el.css({
              left: e.pageX - 10,
              top: e.pageY - 17
            });
          })();
        }
        return this.el.slideDown('fast');
      };

      DropdownController.prototype.mouseout = function(e) {
        var to_element;
        to_element = e != null ? e.toElement : void 0;
        if (__indexOf.call(this.all_elements(), to_element) < 0) {
          return this.hide();
        }
      };

      DropdownController.prototype.hide = function() {
        return this.el.slideUp('fast');
      };

      DropdownController.prototype.all_elements = function() {
        var children;
        children = this.children.toArray();
        children.push(this.el[0]);
        return children;
      };

      return DropdownController;

    })(Spine.Controller);
  };

  Spine.EditionDropdown = (function(_super) {
    __extends(EditionDropdown, _super);

    function EditionDropdown() {
      this.remove_instances = __bind(this.remove_instances, this);
      this.focus_name = __bind(this.focus_name, this);
      _ref = EditionDropdown.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    EditionDropdown.prototype.events = _.extend(_.clone(Spine.DropdownController.prototype.events), {
      'click .rename-action': 'focus_name',
      'click .remove-action': 'remove_instances'
    });

    EditionDropdown.prototype.name_attr = 'name';

    EditionDropdown.prototype.focus_name = function() {
      return (this.item.get_field(this.name_attr)).focus();
    };

    EditionDropdown.prototype.remove_instances = function() {
      var Model, all_selected, id, references, selected, _i, _j, _len, _len1, _ref1, _results;
      all_selected = $.getSelectedElements('[data-model][data-id]');
      if (all_selected.length && confirm('Sure?')) {
        references = [];
        for (_i = 0, _len = all_selected.length; _i < _len; _i++) {
          selected = all_selected[_i];
          references.push([eval(selected.getAttribute('data-model')), +selected.getAttribute('data-id')]);
        }
        _results = [];
        for (_j = 0, _len1 = references.length; _j < _len1; _j++) {
          _ref1 = references[_j], Model = _ref1[0], id = _ref1[1];
          _results.push(Model.destroy(id));
        }
        return _results;
      } else {
        return this.item.destroy_instance();
      }
    };

    return EditionDropdown;

  })(Spine.DropdownController);

  Spine.ItemWithContextualMenu = (function(_super) {
    __extends(ItemWithContextualMenu, _super);

    function ItemWithContextualMenu() {
      this.show_dropdown = __bind(this.show_dropdown, this);
      this.refreshElements = __bind(this.refreshElements, this);
      _ref1 = ItemWithContextualMenu.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ItemWithContextualMenu.prototype.DropdownController = Spine.DropdownController;

    ItemWithContextualMenu.prototype.events = _.extend(_.clone(Spine.ItemController.prototype.events), {
      'contextmenu .contextual-dropdown': 'show_dropdown'
    });

    ItemWithContextualMenu.prototype.elements = _.extend(_.clone(Spine.ItemController.prototype.elements), {
      'ul.dropdown-menu': 'menu'
    });

    ItemWithContextualMenu.prototype.refreshElements = function() {
      var _ref2;
      ItemWithContextualMenu.__super__.refreshElements.apply(this, arguments);
      if ((_ref2 = this.menu_controller) != null) {
        _ref2.release();
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
        this.add_all = __bind(this.add_all, this);
        var Model, name, query, _i, _len, _ref2;
        ListController.__super__.constructor.apply(this, arguments);
        this.items = [];
        _ref2 = (function() {
          var _results;
          _results = [];
          for (name in this.item_controllers) {
            _results.push(eval(name));
          }
          return _results;
        }).call(this);
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          Model = _ref2[_i];
          query = this.default_query(Model);
          if (query != null) {
            Model.bind('refresh', this.add_all);
            Model.fetch($.query(query));
          }
        }
      }

      ListController.prototype.add_all = function(instances) {
        return instances.each(this.add);
      };

      ListController.prototype.add = function(instance) {
        var item;
        item = this.get_item(instance);
        if (__indexOf.call(this.items, item) < 0) {
          this.container().append(item.render());
          return this.items.push(item);
        }
      };

      ListController.prototype.release_item = function(item) {
        return this.items = this.items.without(item);
      };

      ListController.prototype.get_item = function(instance) {
        var ItemController, item;
        item = this.items.find(function(item) {
          return item.instance.eql(instance);
        });
        if (item != null) {
          _.extend(item.instance, instance);
          item.instance.trigger('update');
        } else {
          ItemController = _.find(this.item_controllers, function(controller, name) {
            return instance.constructor.className === _.last(name.split('.'));
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

}).call(this);

/*
//@ sourceMappingURL=helpers.map
*/
