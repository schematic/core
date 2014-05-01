var Schema = require('../lib/schema')

exports = module.exports = Schema.extend(StringType);

function StringType(settings, key, parent) {
  Schema.call(this, settings, key, parent);
  this.rules({
    min: minimum,
    max: maximum,
    'enum': enumerable
  });
}

exports.prototype._cast = string;

/**
 * String Caster
 *
 * @param value
 * @return
 */
function string(value) {
  if (typeof value === 'string') return value
  if (typeof value.toString == 'function')
    return value.toString()
  throw new TypeError('failed to cast string')
}

/*!
 * validation rules 
 */
function minimum(value, min) {
  if (value && value.length < min) throw new TypeError('must be at least ' + min + ' characters')
}

function maximum(value, max) {
  if (value && value.length > max) throw new TypeError('must be below' + max + ' characters')
}

function enumerable(value, values) {
  if (value && values.indexOf(value) == -1) throw new TypeError('must be a valid enum value')
}
