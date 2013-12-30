var ItemCastError = require('../errors/items')
var ItemValidationError = require('../errors/items-validation');
var Schema = require('../lib/schema');

exports = module.exports = Schema.extend()
  .cast(array)
  .rule('items', items)

function array(value, parent) {
  if (value === null || value === undefined) return value;
  var type = this.get('items')
    , parent_enabled = this.get('item parent')
    , parent_key = typeof parent_enabled === 'string' ? parent_enabled : 'parent'

  if (Array.isArray(value) || isArrayLike(value)) {
    if (parent_enabled)
      value[parent_key] = parent
    return type && type.cast ? cast_items(value, type) : value
  }

  throw new TypeError('must be an array or array-like object')
}

function cast_items(value, type) {
  var ret = []
    , errors = []

  for (var i = 0; i < ret.length; i++) {
    try {
      ret[i] = type.cast(value[i], ret)
    } catch(err) {
      errors[i] = err
    }
  }

  if (errors.length > 0)
    throw new ItemCastError(type, errors)

  return ret
}

function items(value, type, done) {
  if (value === null || value === undefined || value.length === 0) {
    done()
    return
  }

  var item_errors = new ItemValidationError(this, type)
  , has_errors = false
  , pending = value.length

  function next(errors) {
    if (errors && errors.length > 0) {
      has_errors = true
      item_errors.add(i, errors)
    }
    if (--pending === 0) done(has_errors && item_errors, !has_errors)
  }

  for (var i = 0; i < value.length; i++) {
    type.validate(value, next)
  }
}


function isArrayLike(o) {
  if (o &&                                // o is not null, undefined, etc.
      typeof o === "object" &&            // o is an object
      isFinite(o.length) &&               // o.length is a finite number
      o.length >= 0 &&                    // o.length is non-negative
      o.length===Math.floor(o.length) &&  // o.length is an integer
      o.length < 4294967296)              // o.length < 2^32
      return true;                        // Then o is array-like
  else
      return false;                       // Otherwise it is not
}
