

module.exports = ({Model, View}) ->
  ModelPrototype = require './model'
  ViewPrototype = require('./view') {Model}
  {
    ModelPrototype, ViewPrototype,
    BaseModel: Model.extend ModelPrototype
    BaseView: View.extend ModelPrototype
    Validators: require './validators'
  }
