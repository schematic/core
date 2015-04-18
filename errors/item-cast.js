module.exports = ItemCastError

function ItemCastError(type, errors) {
  Error.captureStackTrace(this, ItemCastError)
  this.errors = errors
  this.type = type
  this.message = [ toTypeName(type),
                   ': Failed to cast items `',
                   keys(errors),
                   '` at `',
                   type.path(),
                   '`'
                  ].join('')

}

ItemCastError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: ItemCastError
  },
  name: {
    value: 'ItemCastError'
  }
})

function toTypeName (type) {
  return type.name ? type.name
                   : type.constructor.name
}

function keys (errors) {
  if (Array.isArray(errors))
    return indices(errors);
  else return Object.keys(errors)
  return values.filter(defined)
}

function indices(arr) {
  var list = [];
  arr.forEach(function (value, i) { list.push(i); });
  return list;
}
