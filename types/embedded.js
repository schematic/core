module.exports = Embedded
var Schema = require('../lib/schema')
  , exports = module.exports = Schema.extend(Embedded)

function Embedded(options, key, parent){
  if (!this instanceof Embedded)
    return new Embedded(options,key, parent)
  Schema.call(this, options, key, parent)
  var schema = this.options.schema
  this.name = schema.name
    ? schema.name
    : schema.constructor && schema.constructor.name || this.name
}

exports.cast(function (value, parent, target) {
  return schema(this).cast(value, parent, target)
})

exports.validate(function (value, options, strict, callback) {
  var path = this.key
    , schema = this.get('schema')

  if (!schema) {
    throw new TypeError('embedded type must not have a schema')
  }

  schema.validate(value, options, strict, function (errors, valid) {
    if (errors) {
      errors.path = this.key
      errors.validator.path = path
    }
    callback(errors, valid)
  })
})

