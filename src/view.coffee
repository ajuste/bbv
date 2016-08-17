ErrorKeyAttribute = 'data-error-key'
Util = require './util'

module.exports = ({Model})->

  initialize: ({t}) ->
    @viewData = new Model()
    @_t = t

  renderErrors: (error) ->

    Array

      ::concat(@$el.find "[#{ErrorKeyAttribute}]")

      .map ($el) ->
        [$el, error[(key = $el.getAttribute ErrorKeyAttribute)], key]

      .filter ([el, errors, key]) ->
        el and key of error

      .forEach ([$el, errors]) =>

        if errors
          errors = if Util.isArray errors then errors else [errors]
          text = errors.map(@_t).join ' '

        $el.textContent = text or ''

  validate: (opts = {}) ->

    error = extend opts.error or {}, @model.validate opts
    currentState = @viewData.get('error') or {}
    def = {}

    if isString opts.field
      def[opts.field] = no
      error = extend currentState, def, error

    @renderErrors error

    not error or not Object.keys(error).length

  updateModel: ({target}) ->
    field = target.getAttribute 'name'
    @model.set field, target.value.trim()
    @validate {field}
