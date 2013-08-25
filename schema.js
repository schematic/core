var mpath = require('mpath')
require('colors')
var type = require('type-component')
//var SchemaType = require('./type')
var object = require('object-component')
var merge = object.merge
var isEmpty = object.isEmpty
var each = require('each-component')
var clone = require('clone-component')
var map = require('./lib/utils').map
var ValidationError = require('./errors/validation')
var ValidatorError = require('./errors/validator')

module.exports = BaseSchema

function BaseSchema(options, parent, path){
	this._path = path || ''
	this._parent = parent
	this.options = parent && parent.options 
		? merge(Object.create(parent.options), options)
		: options || {}
}

var Types =
BaseSchema.Types = 
BaseSchema.prototype.Types = {}

BaseSchema.prototype.cast = function(value, parent, target) {
	return this.validate(value, parent, target).value
}

BaseSchema.prototype.validate = function(value, parent, target) {
	return this._validate(this._cast(value, parent, target), parent, target)
}

BaseSchema.prototype._validate = function(value, parent, target) {
	var errors = new ValidationError(this)
		, options = this.options
		, path = this._path
		, self = this
		, hasError = []

	each(options, function(key, args) {
		if (typeof self[key] == 'function' 
				&& args !== undefined 
				&& args !== null) {

			try {
				value = self[key](args, value, parent)
			}catch(error){
				errors.add(null, error, key, args)
			}
		} 
	})

	return errors.errors.length > 0 
		? {value: value, error: errors}
		: {value: value}
}

BaseSchema.prototype._cast = function(value, parent, target) {
	return value
}

// model/mongoose alias
BaseSchema.prototype.path = function (path){
	var prefix;
	var suffix = [this._path, path].filter(function(val){
		return !!val
	}).join('.')
	if(!this._parent) return this._path + suffix
	else return (prefix = this._parent.path())
		? prefix + '.' + suffix
		: suffix
}

BaseSchema.getType  = function(path, obj, parent){

	// normalize constructors
	if (typeof obj === 'function' || obj instanceof BaseSchema)
		obj = {type: obj}

	var explicit = isExplicitType(obj)
		, type = explicit
				? obj.type
				: obj
		, options = {}
		, is_object = isPlainObject(type)
		, name = typeName(type)

	if(explicit) {
		each(obj, function(key, value){
			if(key !== 'type')
				options[key] = value
		})
	}


	// embedded documents
	if (name == 'Document' || (is_object && !isEmpty(type))) {
		if(!explicit){
			options.schema = type
			return new Types.Document(options, parent, path)

		} else {
			return BaseSchema.getType(path, type, parent)
		}
	}

	if (name == 'Mixed' || is_object){
		return new Types.Mixed(options, parent, path)
	}

	if (name == 'Array' || (typedArray = Array.isArray(type) || Array === type)) {
		if(typedArray) options.items = type[0]
		var ret = new Types.Array(options, parent, path)
		return ret
	}

	if (type instanceof BaseSchema || (type.schema instanceof BaseSchema && (type = type.schema))) {
		return new Types.Embedded(options, parent, path, type)
	}
	
	if(undefined !== Types[name]) {
		return new Types[name](options, parent, path)
	} else if('function' == typeof type || 'function' == typeof type.cast) {
		return new Types.Caster(options, parent, path, type)
	} else {
		console.log('failed object: ', obj)
		console.log('failed path: ', path)
		throw new TypeError('Unable to determine cast type for ' + path)
	}
}


BaseSchema.use = function(plugin, options) {
	this.prototype.use(plugin, options)
	return this
}

BaseSchema.prototype.use = function (plugin, options) {
	plugin(this, options)
	return this
}

BaseSchema.prototype.result = function(value) {
	return new CastResult().value(value)
}


function isPlainObject(obj){
	return type(obj) == 'object' && (!obj.constructor || obj.constructor === Object || obj.constructor.name === 'Object')
}

function notEmpty(val){
	return !!val
}
function isExplicitType(obj){
	return !!(obj.type && !obj.type.type)
}

function typeName(str){
	return str && 'string' == typeof str.name
		? typeCase(str.name)
		: typeCase(str)
}

function typeCase(str){
	return 'string' == typeof str
		? str.charAt(0).toUpperCase() + str.substring(1)
		: undefined
}

Types.Caster = require('./types/caster')
Types.String = require('./types/string')
Types.Number = require('./types/number')
Types.Date = require('./types/date')
Types.Array = require('./types/array')
Types.Object =
Types.Mixed = require('./types/mixed')
Types.Document = require('./types/document')
Types.Embedded = require('./types/embedded')
//Types.Model = require('./types/model')