module.exports = {
  isArray: function(value) {
    return value instanceof Array;
  },
  isString: function(value) {
    return typeof value === 'string';
  },
  isObject: function(value) {
    return typeof value === 'object';
  },
  isFunction: function(value) {
    return typeof value === 'function';
  },
  clone: function(obj) {
    return JSON.parse(JSON.strignify(obj));
  },
  extend: function(obj, props) {
    var prop, value;
    for (prop in props) {
      value = props[prop];
      obj[prop] = value;
    }
    return obj;
  }
};
