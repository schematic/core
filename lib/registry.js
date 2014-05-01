var Schema = require('./schema')
  , Embedded = null // Embedded types should be used internally only
  , type = require('type-component')
  , emitter = require('emitter-component')
  , configurable = require('./configurable')
  , exports = module.exports = TypeContainer

function TypeContainer() {
  if (!(this instanceof TypeContainer)) return new TypeContainer()

  this.types = Object.create(null)
  this.middleware = []
}
exports.Schema = Schema;
emitter(TypeContainer.prototype);
exports.prototype.get = function (name) {
  return this.types[type_case(name)];
}
exports.prototype.defined = function(name) {
  return this.types[type_case(name)] == undefined;
}

exports.prototype.define = function (name, type, overwrite) {
  name = type_case(name);
  if (!overwrite && this.types[name] !== undefined) {
    throw new Error(["Unable to define type `", name, "` because it is already defined. You can force overwriting a type by passing `overwrite=true`. Example: `#define(name, type, true)`"].join(''));
  }
  this.emit('define', name, type);
  this.types[name] = type;
  return this;
}

exports.prototype.undefine = function(name) {
  name = type_case(name)
  if (this.types[name]) {
    this.emit('undefine', name, this.types)
    this.types[name] = undefined;
  }
}

exports.prototype.use = function(fn) {
  if (type(fn) == 'string') {
    var schema = this.get(fn);
    if (!schema)
      throw new Error('Can not use plugin because type `' + fn + '` is not undefined');
    var args = new Array(arguments.length - 1);
    for (var i = 0; i < args.length; i++) args[i] = arguments[i + 1];
    fn = schema.plugin.apply(schema, args) || noop;
  }
  fn(this);
  return this
}

exports.prototype.infer = function (obj, path, parent) {
  if (obj && type(obj) == 'object' && obj instanceof Schema)
    return obj;
  else return this.create(obj, path, parent);
}

exports.prototype.create = function(obj, path, parent) {
  return infer(this, obj, path, parent)
}

function infer (types, obj, path,  parent) {
  var info = new TypeInfo(obj)
  if (info.isExplicit())
  if (info.type instanceof Schema) {
    throw new TypeError(['Type ', type_name(info.type), ' at `', path,'` can not be an instance of `Schema`. Did you mean to pass a constructor?'].join(''));
  }
  var schema = getSchemaConstructor(info.type, true);
  if (!schema) {
    // Not a Schema constructor, try letting middlware infer the type
    types.emit('infer', info, path, parent);
    schema = getSchemaConstructor(info.type) || fromName(types, info.type);
  }
  if (schema) {
    return new schema(info.settings, path, parent);
  }
  console.log(info.type);
  throw new TypeError([ 'Unable to infer Schema Type of `', type_name(info.type),
                       '` at `', path, '`'].join(''));
}

/*!
 * utility methods
 * @private
 */
function fromName(types, object) {
  var name = type_name(object);
  if (name) return types.get(name);
}
/**
 * getSchemaConstructor
 * If the object is a constructor that inherits from Schema or contains has a `schema` property which does so, return that constructor. Otherwise returns undefined
 * @param object
 * @return {function|undefined} Schema Constructor
 */
function getSchemaConstructor(object, bool, use_prop) {
  if (object) {
    if (type(object) == 'function' && isSchemaConstructor(object)) 
      return object;
    else if (use_prop && type(object.schema) == 'function' && isSchemaConstructor(object.schema))
      return object.schema;
  }
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
 * Explicit: {type: 'String'}, Implicit: {type: {type: String}} (implicit object with a type property)
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
 * type_name
 * Attempts to guess the type name of an object
 * For objects/functions it will return its `name` property
 * For strings it will return the argument you passed
 *
 * @param {Object|Function|String} object
 * @return {String}
 * @private
 */
function type_name(object){
  return object && 'string' == typeof object.name
    ? type_case(object.name)
    : type_case(object)
}

/**
 * type_case
 * Converts the first character of a string to uppercase
 *
 * @param {String} str
 * @return {String|undefined}
 */
function type_case(str){
  return 'string' == typeof str
    ? str.toLowerCase()
    : undefined
}

/**
 * normalize_type
 * Normalizes type objects so they are all properties with a `type` property such as `{type: obj}`
 *
 * @param obj
 * @return
 */
function TypeInfo(object) {
  var is_schematic_type = type(object) === 'object' && isSchemaConstructor(object)
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

function noop(){};
