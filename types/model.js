module.exports = ModelType
var Document = require('./document')
var Schema = require('../schema')
var merge  = require('object-component').merge
var doc = Document.prototype
function ModelType (options, parent, path) {
	if (!(this instanceof ModelType)) return new ModelType(options, parent, path)
	var options = options || {}
		, obj = options.schema
		, model = options.model
		, name = options.name || model && model.name
	
	// allow models/documents instead of a schema tree
	if (obj instanceof Document) {
		merge(options, merge({}, obj.options))
		parent = parent || obj._parent
		path = path || obj._path
		obj = merge({}, obj.tree)
	}

	options.schema = obj
	options.name = undefined
	options.model = undefined
	Document.call(this, options, parent, path)
	this.model = model || this.model
	this.name = this.model && this.model.name
		? this.model.name
		: 'Model'
}

ModelType.prototype = Object.create(Document.prototype, {
	constructor: {
		value: ModelType
	}
})

ModelType.prototype.name = 'Model'

ModelType.prototype._validate = function(object, parent, target) {
	var schema = this
	//console.log('casting object', object, this.model)
	
	// prevent infinite loops because castAs calls cast
	if (target instanceof this.model) 
		return doc._validate.call(this, object, parent, target)
	else {
		//return doc._cast.call(this, object, parent, target)
		var ret = this.validateAs(this.model, object, parent, target)
		return ret
	}
}

ModelType.prototype._cast = function (object, parent, target) {
	var ret = doc._cast.call(this, object, parent, target)
	if (ret && parent) {
		ret.parent = parent
	}
	return ret
}

function castWith(schema){
	return function(object, parent, target){
		return schema.cast(object, parent, target)
	}
}

function parent() {
	return this.model.parent
}
