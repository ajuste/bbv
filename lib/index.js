var ErrorKeyAttribute,
  slice = [].slice;

ErrorKeyAttribute = 'data-error-key';

module.exports = function(arg) {
  var MProto, Model, RxEmail, VProto, View, Vlds, exnd, isArr, isFunc, isNmb, isObj, isStr, keys;
  Model = arg.Model, View = arg.View;
  isArr = function(value) {
    return value instanceof Array;
  };
  isStr = function(value) {
    return typeof value === 'string';
  };
  isObj = function(value) {
    return typeof value === 'object';
  };
  isFunc = function(value) {
    return typeof value === 'function';
  };
  isNmb = function(value) {
    return typeof value === 'number';
  };
  keys = Object.keys;
  exnd = function(obj, props) {
    var prop, value;
    for (prop in props) {
      value = props[prop];
      obj[prop] = value;
    }
    return obj;
  };
  RxEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  Vlds = {

    /**
    * @function Evaluates a function in the model to decide if model is valid
    * @param {String} prop The property that holds the function
    * @param {Object} self The model
    * @returns {String} Error key or undefined if valid
     */
    requiredCond: function(arg1, self) {
      var prop;
      prop = arg1[0];
      return self[prop].bind(self);
    },

    /**
    * @function Validates value is a string and does not exceed maxlength
    * @param {Number} length Max length
    * @returns {String} Error key or undefined if valid
     */
    maxLength: function(arg1) {
      var length;
      length = arg1[0];
      return function(value) {
        if (!(!value || isStr(value) && value.trim().length <= length)) {
          return 'maxLength';
        }
      };
    },

    /**
    * @function Validates value is available
    * @returns  {String} Error key or undefined if valid
     */
    required: function() {
      return function(value) {
        if (!(value && ((isStr(value) && value.trim().length) || (isNmb(value) && !isNaN(value)) || (isObj(value))))) {
          return 'required';
        }
      };
    },

    /**
    * @function Validates email field
    * @returns  {String} Error key or undefined if valid
     */
    email: function() {
      return function(value) {
        if (!RxEmail.test(value)) {
          return 'email';
        }
      };
    }
  };
  MProto = {
    initialize: function() {
      return this.buildValidations();
    },

    /**
    * @function Build validations. Call it only when validations change.
     */
    buildValidations: function() {
      var fieldRestrictions, name, params, prio, restriction;
      return this.validations = (function() {
        var ref, results;
        ref = this.restrictions;
        results = [];
        for (name in ref) {
          fieldRestrictions = ref[name];
          results.push((function() {
            var ref1, results1;
            results1 = [];
            for (restriction in fieldRestrictions) {
              ref1 = fieldRestrictions[restriction], prio = ref1[0], params = 2 <= ref1.length ? slice.call(ref1, 1) : [];
              if (!Vlds[restriction]) {
                continue;
              }
              results1.push({
                name: name,
                prio: prio,
                fn: Vlds[restriction](params, this)
              });
            }
            return results1;
          }).call(this));
        }
        return results;
      }).call(this);
    },
    validate: function(opts) {
      var changedAttributes, result;
      if (opts == null) {
        opts = {};
      }
      changedAttributes = this.changedAttributes() || {};
      result = {};
      this.validations.reduce((function(memo, arr) {
        return memo.concat(arr);
      }), []).filter(function(arg1) {
        var name;
        name = arg1.name;
        return opts.validateAll || name in changedAttributes;
      }).sort(function(p1, p2) {
        if (p1.name === p2.name) {
          return p1.prio < p2.prio;
        } else {
          return p1.name < p2.name;
        }
      }).reduce((function(_this) {
        return function(memo, arg1) {
          var fn, key, last, name, prio;
          name = arg1.name, prio = arg1.prio, fn = arg1.fn;
          last = memo[memo.length - 1];
          if ((!last || last.name !== name || last.prio === prio) && (key = fn(_this.get(name, _this)))) {
            memo.push({
              key: key,
              name: name,
              prio: prio,
              fn: fn
            });
          }
          return memo;
        };
      })(this), []).forEach(function(arg1) {
        var key, name;
        name = arg1.name, key = arg1.key;
        return result[name] = key;
      });
      if (keys(result).length) {
        return result;
      }
    }
  };
  VProto = {
    initialize: function(arg1) {
      var t;
      t = arg1.t;
      this.viewData = new Model();
      return this._t = t;
    },
    renderErrors: function(error) {
      return Array.prototype.concat(this.$el.find("[" + ErrorKeyAttribute + "]")).map(function($el) {
        var key;
        return [$el, error[(key = $el.getAttribute(ErrorKeyAttribute))], key];
      }).filter(function(arg1) {
        var el, errors, key;
        el = arg1[0], errors = arg1[1], key = arg1[2];
        return el && key in error;
      }).forEach((function(_this) {
        return function(arg1) {
          var $el, errors, text;
          $el = arg1[0], errors = arg1[1];
          if (errors) {
            errors = isArr(errors) ? errors : [errors];
            text = errors.map(_this._t).join(' ');
          }
          return $el.textContent = text || '';
        };
      })(this));
    },
    validate: function(opts) {
      var currentState, def, error;
      if (opts == null) {
        opts = {};
      }
      error = exnd(opts.error || {}, this.model.validate(opts));
      currentState = this.viewData.get('error') || {};
      def = {};
      if (isStr(opts.field)) {
        def[opts.field] = false;
        error = exnd(currentState, def, error);
      }
      this.renderErrors(error);
      return !error || !keys(error).length;
    },
    updateModel: function(arg1) {
      var field, target;
      target = arg1.target;
      field = target.getAttribute('name');
      this.model.set(field, target.value.trim());
      return this.validate({
        field: field
      });
    }
  };
  return {
    MProto: MProto,
    VProto: VProto,
    Validators: Vlds,
    BaseModel: Model.extend(MProto),
    BaseView: View.extend(VProto)
  };
};
