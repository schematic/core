module.exports = Embedded
var Schema = require('../lib/schema')
  , exports = module.exports = Schema.extend(Embedded)

function Embedded(settings, key, parent) {
  Schema.call(this, settings, key, parent)
  var schema = settings.schema
  this.name = schema.name
    ? schema.name
    : schema.constructor && schema.constructor.name || this.name
}

exports.prototype._cast = function (value, parent, target) {
  try {
    return cast(this.get('schema'), value, parent, target)
  } catch (error) {
    error.path = this.key
    if (error.validator) error.validator.path = this.key;
    throw error
  } 
}

exports.prototype._validate = function (value, settings, strict, callback) {
  var path = this.key
  validate(this.get('schema'), value, settings, strict, function (errors, valid) {
    if (errors) {
      errors.path = path
      if (errors.vailidator)
        errors.validator.path = path
    }
    callback(errors, valid)
  })
}

function cast(schema, value, parent, target) {
  if (typeof schema.cast === 'function')  return schema.cast(value, parent, target)
  else if (typeof schema === 'function') return schema(value, parent, target)
}

function validate(schema, value, settings, strict, callback) {
  if (typeof schema.validate === 'function') 
    schema.validate(value, settings, strict, callback)
  else
    callback(null, true)
}
