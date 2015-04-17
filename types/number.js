var Schema = require('../lib/schema');

exports = module.exports =
Schema
  .extend()
  .cast(cast)
  .rules({required: required, min: minimum, max: maximum})


function required(value, enabled) {
  if (enabled && (value === undefined || value === null || isNaN(value)))
    throw new TypeError('is required');
}

function cast(value) {
  if (!isNaN(value)) {
    if (value === undefined)
      return value;
    else if (value === null || value === '')
      return null;
    else
      if (!isNaN(value = +value))
        return value;
  }
  throw new TypeError('must be a valid number')
}

function minimum(value, min) {
  if (value !== null && value !== undefined &&
      value < min) throw new TypeError('must be greater than' + min)
}

function maximum(value, max) {
  if (value !== null && value !== undefined &&
      value > max) throw new TypeError('must be less than ' + max)
}
