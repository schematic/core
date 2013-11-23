module.exports = Schema
var types = require('./types')
var validater = require('../../validator')
var merge = require('object-component').merge

function Schema(options, key, parent) {
  this.key = key
  this.parent = parent

  this.options = parent 
    ? merge(Object.create(parent.options), options)
    : options || {}
}

Schema.prototype.validaters = {
  required: function (value, options) {
    if (value === undefined) 
      throw new TypeError('must not be undefined')
  }
}

Schema.prototype._validater = new validater(Schema.prototype.validaters)
Schema.prototype._validate = function(value, options, strict, callback) {
  return this._validater.validate(value, options, strict, callback)
}

Schema.prototype._cast = function(value, parent, target) {
  return value
}

Schema.prototype.cast = function (value, parent, target) {
  if (typeof value === 'function' && parent === undefined) {
    this._cast = value
    return this
  }
  try {
    return this._cast(value, parent, target)
  } catch (err) {
    throw err
  } 
}

Schema.prototype.validate = function (value, options, strict, callback) {
  if (typeof value === 'function')
    return this._validate = value, this
  return this._validate(value, (options = options || this.options) ? options.validate || options : options , strict, callback)
}

/**
 * Get/sets a validation rule
 * @param  {String}   name
 * @param  {Function} fn
 * @return {Schema} Returns self for chaining
 */
Schema.prototype.rule = function(name, fn) {
  if (fn === undefined) return this.validaters[name]
  else this.validaters[name] = fn
  return this
}


Schema.prototype.type = types

function extend(ctor) {
  // Generic static functions
  ;(['validate', 'rule', 'cast', 'type'])
    .forEach(function(fn) {
      ctor[fn] = function (arg1, arg2, arg3) {
        var ret = this.prototype[fn](arg1, arg2, arg3)
        return ret === this.prototype ? ctor : ret
      }
    })
  return ctor
}

extend(Schema)
module.exports.extend = function(ctor) {
  ctor = ctor || default_ctor()
  ctor.prototype = Object.create(Schema.prototype, {
    constructor: ctor
  })
  return extend(ctor)
}


function default_ctor() {
  return function ctor(options, key, parent) {
    if (!(this instanceof ctor))
      return new ctor(options, key, parent)
    Schema.call(this, options, key, parent)
  }
}
