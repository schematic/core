var Schema = require('./schema')
var type = require('type-component')
var emitter = require('events').EventEmitter
var configurable = require('configurable')
var exports = module.exports = Schematic;

function Schematic() {
  if (!(this instanceof Schematic)) return new Schematic()

  this.types = Object.create(null)
}

Schematic.prototype = Object.create(emitter.prototype);
exports.prototype.type = function (name) {
  return this.types[toTypeCase(name)];
}
exports.prototype.defined = function(name) {
  return this.types[toTypeCase(name)] === undefined;
}

exports.prototype.define = function (name, type, overwrite) {
  name = toTypeCase(name);
  if (!overwrite && this.types[name] !== undefined) {
    throw new Error([ 'Unable to define type `',
                      name,
                      '` because it is already defined.',
                      ' You can force overwriting a type by passing `overwrite=true`.',
                      'Example: `#define(name, type, true)`'
                     ].join(''));
  }
  this.emit('define', name, type);
  this.types[name] = type;
  return this;
}

exports.prototype.undefine = function(name) {
  name = toTypeCase(name)
  if (this.types[name]) {
    this.emit('undefine', name, this.types)
    this.types[name] = undefined;
  }
}

exports.prototype.use = function(fn) {
  if (type(fn) == 'string') {
    var schema = this.type(fn);
    if (!schema)
      throw new Error('Can not use plugin because type `' + fn + '` is not defined');
    var args = new Array(arguments.length - 1);
    for (var i = 0; i < args.length; i++) args[i] = arguments[i + 1];
    fn = schema.plugin.apply(schema, args) || noop;
  }
  fn(this);
  return this
}

exports.prototype.create = function(obj, path, parent) {
  return infer(this, obj, path, parent)
}

function infer (types, obj, path,  parent) {
  var info = new TypeInfo(obj)

  if (info.type instanceof Schema) {
    throw new TypeError(['Type ',
                        toTypeName(info.type),
                        ' at `', path,
                        '` can not be an instance of `Schema`.',
                        'Did you mean to pass a constructor or call #extend()?'].join(''));
  }
  var SchemaCtor = getSchemaConstructor(info.type);
  if (!SchemaCtor) {
    // Not a Schema constructor, try letting middlware infer the type
    types.emit('infer', info, path, parent);
    SchemaCtor = getSchemaConstructor(info.type)
  }
  if (SchemaCtor) {
    return new SchemaCtor(info.settings, path, parent);
  }
  throw new TypeError([ 'Unable to infer Schema Type of `',
                        toTypeName(info.type),
                        '` at `', path, '`' ].join(''));
}

/**
 * getSchemaConstructor
 * If the object is a constructor that inherits from Schema
 * Otherwise returns undefined
 *
 * @param object
 * @return {function|undefined} Schema Constructor
 */
function getSchemaConstructor(object) {
  if (isFunction(object) && isSchemaConstructor(object))
    return object
}
/**
 * isSchemaConstructor
 * Determines if a function is a constructor of a Schema type
 * @param type
 * @return
 */
function isSchemaConstructor(type) {
  return type.prototype === Schema.prototype || type.prototype instanceof Schema
}

/**
 * isExplicit
 * Determines whether or not a type is explictly defined
 * Explicit: {type: 'String'}
 * Implicit: {type: {type: String}} (implicit object with a type property)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @private
 */
function isExplicit(object) {
  var object_type = type(object)
  return (object_type !== 'function' && object_type !== 'array') &&
    !!(object.type && !object.type.type)
}

/**
 * toTypeName
 * Attempts to guess the type name of an object
 * For objects/functions it will return its `name` property
 * For strings it will return the argument you passed
 *
 * @param {Object|Function|String} object
 * @return {String}
 * @private
 */
function toTypeName(object) {
  return object &&
        'string' == typeof object.name ? toTypeCase(object.name)
                                       : toTypeCase(object)
}

/**
 * toTypeCase
 * Converts the first character of a string to uppercase
 *
 * @param {String} str
 * @return {String|undefined}
 */
function toTypeCase(str) {
  return 'string' == typeof str ? str.toLowerCase()
                                : undefined
}


function TypeInfo(object) {
  var is_schematic_type = isObject(object) && isSchemaConstructor(object)
  this._is_explicit = is_schematic_type || isExplicit(object)
  this.type = this._is_explicit ? object.type : object;
  this.settings = this._is_explicit ? filter(object, 'type') : {}
}
configurable(TypeInfo.prototype);
TypeInfo.prototype.isExplicit = function() {
  return this._is_explicit;
}

function filter(object, ignore) {
  var target = {}
  Object.keys(object).forEach(function(key) {
    if (key !== ignore) target[key] = object[key];
  });
  return target
}

function isObject(value) {
  return type(value) === 'object';
}

function isFunction(value) {
  return type(value) === 'function';
}

function noop() {  }
