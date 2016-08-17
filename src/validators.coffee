module.exports = ->

  RxTrim = /^\s+|\s+$/g
  RxEmail =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  ###*
  * @function Evaluates a function in the model to decide if model is valid
  * @param {String} prop The property that holds the function
  * @param {Object} self The model
  * @returns {String} Error key or undefined if valid
  ###
  requiredCond: ([prop], self) ->
    self[prop].bind self

  ###*
  * @function Validates value is a string and does not exceed maxlength
  * @param {Number} length Max length
  * @returns {String} Error key or undefined if valid
  ###
  maxLength: ([length]) ->
    (value) ->
      unless not value or isString(value) and value.replace(RxTrim, '').length <= length
        'errors.maxLength'

  ###*
  * @function Validates value is available
  * @returns  {String} Error key or undefined if valid
  ###
  required: ->
    (value) ->
      unless value and ((isString(value) and value.replace(RxTrim, '').length isnt 0) or (isNumber(value) and not isNaN(value)) or (isObject(value)))
        return 'errors.required'

  ###*
  * @function Validates email field
  * @returns  {String} Error key or undefined if valid
  ###
  email: ->
    (value) ->
      unless isString(value) and RxEmail.test(value)
        'errors.email'
