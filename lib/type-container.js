var Schema = null
  , Embedded = null // Embedded types should be used internally only
  , type = require('type-component')
  , exports = module.exports = TypeContainer

function TypeContainer() {
  if (!(this instanceof TypeContainer)) return new TypeContainer()

  this.types = Object.create(null)
  this.middleware = [object_middleware, array_middleware]
}

exports.prototype.type = function(name, type) {
  name = name.toLowerCase()
  if (arguments.length === 1) {
    return this.types[name]
  } else {
    this.types[name] = type
    type.prototype.TYPE_NAME = name
    return type
  }
}

exports.prototype.use = function(fn) {
  this.middleware.push(fn)
  return this
}

exports.prototype.infer = function(obj, path, parent) {
  return infer(this, obj, path, parent)
}

function infer (types, obj, path,  parent) {
  var normalized = normalize_type(obj)
    , type = normalized.type
    , options = normalized.options
    , explicit = normalized.explicit
    , middleware = types.middleware
    , result = null
    , name;

  Schema = Schema || require('./schema')
  Embedded = Embedded || require('../types/embedded')

  // Embedded types must be handled before middleware
  if (type instanceof Schema ||
     (type.schema instanceof Schema && (type = type.schema))) {
    options.schema = type
     return new Embedded(options, path, parent)
  }
  // execute middleware (no async for now)
  for (var i = 0; i < middleware.length; i++) {
    result = middleware[i](type, options, explicit)
    if (result !== undefined && result !== null) type = result
  }

  // If we have a type constructor just call it and return the result
  if (typeof type.prototype === 'object' && isSchemaConstructor(type)) {
    return new type(options, path, parent)
  }
  name = type_name(type)
  // Otherwise try to look up the type by it's name
  if (name && (result = types.type(type_name(type)))) {
    return new result(options, path, parent)
  }

  // Functions/Castable objects get wrapped in an Embedded type
  if ('function' === typeof type || 'function' === typeof type.cast) {
    options.schema = type
    return new Embedded(options, path, parent)
  }
  throw new TypeError('Unable to determine cast type of `'+(name || type)+'` at `' + path + '`')
}

/*! type inferer middleware
 * TODO: 
 *  Move these to a seperate component
 */
function object_middleware(type, options, explicit) {
  if (!isPlainObject(type)) return
  if (!isEmpty(type)) {
    if (!explicit) options.schema = type
    return 'document'
  }
  return 'mixed'
}

function caster_middleware(type, options) {
  
}

function enum_middleware(type, options) {
  if (!Array.isArray(type)) return
  if (type.length > 1) {
    options.enum = type
    return 'string'
  }
}

function array_middleware(type, options) {
  if (!Array.isArray(type)) return
  options.items = type[0]
  return 'array'
}

/*!
 * utility methods 
 * @private
 */

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
  return (object_type !== 'function' && object_type !== 'array') && !!(object.type && !object.type.type)
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
function normalize_type(object) {
  var is_schematic_type = type(object) === 'object' && object instanceof Schema
    , is_explicit = is_schematic_type || isExplicit(object)
    , has_options = is_explicit && !is_schematic_type
    , schema_type = has_options ? object.type : object
    , options = has_options ? filter(object, 'type') : {}
  return {type: schema_type, options: options, explicit: is_explicit}
}

function filter(object, ignore) {
  var target = {}
  filter_merge(object, target, ignore)
  return target
}
function filter_merge(source, destination, ignore) {
  return function(key) {
    if (key !== ignore) destination[key] = source[key]
  }
}
