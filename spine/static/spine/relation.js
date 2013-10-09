(function() {
  var Set, get_fkey;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  if (typeof Spine === "undefined" || Spine === null) {
    Spine = require('spine');
  }
  if (typeof require === "undefined" || require === null) {
    require = (function(value) {
      return eval(value);
    });
  }
  get_fkey = function(name) {
    return name + '_id';
  };
  Set = (function() {
    function Set(values, options) {
      if (options == null) {
        options = {};
      }
      this.remove_all = __bind(this.remove_all, this);
      this.remove = __bind(this.remove, this);
      this.add = __bind(this.add, this);
      this.merge = __bind(this.merge, this);
      this.all = __bind(this.all, this);
      this.values = [];
      this.field_selector = (options != null ? options.field_selector : void 0) || function(i) {
        return i;
      };
      this.add_callback = (options != null ? options.add_callback : void 0) || function(i) {};
      this.remove_callback = (options != null ? options.remove_callback : void 0) || function(i) {};
      if (values) {
        this.merge(values);
      }
      this.instance = options != null ? options.instance : void 0;
    }
    Set.prototype.all = function() {
      return this.values;
    };
    Set.prototype.merge = function(items) {
      var i, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        i = items[_i];
        _results.push(this.add(i));
      }
      return _results;
    };
    Set.prototype.add = function(item) {
      var i, items, new_item;
      items = (function() {
        var _i, _len, _ref, _results;
        _ref = this.values;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(this.field_selector(i));
        }
        return _results;
      }).call(this);
      new_item = this.field_selector(item);
      if (__indexOf.call(items, new_item) < 0) {
        this.values.push(item);
      }
      if (typeof this.add_callback === "function") {
        this.add_callback(this.instance);
      }
      return item;
    };
    Set.prototype.remove = function(item) {
      var index, left, right;
      index = this.values.indexOf(item);
      if (index === 0) {
        this.values = this.values.slice(index + 1);
      } else if (index === this.values.length - 1) {
        this.values = this.values.slice(0, (index - 1 + 1) || 9e9);
      } else {
        left = this.values.slice(0, (index - 1 + 1) || 9e9);
        right = this.values.slice(index + 1);
        this.values = left.concat(right);
      }
      if (index >= 0) {
        if (typeof this.remove_callback === "function") {
          this.remove_callback(this.instance);
        }
      }
      return item;
    };
    Set.prototype.remove_all = function() {
      return this.values = [];
    };
    return Set;
  })();
  Spine.Model.extend({
    multiple: function(name, model) {
      var associate;
      associate = function(instance) {
        var fkey, items, options, refresh, selector;
        if (typeof model === 'string') {
          model = require(model);
        }
        fkey = get_fkey(name);
        refresh = function() {
          var i, ids;
          ids = (function() {
            var _i, _len, _ref, _results;
            _ref = this.all();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              _results.push(i.id);
            }
            return _results;
          }).call(this);
          return instance[fkey] = ids;
        };
        selector = __bind(function(i) {
          return i.id;
        }, this);
        options = {
          add_callback: refresh,
          remove_callback: refresh,
          instance: instance,
          field_selector: selector
        };
        items = model.select(function(i) {
          var _ref;
          return _ref = i.id, __indexOf.call(instance[fkey], _ref) >= 0;
        });
        return new Set(items, options);
      };
      return this.prototype[name] = function() {
        return associate(this);
      };
    },
    single: function(name, model) {
      var associate;
      associate = function(record, value) {
        var fkey, model_instances;
        if (typeof model === 'string') {
          model = require(model);
        }
        fkey = get_fkey(name);
        if (value && value instanceof model) {
          return record.updateAttribute(fkey, value.id);
        }
        model_instances = model.select(function(i) {
          return i.id === value.id;
        });
        if (model_instances != null ? model_instances.length : void 0) {
          return model_instances[0];
        }
      };
      return this.prototype[name] = function(value) {
        return associate(this, value);
      };
    }
  });
}).call(this);
