module.exports = Schema
var types = require('./types')
  , validater = require('../../validator')
  , merge = require('object-component').merge
  , Configurable = require('./configurable')

function Schema(settings, key, parent) {
  this.key = key
  this.parent = parent
  this.settings = parent 
    ? merge(Object.create(parent.settings), settings)
    : settings || {}
}

Configurable(Schema.prototype)

Schema.prototype.validaters = {
  required: function (value, is_required) {
    if (is_required && value === undefined) 
      throw new TypeError('must not be undefined')
  }
}

Schema.prototype._validater = new validater(Schema.prototype.validaters)
Schema.prototype._validate = function(value, settings, strict, callback) {
  return this._validater.validate(value, settings, strict, callback)
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

Schema.prototype.validate = function (value, settings, strict, callback) {
  if (typeof value === 'function')
    return this._validate = value, this

  if (typeof strict === 'function') {
    callback = strict
    strict = false
  }

  if (typeof settings === 'function') {
    callback = settings
    settings = this.settings
    strict = false
  }

  return this._validate(value, settings, strict, callback)
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
  return function ctor(settings, key, parent) {
    if (!(this instanceof ctor))
      return new ctor(settings, key, parent)
    Schema.call(this, settings, key, parent)
  }
}
