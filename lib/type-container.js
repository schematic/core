var Schema = null
  , Embedded = null // Embedded types should be used internally only
  , type = require('type-component')
  , merge = require('object-component').merge
  , exports = module.exports = TypeContainer

function TypeContainer() {
  var map = {}
  function types (name, type) {
    if (type === undefined) {
      name = name.toLowerCase()
      return map.hasOwnProperty(name)
        ? map[name]
        : undefined
    } else {
      map[name.toLowerCase()] = type
      types.Types[type_case(name)] = type
      type.prototype.TYPE_NAME = name
      return type
    }
  }
  types.infer = function (obj, path, parent) {
    return infer(types, obj, path, parent)
  }
  types.Types = {}
  Schema = Schema || require('./schema')
  return types
}

function infer (types, obj, path,  parent) {
  obj = normalize_type(obj)
  var explicit = isExplicitType(obj)
  // Lazy Load
  Schema = Schema || require('./schema')
  Embedded = Embedded || require('../types/embedded.js')
    var type = explicit
        ? obj.type
        : obj
    , options = {}
    , is_object = isPlainObject(type)
    , name = type_name(type)
  if (explicit) {
    Object.keys(obj)
    .forEach(function(key) {
      if (key !== 'type')
        options[key] = obj[key]
    })
  }
  // embedded types
  if (type instanceof Schema ||
     (type.schema instanceof Schema && (type = type.schema))) {
    options.schema = type
    return new Embedded(options, path, parent)
  }

  if (name === 'Document' || (is_object && !isEmpty(type))) {
    if (!explicit) {
      return types('Document')({schema: type}, path, parent)
    } else {
      return infer(types, type, path, parent)
    }
  }

  if (name === 'Mixed' || is_object) {
    return types('Mixed')(options, path, parent)
  }

  var typedArray = false;
  if (name === 'Array' || (typedArray = Array.isArray(type))) {
    if (typedArray) options.items = type[0]
    return types('Array')(options, path, parent)
  }


  if (typeof type.prototype === 'object' && 
     (type.prototype === Schema.prototype ||
      type.prototype instanceof Schema)) {
    return type(options, path, parent)
  }

  if (undefined !== types(name)) {
    return types(name)(options, path, parent)
  } else if ('function' === typeof type || 'function' === typeof type.cast) {
    options.schema = type
    return new Embedded(options, path, parent)
  } else {
    throw new TypeError('Unable to determine cast type for ' + path)
  }
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
function isPlainObject(obj){
  return type(obj) == 'object' && (!obj.constructor || obj.constructor === Object || obj.constructor.name === 'Object')
}


/**
 * isExplicitType
 * Determines whether or not a type is explictly defined
 * Explicit: {type: 'String'}, Implicit: {type: {type: String}} (implicit object with a type property)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @private
 */
function isExplicitType(obj){
  return obj.type instanceof Schema || !!(obj.type && !obj.type.type)
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
    ? str.charAt(0).toUpperCase() + str.substring(1)
    : undefined
}

/**
 * normalize_type
 * Normalizes type objects so they are all properties with a `type` property such as `{type: obj}`
 *
 * @param obj
 * @return
 */
function normalize_type(obj) {
  var object_type = type(obj)
  if (object_type === 'function' ||
      object_type === 'array' ||
     (object_type === 'object' && obj instanceof Schema)) {
    return {type: obj }
  } else {
    return obj
  }
}
