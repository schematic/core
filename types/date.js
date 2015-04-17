var Schema = require('../lib/schema')
var type = require('type-component')

var DateType = exports = module.exports =
Schema
  .extend()
  .cast(date)
  .rules({required: required, before: before, after: after});


exports.plugin = function () {
  return function (types) {
    types.on('infer', middleware)
  }
}

function middleware(info) {
  if (info.type === Date)
    info.type = DateType
}
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
  var ret = false

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
