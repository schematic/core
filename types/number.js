var Schema = require('../lib/schema')

exports = module.exports = Schema.extend(NumberType);

function NumberType(settings, key, parent) {
  Schema.call(this, settings, key, parent);
  this.rules({
    min: min,
    max: max
  });
}

exports.prototype._cast = function cast(value) {
  if(!isNaN((value = parseFloat(value))))
    return value
  else throw new TypeError('must be a valid number')
}

function min(value, min) {
  if (value < min) throw new TypeError('must be greater than' + min)
}

function max(value, max) {
  if (value > max) throw new TypeError('must be less than ' + max)
}
