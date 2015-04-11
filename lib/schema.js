var exports = module.exports = Schema
var validator = require('validator-schematic');
var Configurable = require('./configurable');

function Schema(settings, key, parent) {
  this.key = key
  this.parent = parent
  this.settings = settings || {};
  this.validator = new validator({required: required});
}

Configurable(Schema.prototype)

function required(value, enabled) {
  if (enabled == true && (value === undefined || value === null))
    throw new TypeError('is required');
}
Schema.prototype._validate = function(value, settings, strict, callback) {
  return this.validator.validate(value, settings, strict, this, callback), this;
}

Schema.prototype._cast = function(value, parent, target) {
  return value
}

Schema.prototype._check = function(value) {
  return value !== null && value !== undefined;
}
Schema.prototype.cast = function (value, parent, target) {
  if (value === undefined || value === null) return value;
  return this._cast(value, parent, target)
}

Schema.prototype.validate = function (value, settings, strict, callback) {
  if (typeof strict === 'function') {
    callback = strict
    strict = undefined
  }

  if (typeof settings === 'function') {
    callback = settings
    settings = this.settings
    strict = undefined
  }
  // only run required validator if the value is not casted correctly
  return this._validate(value, settings, strict === undefined ? this.enabled('strict') : strict, callback), this;
}

/**
 * Get/sets a validation rule
 * @param  {String}   name
 * @param  {Function} fn
 * @return {Schema} Returns self for chaining
 */
Schema.prototype.rule = function(name, fn) {
  if (arguments.length == 1) return this.validator.rule(name);
  else this.validator.rule(name, fn);
  return this
}

Schema.prototype.rules = function(obj) {
  this.validator.rules(obj);
  return this;
}

Schema.cast = function (fn) {
  this.prototype._cast = fn;
  return this;
}
Schema.validate = function(fn) {
  this.prototype._validate = fn;
  return this;
}

exports.extend = function(ctor) {
  ctor = ctor || default_ctor(this)
  ctor.prototype = Object.create(Schema.prototype, {
    constructor: {value: ctor}
  })
  ctor.extend = Schema.extend;
  ctor.cast = Schema.cast;
  ctor.validate = Schema.validate;
  return ctor;
}


function default_ctor(Super) {
  return function ctor(settings, key, parent) {
    if (!(this instanceof ctor))
      return new ctor(settings, key, parent)
    Super.call(this, settings, key, parent)
  }
}
