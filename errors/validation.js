var each = require('each-component')
	, merge = require('object-component').merge
	, ValidatorError = require('./validator')
	, exports = module.exports = ValidationError

function ValidationError (schema, options, error) {
	var validator = { 
		schema: schema,
		path: schema._path,
		options: options || schema.options
	}

	Object.defineProperty(this, 'errors', {
		value: error ? [error] : [],
		enumerable: true
	})

	Object.defineProperty(this, 'validator', {
		value: validator
	})

	each(validator, function(key, value){
		Object.defineProperty(this, key, {
			value: value,
			writable: true,
			configurable: true
		})
	})

	if (validator.options.strict && error) {
		
	}
}

ValidationError.prototype = Object.create(Error.prototype, {
	constructor: {
		value: ValidationError
	},
	name: {
		value: 'ValidationError'
	}
})

ValidationError.prototype.add = function (path, error, name, options, schema) {
	var validator = this.validator
	  , schema = schema || validator.schema
	  , options = options || validator.options

	error = error instanceof ValidationError || error instanceof ValidatorError
		? error
		: new ValidatorError(schema, name, options, error);
	// child validation error
	if (path !== undefined && path !== null) {
		this[path] = error instanceof ValidationError
			? error
			: new ValidationError(schema, options, error)
		Object.defineProperty(error, 'path', {
			value: path,
			writable: true,
			configurable: true
		})
		error.validator.path = path
	} else {
		this.errors.push(error)
	}
}

ValidationError.prototype.toString = function(indent){
	var schema = this.validator.schema
		, validator = this.validator
	  , name = schema.name || schema.constructor.name
	  , self = this
	  , indent = indent || 0
	  , pad = ' '
	  , padding = Array(indent+1).join(pad)
	  , path = validator.path !== null && validator.path !== undefined && validator.path !== ''
	  	  ? ' `' + validator.path + '`'
	  	  : ''
	  , parts = [indent === 0 ? '[ ' : undefined , name, path, ': ']
	  , errorPadding = ['\n', padding, pad, pad, pad].join('')

  if(this.errors.length > 0) {
	  parts.push(errorPadding)
		parts.push(this.errors.map(function(error){
			return ['[ Error: ', error.message, ' ]'].join('')
		}).join(errorPadding))
		//parts.push('\n' , padding)
	}
	var keys = Object.keys(this).filter(function(name){ return name !== 'errors' && self[name] instanceof Error})
	if (keys.length > 0) {
		parts.push(errorPadding)
		parts.push(keys.map(function(key){
			return self[key].toString(indent+1)
		}).join('\n' + padding + pad))
	//	parts.push('\n' + padding )
	}
	if (indent === 0) parts.push('\n]')
	return parts.join('')
}

