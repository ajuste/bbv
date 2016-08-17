var ErrorKeyAttribute, Util;

ErrorKeyAttribute = 'data-error-key';

Util = require('./util');

module.exports = function(arg) {
  var Model;
  Model = arg.Model;
  return {
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
            errors = Util.isArray(errors) ? errors : [errors];
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
      error = extend(opts.error || {}, this.model.validate(opts));
      currentState = this.viewData.get('error') || {};
      def = {};
      if (isString(opts.field)) {
        def[opts.field] = false;
        error = extend(currentState, def, error);
      }
      this.renderErrors(error);
      return !error || !Object.keys(error).length;
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
};
