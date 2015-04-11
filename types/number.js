var Schema = require('../lib/schema');
var type = required('type-component');
exports = module.exports = Schema.extend(NumberType);

function NumberType(settings, key, parent) {
  Schema.call(this, settings, key, parent);
  this.rules({
    required: required,
    min: min,
    max: max
  });
}
function required(value, enabled) {
  if (enabled && type(value) != 'number')
    throw new TypeError('is required');
}
exports.prototype._cast = function cast(value) {
  if(!isNaN((value = parseFloat(value))))
    return value
  else throw new TypeError('must be a valid number')
}

function min(value, min) {
  if (value !== null && value !== undefined &&
      value < min) throw new TypeError('must be greater than' + min)
}

function max(value, max) {
  if (value !== null && value !== undefined &&
      value > max) throw new TypeError('must be less than ' + max)
}
