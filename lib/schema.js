var exports = module.exports = Schema
var validator = require('validator-schematic');
var Configurable = require('configurable');

function Schema(settings, key, parent) {
  this.key = key
  this.parent = parent
  this.settings = Object.create(this.settings);
  if (settings)
    this.set(settings);
  var rules = this.validator._rules;
  this.validator = new validator(rules);
}

Configurable(Schema.prototype)

Schema.prototype.settings = {};
Schema.prototype.validator = new validator({required: required});

function required(value, enabled) {
  if (enabled == true && (value === undefined || value === null))
    throw new TypeError('is required');
}
Schema.prototype._validate = function(value, settings, callback) {
  return this.validator.validate(value, settings, callback), this;
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

Schema.prototype.validate = function (value, settings, callback) {
  if (arguments.length == 2) {
    callback = settings
    settings = this.settings
  }
  // only run required validator if the value is not casted correctly
  return this._validate(value, settings, callback), this;
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

Schema.rules = function(rules) {
  this.prototype.validator.rules(rules);
  return this;
}

Schema.rule = function(name, rule) {
  if (arguments.length == 1)
    return this.prototype.validator.rule(name);
  else
    this.prototype.validator.rule(name, rule);
  return this;
}

Schema.set = function (key, value) {
  this.prototype.set(key, value);
  return this;
}
Schema.get = function(key) {
  return this.prototype.get(key);
}
Schema.enable = function(key) {
  this.prototype.enable(key);
  return this;
}
Schema.disable = function(key) {
  this.prototype.disable(key);
  return this;
}
Schema.enabled = function(key) {
  return this.prototype.enabled(key);
}
Schema.disabled = function(key) {
  return this.prototype.disabled(key);
}
exports.extend = function(ctor) {
  ctor = ctor || default_ctor(this)
  ctor.prototype = Object.create(Schema.prototype, {
    constructor: {value: ctor}
  })
  ctor.prototype.validator = new validator(this.prototype.validator._rules);
  ctor.extend = Schema.extend;
  ctor.cast = Schema.cast;
  ctor.validate = Schema.validate;
  ctor.rule = Schema.rule;
  ctor.rules = Schema.rules;
  ctor.get = Schema.get;
  ctor.set = Schema.set;
  ctor.enable = Schema.enable;
  ctor.disable = Schema.disable;
  ctor.enabled = Schema.enabled;
  ctor.disabled = Schema.disabled;
  return ctor;
}


function default_ctor(Super) {
  return function ctor(settings, key, parent) {
    if (!(this instanceof ctor))
      return new ctor(settings, key, parent)
    Super.call(this, settings, key, parent)
  }
}
