var Schema = require('../lib/schema')
var type = require('type-component')
module.exports = 
  Schema.extend()
  .cast(date)
  .rule('before', nyi)
  .rule('after', nyi)

function nyi() {
  throw new Error('not yet implemented')
}

function date(value) {
  var value_type = type(value)
    , ret = false

	if (value === undefined ||
      value === null || 
      value === '' ||
      value_type == 'date') 
    return value

  // support for timestamps
  if (value_type == 'number' || String(value) == Number(value))
    ret = new Date(Number(value));

  // support for date strings
  else if (value.toString)
    ret = new Date(value.toString());

  if (ret && ret.toString() != 'Invalid Date')
    return ret;

  throw new TypeError('invalid date')
}
