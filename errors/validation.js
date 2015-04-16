var ValidationError = require('validator-schematic/errors/validation')
  , ValidatorError = require('validator-schematic/errors/validator')
  , exports = module.exports = SchemaValidationError

function SchemaValidationError(schema, errors) {
  ValidationError.call(this, errors);
  this.schema = schema;
}

SchemaValidationError.prototype = Object.create(ValidationError.prototype, {
  constructor: {
    value: SchemaValidationError
  },
  name: {
    value: 'SchemaValidationError'
  }
})

SchemaValidationError.prototype.add = function (path, error) {
  if (error instanceof ValidationError || error instanceof ValidatorError) {
    this.errors[path] = error;
  } else {
    throw new TypeError('`error` must be an instance of `ValidatorError` or `ValidationError`')
  }
}

SchemaValidationError.prototype.toString = function() {
  var keys = Object.keys(this.errors);
  if (keys.length > 0) {
    return ['[ Validation Error (', (this.schema.name || this.schema.constructor.name) ,'): \n',keys.map(function (key) {
      return [' ', this.errors[key].toString()].join('')
    }, this).join('\n'), ' ]'].join('')
  } else {
    return '[ Validation Error ]';
  }
}
