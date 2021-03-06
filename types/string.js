var Schema = require('../lib/schema')
var StringType =
Schema
  .extend('String')
  .check(check)
  .cast(cast)
  .rules({min: minimum, max: maximum, 'enum': enumerable});

exports = module.exports = StringType;


exports.plugin = function() {
  return function (types) {
    types.on('infer', middleware);
  }
}

function check(value) {
  return type(value) === 'string'
}
/**
 * String Caster
 *
 * @param value
 * @return
 */
function cast(value) {
  if (typeof value === 'string') return value
  if (typeof value.toString == 'function')
    return value.toString()
  throw new TypeError('failed to cast string')
}

function middleware(info) {
  if (info.type === String)
      info.type = StringType;
}

/*!
 * validation rules
 */
function minimum(value, min) {
  if (value && value.length < min)
    throw new TypeError('must be at least ' + min + ' characters')
}

function maximum(value, max) {
  if (value && value.length > max)
    throw new TypeError('must be below' + max + ' characters')
}

function enumerable(value, values) {
  if (value && values.indexOf(value) == -1)
    throw new TypeError('must be a valid enum value')
}
