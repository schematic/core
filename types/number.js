var Schema = require('../lib/schema');

exports = module.exports =
Schema
  .extend(null, 'Number')
  .cast(cast)
  .check(check)
  .rules({min: minimum, max: maximum})

exports.plugin = function() {
  return function (types) {
    types.on('infer', middleware)
  }
}

function middleware(info) {
  if (info.type === Number)
    info.type = exports;
}

function check(value) {
  return typeof (value) == 'number';
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
