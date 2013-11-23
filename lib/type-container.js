var Schema = null
  , type = require('type-component')
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
      types.Types[typeCase(name)] = type
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
  obj = normalizeType(obj)
  var explicit = isExplicitType(obj)
  // Lazy Load
  Schema = Schema || require('./schema')
    var type = explicit
        ? obj.type
        : obj
    , options = {}
    , is_object = isPlainObject(type)
    , name = typeName(type)
  if (explicit) {
    Object.keys(obj)
    .forEach(function(key) {
      if (key !== 'type')
        options[key] = obj[key]
    })
  }

  // embedded documents
  if (name === 'Document' || (is_object && !isEmpty(type))) {
    if (!explicit) {
      options.schema = type
      return types('Document')(options, path, parent)
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

  if (type instanceof Schema || (type.schema instanceof Schema && (type = type.schema))) {
    return types('Embedded')(options, path, parent, type)
  }
  if (undefined !== types(name)) {
    return types(name)(options, path, parent)
  } else if ('function' === typeof type || 'function' === typeof type.cast) {
    return types('Caster')(options, path, parent, type)
  } else {
    //console.log('failed object: ', obj)
    //console.log('failed path: ', path)
    throw new TypeError('Unable to determine cast type for ' + path)
  }
}

function normalizeType(obj) {
  var object_type = type(obj)
  if (object_type === 'function' ||
      object_type === 'array' ||
     (object_type === 'object' && obj instanceof Schema)) {
    return {type: obj }
  } else {
    return obj
  }
}

function isPlainObject(obj){
  return type(obj) == 'object' && (!obj.constructor || obj.constructor === Object || obj.constructor.name === 'Object')
}

function isExplicitType(obj){
  return !!(obj.type && !obj.type.type)
}

function typeName(str){
  return str && 'string' == typeof str.name
    ? typeCase(str.name)
    : typeCase(str)
}

function typeCase(str){
  return 'string' == typeof str
    ? str.charAt(0).toUpperCase() + str.substring(1)
    : undefined
}


function isEmpty(obj) {
  return Object.keys(obj).length === 0
}


