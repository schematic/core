var Schema = require('../lib/schema')
var type = require('type-component')
var mpath = require('mpath')
var ValidationError = require('../errors/validation')
var Mixed = require('./mixed');
var schematic = null;
exports = module.exports = Schema
  .extend(Document)
  .cast(cast)
  .validate(validate)

function Document(settings, key, parent) {
  Schema.call(this, settings, key, parent)
  if (!this.settings.schematic) {
    // use default registry
    this.settings.schematic = schematic || (schematic = require('../index'));
  }
  var schema = this.settings.schema || {};
  this.settings.schema = {};
  this.add(schema)
}

Object.defineProperty(Document.prototype, 'tree', {
  get: function () { return this.settings.schema; }
});
Document.plugin = function() {
  return function(types) {
    types.on('infer', middleware);
  }
}

function middleware(info) {
  if (isPlainObject(info.type)) {
    if (isEmpty(info.type)) {
      info.type = Mixed;
    } else {
      info.settings.schema = info.type
      info.type = Document;
      if (!info.settings.schematic)
        info.settings.schematic = this;
    }

  }
}
function cast(object, parent, target) {
  target = target || (type(object) == 'object' ? object : {})
  var errors = new ValidationError();
  var has_errors = false;
  var schema = this.tree;
  map(object, target, function(key, value) {
    try {
     return schema[key] ? schema[key].cast(value, target) : value
    } catch (err) {
      errors.add(key, err)
      has_errors = true
    }
  })

  if (has_errors) throw errors
  else return target
}

function validate(document, settings, callback) {
  var schema = settings.schema
    , has_errors = false
    , pending = 0
    , cancelled = false
    , keys = Object.keys(schema)
    , length = keys.length
    , errors = new ValidationError(this)
    , strict = false

  for (var i = 0; i < length && !cancelled; i++, pending++) {
    var key = keys[i]
      , value = document[key]
      schema[key].validate(value, done.bind(null, key));
  }
  // handle errors
  function done(key, error) {
    if (error) {
      errors.add(key, error)
      has_errors = true
      if (strict) {
        pending = 1
        cancelled = true
      }
    }
    if (--pending === 0) {
       callback(has_errors && errors, has_errors);
    }
  }
}


Document.prototype.add = function(obj, prefix) {
  prefix = prefix || ''
  Object.keys(obj)
  .forEach(function(key) {
    if (!obj[key]) {
      throw new TypeError('Invalid for schema at path `' + prefix + key + '`')
    }
    this.attr(prefix + key, obj[key])
  }, this)
}

Document.prototype.attr = function(path, obj) {
  if (arguments.length == 1)
    return mpath.get(path, this, 'tree')
  else {
    var type = this.settings.schematic.create(obj, path.split('.').pop(), this)
    mpath.set(path, type, this, 'tree')
  }
  return this
}


function map(object, target, fn) {
  if (type(object) !== 'object') throw new TypeError('must be an object')
  var seen = []
    , cache = []
  Object.keys(object)
  .forEach(function(key) {
    var index = seen.indexOf(object[key])
      , value = index > -1
          ? cache[index]
          : (cache[seen.push(object[key])] = fn(key, object[key]))
     if (target) target[key] = value
  })
}

/**
 * isPlainObject
 * Determines if an object is a plain object/hash/map
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @private
 */
function isPlainObject(obj) {
  return type(obj) == 'object' && (!obj.constructor || obj.constructor === Object || obj.constructor.name === 'Object')
}

/**
 * isEmpty
 * Determines if an object contains no properties
 *
 * @param obj
 * @return {Boolean}
 * @private
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0
}
