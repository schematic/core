var Schema = require('../lib/schema')
var type = require('type-component')

exports = module.exports =
Schema
  .extend()
  .cast(date)
  .rules({required: required, before: before, after: after});


exports.plugin = function () {
  return function (info) {
    if (info.type == 'Date') return exports;
  }
}

//exports.prototype._cast = date;

function required(value, enabled) {
  if (enabled && !(value instanceof Date))
      throw new TypeError('is required');
}
function before(value, date) {
  if (value !== null && value !== undefined && date && +value > +date)
    throw new TypeError('must be before `' + String(date) + '`');
}
function after(value, date) {
  if (value !== null && value !== undefined && date && +value < +date)
    throw new TypeError('must be after `' + String(date) + '`');
}


function date(value) {
  var value_type = type(value)
    , ret = false

  if (value_type == 'date')
    return value

  if (value === '') return null;
  // support for timestamps
  var timestamp;
  if (value_type == 'number' || String(value) == (timestamp = Number(value)))
    ret = new Date(timestamp || value);

  // support for date strings
  else if (value.toString)
    ret = new Date(value.toString());

  if (ret && ret.toString() != 'Invalid Date')
    return ret;

  throw new TypeError('invalid date')
}
