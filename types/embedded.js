module.exports = Embedded
var Schema = require('../schema')
var caster = require('../lib/caster').caster
var validator = require('../lib/caster').validator

function Embedded(options, parent, path, schema){
	Schema.call(this, options, parent, path)
	this.schema = schema
	this.name = schema.name 
		? schema.name
		: schema.constructor && schema.constructor.name || this.name
}

Embedded.prototype = Object.create(Schema.prototype, {
	constructor: {
		value: Embedded
	}
})

Embedded.prototype.name = 'Embedded'

Embedded.prototype._validate = function (value, parent, target) {
	var result = this.schema._validate(value, parent, target)
	// rewrite paths for errors
	if (result.error) {
		result.error.path = this._path
		result.error.validator.path = this._path
	}
	return result
}

Embedded.prototype._cast = function(value, parent, target){
	return this.schema._cast(value, parent, target)
}

