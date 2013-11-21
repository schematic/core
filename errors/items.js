module.exports = ItemCastError

function ItemCastError(type, errors) {
  Error.captureStackTrace(this, ItemCastError)
  this.errors = errors
  this.type = type
  this.message = name(type) + 
                 ': Failed to cast items `' + keys(errors) + '` at `' + type.path() + '`'

}

ItemCastError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: ItemCastError
  },
  name: {
    value: 'CastItemsError'
  }
})

function name(type) {
  return type.name 
    ? type.name
    : type.constructor.name
}

function keys(errors){
  var keys = Array.isArray(errors)
    ? errors.map(indices)
    : object_keys(errors)
  return keys.filter(defined)
}

function object_keys(obj) {
return Object
  .keys(obj)
  .map(function(key) {
    return obj.hasOwnProperty(key) && defined(obj[key])
      ? key
      : undefined
  })
}

function indices(key, i, arr){
  return arr.hasOwnProperty(i) ? i : undefined
}

function defined(val) {
  return val !== undefined && val !== null 
}
