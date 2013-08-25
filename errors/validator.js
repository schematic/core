exports = module.exports = ValidatorError

function ValidatorError(schema, name, options, error) {
	//Error.captureStackTrace(this, ValidatorError)
	
	var message = typeof error == 'object'
			? error.message
			: error
	message = message || 'failed validation with validator `' + name + '`'
	this.error = error
	this.schema = schema
	this.options = options
	this.name = name
	this.path = schema._path

  this.message = message
}

ValidatorError.prototype = Object.create(Error.prototype, {
	constructor: {
		value: ValidatorError
	}
})

ValidatorError.prototype.toString = function() {
	return '[Error: `' + this.path + '` ' + this.message + ' ]'
}

