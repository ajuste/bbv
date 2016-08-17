Validators = require './validators'

module.exports = ->

  initialize: ->
    @buildValidations()

  ###*
  * @function Build validations. Call it only when validations change.
  ###
  buildValidations: ->
    @validations =
      for name, fieldRestrictions of @restrictions
        for restriction, [prio, params...] of fieldRestrictions
          continue unless Validators[restriction]
          {name, prio, fn: Validators[restriction] params, this}

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

    if Object.keys(result).length then result
