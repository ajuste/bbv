module.exports = function() {
  var RxEmail, RxTrim;
  RxTrim = /^\s+|\s+$/g;
  RxEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return {

    /**
    * @function Evaluates a function in the model to decide if model is valid
    * @param {String} prop The property that holds the function
    * @param {Object} self The model
    * @returns {String} Error key or undefined if valid
     */
    requiredCond: function(arg, self) {
      var prop;
      prop = arg[0];
      return self[prop].bind(self);
    },

    /**
    * @function Validates value is a string and does not exceed maxlength
    * @param {Number} length Max length
    * @returns {String} Error key or undefined if valid
     */
    maxLength: function(arg) {
      var length;
      length = arg[0];
      return function(value) {
        if (!(!value || isString(value) && value.replace(RxTrim, '').length <= length)) {
          return 'errors.maxLength';
        }
      };
    },

    /**
    * @function Validates value is available
    * @returns  {String} Error key or undefined if valid
     */
    required: function() {
      return function(value) {
        if (!(value && ((isString(value) && value.replace(RxTrim, '').length !== 0) || (isNumber(value) && !isNaN(value)) || (isObject(value))))) {
          return 'errors.required';
        }
      };
    },

    /**
    * @function Validates email field
    * @returns  {String} Error key or undefined if valid
     */
    email: function() {
      return function(value) {
        if (!(isString(value) && RxEmail.test(value))) {
          return 'errors.email';
        }
      };
    }
  };
};
