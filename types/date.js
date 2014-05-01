var Schema = require('../lib/schema')
var type = require('type-component')

exports = module.exports = Schema.extend(DateType)

function DateType(settings, key, parent) {
  Schema.call(this, settings, key, parent);
  this.rules({
    before: nyi,
    after: nyi
  });
}

exports.prototype._cast = date;

function nyi() {
  throw new Error('not yet implemented')
}

function date(value) {
  var value_type = type(value)
    , ret = false

	if (value === '' ||
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
