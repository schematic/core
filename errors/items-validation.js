var ValidationError = require('./validation')
  , ValidatorError = require('./validator')
  , exports = module.exports = ItemValidationError

function ItemValidationError(schema, options) {
  Object.defineProperty(this, 'errors', {
    value: [],
    enumerable: true
  })
  Object.defineProperty(this, 'paths', {
    value: [],
    enumerable: true
  })
  Object.defineProperty(this, 'validator', {
    value: {
    schema: schema,
    path: schema._path,
    options: options || schema.options,
  }
  })
}

ItemValidationError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: ItemValidationError
  },
  name: {
    value: 'ItemValidationError'
  }
})

ItemValidationError.prototype.add = function (path, error, name, options, schema) {
  var validator = this.validator
    , schema = schema || validator.schema
    , options = options || validator.options
  
  error = error instanceof ValidationError || error instanceof ValidatorError
    ? error
    : new ValidatorError(schema, name, options, error);

  this.errors[path] = error
}
