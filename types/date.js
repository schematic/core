module.exports = DateType
var Schema = require('../schema')
var type = require('type-component')

function DateType(options, parent, path){
	Schema.call(this, options, parent, path)
}

DateType.prototype = Object.create(Schema.prototype, {
	constructor: {
		value: DateType
	}
})

DateType.prototype._cast = function(value, parent){
	if (value === undefined || value === null || value == '') return value

  if (value instanceof Date)
    return value;

  var date;

  // support for timestamps
  if (value instanceof Number || 'number' == typeof value 
      || String(value) == Number(value))
    date = new Date(Number(value));

  // support for date strings
  else if (value.toString)
    date = new Date(value.toString());

  if (date.toString() != 'Invalid Date')
    return date;

  throw new TypeError('invalid date')
}
