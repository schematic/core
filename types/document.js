var mpath = require('mpath')
var type = require('type-component')
var BaseSchema = require('../schema')
var merge = require('object-component').merge
var map = require('../lib/utils').map
var ValidationError = require('../errors/validation')
var cast = BaseSchema.prototype._cast
module.exports = Document

function Document(options, parent, path){
	var schema
	if (options && options.hasOwnProperty('schema')) {
		schema = options.schema
		options.schema = undefined
	} 
	BaseSchema.call(this, options, parent, path)
	this.tree = {}

	this.add(schema)
}

Document.prototype = Object.create(BaseSchema.prototype)

Document.prototype._validate = function(obj, parent, target) {
	if (obj === undefined) return {}
	var schema = this.tree
		, seen = []
		, cache = []
		, errors = new ValidationError(this)
		, hasErrors = false
		, result = undefined
		

	var ret = map(obj, target, function(key, value, context){
		// avoid cycles
		if ('object' == type(value)) {
			var i = seen.indexOf(value)
			if (seen.indexOf(value) > -1) result = cache[i]
			else {
				result = cache[seen.push(value)-1] = validate(value, context, schema[key])
			}
		} else {
			result = validate(value, context, schema[key])
		}

		if(result.error) {
			errors.add(key, result.error)
		}
		return result.value
	})
	return Object.keys(errors).length > 0
		? {value: ret, error: errors}
		: {value: ret}
}

Document.prototype._validateAs = function (proto, obj, parent, target) {
	var ctor = type(proto) == 'function'
			? proto
			: null
	, proto = ctor === null
			? proto
			: ctor.prototype
	// Don't run the constructor if the target is already an instance of it
	, init = !target || !(ctor 
				? target instanceof ctor
				: isPrototypeOf(proto, target))
	, result = this.validate(obj, parent, target || Object.create(proto))
	, instance = !target || (target && !init)
			? result.value
			: merge(Object.create(proto), result.value)

	if (init && ctor) ctor.call(instance)

	return { value: instance, error: result.error }
}

Document.prototype.castAs = function (proto, obj, parent, target) {
	return this._validateAs(proto, obj, parent, target).value
}

Document.prototype.validateAs = function(proto, obj, parent, target) {
	return this._validateAs(proto, obj, parent, target)
}

function validate(value, parent, type){
	if (type) return type.validate(value, parent)
	else {
		return {value: value}
	}
}

Document.prototype.add = function (obj, prefix) {
  prefix = prefix || '';
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];

    if (null == obj[key]) {
      throw new TypeError('Invalid value for schema path `'+ prefix + key +'`');
    }
    
    this.attr(prefix + key, obj[key])
  }
};

// model/mongoose alias
Document.prototype.attr = function (path, obj){
	if (arguments.length == 1) {
		return mpath.get(path, this.tree, 'tree')
	}

	mpath.set(path, BaseSchema.getType(path.split('.').pop(), obj, this), this.tree, 'tree')
	return this
}




function noop() {

}

function isPrototypeOf(proto, obj) {
	if (proto.isPrototypeOf && proto.isPrototypeOf(obj)) return true
	if (proto.constructor &&  obj instanceof proto.constructor) return true
	if (obj.__proto__ === proto) return true
	return noop.prototype = proto && obj instanceof noop
}

function hasExplicitType(obj){
	return obj.type && !obj.type.type
}


