module.exports = ArrayType
var Schema = require('../schema')
var Mixed = require('./mixed')
var type = require('type-component')
var CastItemsError = require('../errors/items')
var ValidationError = require('../errors/validation')
var ValidatorError = require('../errors/validator')
var ItemValidationError = require('../errors/items-validation')
var caster = require('../lib/caster').caster
var each = require('each-component')
var slice = [].slice
var cast = Schema.prototype._cast

function ArrayType(options, parent, path){
	Schema.call(this, options, parent, path)
	this.options.items = Schema.getType(null, this.options.items, this)
	
}

ArrayType.prototype = Object.create(Schema.prototype, {
	constructor: {
		value: ArrayType
	}
})
ArrayType.prototype.name = 'Array'
ArrayType.prototype.items = function (type, value, parent) {
	if (value === null || value === undefined) return value
	var errors = new ItemValidationError(this, type)
	var hasErrors = false
	for (var i = 0; i < value.length; i++) {
		var result = type.validate(value[i], value)
		value[i] = result.value
		if(result.error){
			errors.add(i, result.error)
			hasErrors = true
		}
	}
	
	if(hasErrors){
		throw errors
	}
	return value
}

ArrayType.prototype._validate = function(value, parent, target) {
	var errors = new ValidationError(this)
		, hasErrors = false
		, options = this.options
		, path = this._path
		, self = this

	each(options, function(key, args) {
		if (typeof self[key] == 'function' 
				&& args !== undefined 
				&& args !== null) {

			try {
				value = self[key](args, value, parent)
			}catch(error){
				if (error instanceof ItemValidationError) {
					each(error.errors, function(error, index){
						errors.add(index, error, key, args)
					})
				} else {
					errors.add(null, error, key, args)
				}
				hasErrors = true
			}
			
		} 
	})

	return hasErrors
		? {value: value, error: errors}
		: {value: value}
}



ArrayType.prototype._cast = function(value, parent) {
  if (value === null 
   || value === undefined
   || Array.isArray(value) 
   || isArrayLike(value)) {
   	if (parent) value.parent = parent
  	return value
	}

	throw new TypeError('Value `' + value + '` is not an array')
}


function isArrayLike(o) {
  if (o &&                                // o is not null, undefined, etc.
      typeof o === "object" &&            // o is an object
      isFinite(o.length) &&               // o.length is a finite number
      o.length >= 0 &&                    // o.length is non-negative
      o.length===Math.floor(o.length) &&  // o.length is an integer
      o.length < 4294967296)              // o.length < 2^32
      return true;                        // Then o is array-like
  else
      return false;                       // Otherwise it is not
}