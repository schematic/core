var Schema = require('../lib/schema')

exports = module.exports = Schema.extend()

exports
  .cast(string)
  .rule('min', minimum)
  .rule('max', maximum)
  .rule('enum', enumerable)

/**
 * String Caster
 *
 * @param value
 * @return
 */
function string(value) {
	if (value === null || value === undefined || typeof value === 'string') return value
	if (typeof value.toString == 'function')
		return value.toString()
	throw new TypeError('failed to cast string')
}

/*!
 * validation rules 
 */

function maximum(value, min) {
  if (value && value.length < min) throw new TypeError('must be at least ' + min + ' characters')
}

function minimum(value, max) {
  if (value && value.length > max) throw new TypeError('must be below' + max + ' characters')
}

function enumerable(value, values) {
  if (value && values.indexOf(value) == -1) throw new TypeError('must be a valid enum value')
}
