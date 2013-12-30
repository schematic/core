var exports = module.exports = Schema
var validator = require('validator-schematic');
var Configurable = require('./configurable');
var TypeContainer = require('./type-container');

function Schema(settings, key, parent) {
  this.key = key
  this.parent = parent
  this.settings = Object.create(this.settings || {})
  this.set(settings)
  this._validator = new validator(Object.create(this._validator._rules || {}))
}

Configurable(Schema.prototype)



Schema.prototype._validator = new validator({
  required: function(value, enabled) {
    if(enabled === true && value === undefined) throw new TypeError('is required')
  }
})

Schema.prototype._validate = function(value, settings, strict, callback) {
  return this._validator.validate(value, settings, strict, this, callback)
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
    strict = undefined
  }

  if (typeof settings === 'function') {
    callback = settings
    settings = this.settings
    strict = undefined
  }

  return this._validate(value, settings, strict === undefined ? this.enabled('strict') : strict, this, callback)
}

/**
 * Get/sets a validation rule
 * @param  {String}   name
 * @param  {Function} fn
 * @return {Schema} Returns self for chaining
 */
Schema.prototype.rule = function(name, fn) {
  if (fn === undefined) return this._validator.rule(name)
  else this._validator.rule(name, fn)
  return this
}


Schema.prototype.type = function(name, type) {
  return this.get('types').type(name, type)
}



exports.extend = function(ctor, bare) {
  if (bare) {
    return extend(ctor)
  }
  ctor = ctor || default_ctor(this)
  ctor.prototype = Object.create(Schema.prototype, {
    constructor: {value: ctor}
  })
  return extend(ctor)
}


extend(Schema);

Schema.prototype.settings = {
  types: new TypeContainer()
}


function extend(ctor) {
  // Generic static functions
  ;(['validate', 'rule', 'cast', 'type', 'get', 'set', 'enable', 'disable', 'enabled', 'disabled'])
    .forEach(function(fn) {
      ctor[fn] = function (arg1, arg2, arg3) {
        var ret = this.prototype[fn](arg1, arg2, arg3)
        return ret === this.prototype ? ctor : ret
      }
    })
  ctor.extend = this.constructor.extend || ctor.extend || Schema.extend;
  return ctor
}
function default_ctor(Super) {
  return function ctor(settings, key, parent) {
    if (!(this instanceof ctor))
      return new ctor(settings, key, parent)
    Super.call(this, settings, key, parent)
  }
}
