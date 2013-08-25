module.exports = NumberType
var Schema = require('../schema')
var type = require('type-component')

function NumberType(options, parent, path){
	Schema.call(this, options, parent, path)
}

NumberType.prototype = Object.create(Schema.prototype, {
	constructor: {
		value: NumberType
	}
})

NumberType.prototype.name = 'Number'

NumberType.prototype.min = function (min, value, parent) {
	if (value < min) {
		//console.log("ERROR IN ", this.path(), parent, this._parent)
		throw new TypeError('must be greater than ' + min)
	}
	return value
}

NumberType.prototype._cast = function(value, parent){
	if (value === undefined || value === null) return value
	else return parseFloat(value)
}
