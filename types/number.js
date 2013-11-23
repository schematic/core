var Schema = require('../lib/schema')

exports = module.exports = Schema.extend()
  .cast(number)
  .rule('min', min)
  .rule('max', max)

function number(value) {
  if (value === undefined ||
      value === null ||
      !isNaN((value = parseFloat(value))))
    return value
  else throw new TypeError('must be a valid number') 
}

function min(value, min) {
  if (value < min) throw new TypeError('must be greater than' + min)
}

function max(value, max) {
  if (value > max) throw new TypeError('must be less than ' + max)
}
