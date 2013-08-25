module.exports = MixedType
var Schema = require('../schema')
var type = require('type-component')

function MixedType(options, parent, path){
	Schema.call(this, options, parent, path)
}

MixedType.prototype = Object.create(Schema.prototype, {
	constructor: {
		value: MixedType
	}
})

MixedType.prototype._cast = function(value, parent){
	return value
}
