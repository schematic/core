var type = require('type-component')
/*! type inferer middleware
 */

exports.object =
function object_middleware(type, options, explicit) {
  if (!isPlainObject(type)) return
  if (!isEmpty(type)) {
    if (!explicit) options.schema = type
    return 'document'
  }
  return 'mixed'
}

exports.caster =
function caster_middleware(type, options) {
  
}

exports.enum =
function enum_middleware(type, options) {
  if (!Array.isArray(type)) return
  if (type.length > 1) {
    options.enum = type
    return 'string'
  }
}

exports.array =
function array_middleware(type, options) {
  if (!Array.isArray(type)) return
  options.items = type[0]
  return 'array'
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


