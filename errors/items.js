module.exports = CastItemsError

function CastItemsError(type, errors){
	Error.captureStackTrace(this, CastItemsError)
	this.errors = errors
	this.type = type
	this.message = name(type) + 
	               ': Failed to validate items `' + keys(errors) + '` at `' + type.path() + '`'

}

CastItemsError.prototype = Object.create(Error.prototype, {
	constructor: {
		value: CastItemsError
	},
	name: {
		value: 'CastItemsError'
	}
})

function name(type) {
	return type.name 
		? type.name
		: type.constructor.name
}

function keys(errors){
	var keys = Array.isArray(errors)
		? errors.map(indexes)
		: objectKeys(errors)
	return keys.filter(defined)
}

function objectKeys(obj) {
return Object
	.keys(obj)
	.map(function(key, i) {
		return obj.hasOwnProperty(key) && defined(obj[key])
			? key
			: undefined
	})
}

function indexes(key, i, arr){
	return arr.hasOwnProperty(i) ? i : undefined
}

function defined(val) {
	return val !== undefined && val !== null 
}