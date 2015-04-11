var NumberType = require('./types/number.js');
var StringType = require('./types/string')
var ArrayType = require('./types/array')

console.log(NumberType.cast('100'))
console.log(StringType.cast(10))

var type = new ArrayType({
  items: NumberType
})

var val = type.cast(['10', '44', 44, 'foo'])
console.log(val)
