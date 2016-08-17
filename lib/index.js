module.exports = function(arg) {
  var Model, ModelPrototype, View, ViewPrototype;
  Model = arg.Model, View = arg.View;
  ModelPrototype = require('./model');
  ViewPrototype = require('./view')({
    Model: Model
  });
  return {
    ModelPrototype: ModelPrototype,
    ViewPrototype: ViewPrototype,
    BaseModel: Model.extend(ModelPrototype),
    BaseView: View.extend(ModelPrototype),
    Validators: require('./validators')
  };
};
