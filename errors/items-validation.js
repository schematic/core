var ValidationError = require('validator-schematic/errors/validation')
  , ValidatorError = require('validator-schematic/errors/validator')
  , exports = module.exports = ItemValidationError

function ItemValidationError(schema, settings) {
  Object.defineProperty(this, 'errors', {
    value: [],
    enumerable: true
  })
  Object.defineProperty(this, 'validator', {
    value: {
    schema: schema,
    path: schema.key,
    settings: settings || schema.settings,
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
  if (error instanceof ValidationError || error instanceof ValidatorError) {
    this.errors[path] = error;
  } else {
    this.errors[path] = new ValidatorError(schema, name, options, error);
  }
  /*error = error instanceof ValidationError || error instanceof ValidatorError
    ? error
    : new ValidatorError(schema, name, options, error);*/
  this.errors[path] = error
}
