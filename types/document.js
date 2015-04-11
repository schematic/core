var Schema = require('../lib/schema')
var type = require('type-component')
var mpath = require('mpath')
var isPlainObject = require('../lib/util').isPlainObject;
var ValidationError = require('validator-schematic/errors/validation')
var Mixed = require('./mixed');
var schematic = null;
exports = module.exports = Schema.extend(Document).cast(cast)

function Document(settings, key, parent) {
  Schema.call(this, settings, key, parent)
  if (!this.settings.schematic) {
    // use default registry
    this.settings.schematic = schematic || (schematic = require('../index'));
  }
  var schema = this.settings.schema || {};
  this.set('schema', this.tree = {})
  this.add(schema)
}
Document.plugin = function() {
  return function(types) {
    types.on('infer', middleware);
  }
}

function middleware(info) {
  if (isPlainObject(info.type)) {
    if (Object.keys(info).length > 0) {
      if (true || !info.isExplicit()) {
        info.set('schema', info.type);
        if(!info.get('schematic')) info.set('schematic', this);
        info.type = Document;
      }
    } else {
      info.type = Mixed;
    }
  }
}
function cast(object, parent, target) {
  target = target || (type(object) == 'object' ? object : {})
  var errors = new ValidationError(this);
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
Document.prototype.__validate = Document.prototype._validate;
Document.prototype._validate = function(document, settings, strict, callback) {
  var schema = this.tree
  this.__validate(document, settings, strict,  function (errors) {
    if (errors && strict) {
      callback(errors, false)
    } else {
     validate_children(errors || new ValidationError(this), schema, document, settings, strict, callback) 
    }
  })
}

function validate_children(errors, schema, document, settings, strict, callback) {
  var has_errors = false
    , pending = 0
    , cancelled = false
    , keys = Object.keys(schema)
  for (var i = 0; i < keys.length && !cancelled; i++, pending++) {
    var key = keys[i]
      , value = document[key]
      validate(schema, key, value, settings, strict, done)
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
    if (--pending === 0) callback(has_errors && errors, has_errors)
  }
}

function validate(schema, key, value, settings, strict, callback) {
  schema[key].validate(value, function(error) {
    callback(key, error)
  })
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
  if (obj === undefined)
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

