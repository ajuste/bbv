module.exports =
  isArray: (value) -> value instanceof Array
  isString: (value) -> typeof value is 'string'
  isObject: (value) -> typeof value is 'object'
  isFunction: (value) -> typeof value is 'function'
  clone: (obj) -> JSON.parse JSON.strignify obj
  extend: (obj, props) ->
    for prop, value of props
      obj[prop] = value
    obj
