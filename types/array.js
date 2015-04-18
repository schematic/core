var ItemCastError = require('../errors/item-cast')
var ValidationError = require('../errors/validation');
var Schema = require('../lib/schema');
var Mixed = require('./mixed');
var schematic = require('../');

exports = module.exports =
Schema
  .extend(ArrayType, 'Array')
  .cast(cast)
  .rules({required: required, items: items});

function ArrayType(settings, key, parent) {
  Schema.call(this, settings, key, parent);
  if (!this.settings.schematic) {
    this.settings.schematic = schematic || (schematic = require('../index'));
  }
  this.settings.items.parentArray = this;
}

ArrayType.plugin = function() {
  return function array_plugin(types) {
    types.on('infer', middleware);
  }
}

ArrayType.prototype.items = function(type) {
  if (arguments.length === 0) return this.get('items');
  else this.set('items', this.settings.schematic.create(type, this.key, this));
}
function required(value, enabled) {
  if (enabled && (!!value || !Array.isArray(value) || !isArrayLike(value)))
    throw new TypeError('is required');
}
function middleware(info, key, parent) {
  if (!Array.isArray(info.type) || info.type.length > 1) return
  if (!info.get('schematic')) info.set('schematic', this);
  info.set('items', this.create(info.type[0] || Mixed, key, parent));
  info.type = ArrayType;
}
function cast(value, parent) {
  var type = this.get('items')
  var parent_enabled = this.get('item parent')
  var parent_key = typeof parent_enabled === 'string' ? parent_enabled
                                                      : 'parent'

  if (Array.isArray(value) || isArrayLike(value)) {
    if (parent_enabled)
      value[parent_key] = parent
    return type && type.cast ? cast_items(value, type) : value
  }

  throw new TypeError('must be an array or array-like object')
}

function cast_items(value, type) {
  var ret = []
  var errors = []

  for (var i = 0; i < ret.length; i++) {
    try {
      ret[i] = type.cast(value[i], ret)
    } catch (err) {
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
  var item_errors = new ValidationError(this)
  var has_errors = false
  var pending = value.length

  function next(i, errors) {
    if (errors && errors.errors.length > 0) {
      has_errors = true
      item_errors.add(i, errors)
    }
    if (--pending === 0) done(has_errors && item_errors, !has_errors)
  }

  for (var i = 0; i < value.length; i++) {
    type.validate(value[i], next.bind(null, i))
  }
}


function isArrayLike(o) {
  if (o &&                                  // o is not null, undefined, etc.
      typeof o === 'object' &&              // o is an object
      isFinite(o.length) &&                 // o.length is a finite number
      o.length >= 0 &&                      // o.length is non-negative
      o.length === Math.floor(o.length) &&  // o.length is an integer
      o.length < 4294967296)                // o.length < 2^32
      return true;                          // Then o is array-like
  else
      return false;                         // Otherwise it is not
}
