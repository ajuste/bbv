ErrorKeyAttribute = 'data-error-key'

module.exports = ({Model, View}) ->

  isArr =  (value) -> value instanceof Array
  isStr = (value) -> typeof value is 'string'
  isObj = (value) -> typeof value is 'object'
  isFunc = (value) -> typeof value is 'function'
  isNmb = (value) -> typeof value is 'number'
  keys = Object.keys
  exnd = (obj, props) ->
    for prop, value of props
      obj[prop] = value
    obj

  RxEmail =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  Vlds =
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
        unless not value or isStr(value) and value.trim().length <= length
          'errors.maxLength'

    ###*
    * @function Validates value is available
    * @returns  {String} Error key or undefined if valid
    ###
    required: ->
      (value) ->
        unless value and ((isStr(value) and value.trim().length) or (isNmb(value) and not isNaN(value)) or (isObj(value)))
          'errors.required'

    ###*
    * @function Validates email field
    * @returns  {String} Error key or undefined if valid
    ###
    email: ->
      (value) ->
        'errors.email' unless RxEmail.test(value)



  MProto =

    initialize: ->
      @buildValidations()

    ###*
    * @function Build validations. Call it only when validations change.
    ###
    buildValidations: ->
      @validations =
        for name, fieldRestrictions of @restrictions
          for restriction, [prio, params...] of fieldRestrictions
            continue unless Vlds[restriction]
            {name, prio, fn: Vlds[restriction] params, this}

    validate: (opts = {}) ->

      changedAttributes = @changedAttributes()
      result = {}

      @validations

        .reduce (memo, arr) -> memo.concat arr, []

        .filter ({name}) -> opts.validateAll or name of changedAttributes

        .sort (p1, p2) ->
          if p1.name is p2.name then p1.prio < p2.prio else p1.name < p2.name

        .reduce (memo, {name, prio, fn}) =>

            [..., last] = memo

            # if there is a validation for the same field with more prio
            # then don't validate current
            if (not last or last.name isnt name or last.prio is prio) and (key = fn @get name, this)
              memo.push {key, name, prio, fn}

            memo
        , []

        .forEach ({name, key}) -> result[name] = key

      if keys(result).length then result

  VProto =

    initialize: ({t}) ->
      @viewData = new Model()
      @_t = t

    renderErrors: (error) ->

      Array

        ::concat @$el.find "[#{ErrorKeyAttribute}]"

        .map ($el) ->
          [$el, error[(key = $el.getAttribute ErrorKeyAttribute)], key]

        .filter ([el, errors, key]) ->
          el and key of error

        .forEach ([$el, errors]) =>

          if errors
            errors = if isArr errors then errors else [errors]
            text = errors.map(@_t).join ' '

          $el.textContent = text or ''

    validate: (opts = {}) ->

      error = exnd opts.error or {}, @model.validate opts
      currentState = @viewData.get('error') or {}
      def = {}

      if isStr opts.field
        def[opts.field] = no
        error = exnd currentState, def, error

      @renderErrors error

      not error or not keys(error).length

    updateModel: ({target}) ->
      field = target.getAttribute 'name'
      @model.set field, target.value.trim()
      @validate {field}

  {
    MProto, VProto,
    Validators: Vlds
    BaseModel: Model.extend MProto
    BaseView: View.extend VProto
  }
