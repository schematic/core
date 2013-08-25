module.exports = StringType
var Schema = require('../schema')

function StringType(options, parent, path){
	Schema.call(this, options, parent, path)
}

StringType.prototype = Object.create(Schema.prototype, {
	constructor: {
		value: StringType
	}
})
StringType.prototype.add = function(){}

StringType.prototype._cast = function(value, parent){
	if (value === null || value === undefined || typeof value === 'string') return value
	if (typeof value.toString == 'function')
		return value.toString()
	throw new TypeError('failed to cast string')
}
