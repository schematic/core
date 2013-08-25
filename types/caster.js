module.exports = Caster
var Schema = require('../schema')
var caster = require('../lib/caster').caster
var ValidationError = require('../errors/validation')
var ValidatorError = require('../errors/validator')

function Caster(options, parent, path, ctor){
	Schema.call(this, options, parent, path)
	this.caster = caster(ctor)
	if (ctor.name) {
		this.name = 'Caster (' + ctor.name + ')'
	}
}

Caster.prototype = Object.create(Schema.prototype, {
	constructor: {
		value: Caster
	}
})

Caster.prototype.name = 'Caster'

Caster.prototype._validate = function (value, parent, target) {
	var error = undefined;
	try {
		value = this.caster(value, parent, target)
	} catch (err) {
		if (err instanceof ValidationError) {
			err.path =
			err.validator.path = this._path
			error = err
		} else if (err instanceof ValidatorError) {
			error = new ValidationError(this, null, err)
		} else {
			error = new ValidationError(this)
			error.add(null, err)
		}
	}
	return {value: value, error: error}
}

Caster.prototype._cast = function(value, parent, target){
	console.log('custom cast!', value)
	return this._validate(value, parent, target).value
}

