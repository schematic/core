/* jshint unused: false */
var exports = module.exports = Schema
var Validator = require('validator-schematic');
var configurable = require('configurable');
var CastError = require('../errors/cast')
var clone = require('clone')

function Schema(settings, key, parent) {
  this.key = key
  this.parent = parent
  this.settings = Object.create(this.settings);
  if (settings)
    this.set(settings);
  var rules = this.validator._rules;
  if (this.settings.default !== undefined && !this.check(this.settings.default))
    throw new TypeError(['Invalid default for `', this.constructor.name, '`', 'at path `', this.path()])
  this.validator = new Validator(rules);
}

configurable(Schema.prototype)

Schema.prototype.settings = {};
Schema.prototype.validator = new Validator({required: required});

function required(value, enabled) {
  if (enabled === true && !this.check(value))
    throw new TypeError('is required');
}

Schema.prototype._validate = function(value, settings, callback) {
  return this.validator.validate(value, settings, callback), this;
}

Schema.prototype._cast = function(value, parent, target) {
  return value
}

Schema.prototype._check = isNotNullOrUndefined

function isNotNullOrUndefined(value) {
  return value !== null && value !== undefined;
}

Schema.prototype.check = function (value) {
  return !!this._check(value);
}

Schema.prototype.cast = function (value,
                                  parent,
                                  target,
                                  ignoreDefault) {
  try {
    if (isNotNullOrUndefined(value)) {
      // we have a non-empty value
      return this._cast(value)
    } else if (this.settings.default !== undefined) {
      // empty value, try using the default if we have it
      value = this.settings.default
      var value_type = typeof value;
      if (typeof value === 'object')
        value = clone(value)
      else if (value_type === 'function')
        value = value()
      return isNotNullOrUndefined(value) ? this._cast(value)
                                         : value
    } else {
      return value; // empty value
    }
  } catch (err) {
    if (err instanceof CastError)
      throw err
    else
      throw new CastError(this, value, err);
  }
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

Schema.check = function (fn) {
  this.prototype._check = fn;
  return this;
}

Schema.prototype.path = function() {
  if (!this._path_cache)
    this._path_cache = this.parent ? [ this.parent.path(),
                                       this.key
                                     ].join('.')
                                   : this.key
  return this._path_cache
}

Schema.prototype.toString = function() {
  return ['[Type: ', this.name, ']'].join('');
}

Schema.extend = function(ctor, name) {
  if (arguments.length == 1 && typeof ctor === 'string') {
    name = ctor
    ctor = undefined
  }
  if (!name && ctor && ctor.name) {
    name = ctor.name
  }
  ctor = ctor || default_ctor(this)
  ctor.prototype = Object.create(Schema.prototype, {
    constructor: {value: ctor},
    name: {value: name, configurable: true }
  })
  ctor.prototype.validator = new Validator(this.prototype.validator._rules);
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
  ctor.check = Schema.check;
  return ctor;
}


function default_ctor(Super) {
  return function UserDefined(settings, key, parent) {
    if (!(this instanceof UserDefined))
      return new UserDefined(settings, key, parent)
    Super.call(this, settings, key, parent)
  }
}
