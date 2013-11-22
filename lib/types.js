var Schema = require('./schema')
  , exports = module.exports = TypeContainer

function TypeContainer() {
  var map = {}
  function types(name, type) {
    if (type === undefined) {
      name = name.toLowerCase()
      return map.hasOwnProperty(name)
        ? map[name]
        : undefined
    } else {
      map[name.toLowerCase()] = type
      type.Types[typeCase(name)] = type
      return type
    }
  }
  types.infer = function (path, obj, parent) {
    return infer(types, path, obj, parent)
  }
  types.Types = {}
  return types
}

function infer(types, path, obj, parent) {
  if (typeof obj === 'function' || obj instanceof Schema)
    obj = {type: obj}
  var explicit = isExplicitType(obj)
    , type = explicit
        ? obj.type
        : obj
    , options = {}
    , is_object = isPlainObject(obj)
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
      return new types('Document')(options, path, parent)
    } else {
      return infer(types, path, type, parent)
    }
  }

  if (name === 'Mixed' || is_object) {
    return new types('Mixed')(options, path, parent)
  }

  if (name === 'Array' || (typedArray = Array.isArray(type) || Array === type)) {
    if (typedArray) options.items = type[0]
    return new types('Array')(options, path, parent)
  }

  if (type instanceof Schema || (type.schema instanceof Schema && (type = type.schema))) {
    return new types('Embedded')(options, path, parent, type)
  }

  if (undefined !== types(name)) {
    return new types(name)
  } else if ('function' === typeof type || 'function' === typeof type.cast) {
    return new types('Caster')(options, path, parent, type)
  } else {
    console.log('failed object: ', obj)
    console.log('failed path: ', path)
    throw new TypeError('Unable to determine cast type for ' + path)
  }
}

function isPlainObject(obj){
  return type(obj) == 'object' && (!obj.constructor || obj.constructor === Object || obj.constructor.name === 'Object')
}

function notEmpty(val){
  return !!val
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

function typeCase(name) {
  return name.substr(0,1).toUpperCase() + name.substr(1)
}


