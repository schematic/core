var type = require('type-component')
var Embedded = null;
/*! type inferer middleware
 */

exports.caster =
function caster_middleware(type, options) {
  Embedded = Embedded || require('../types/embedded');
  if ('function' == typeof type || 'function' == typeof type.cast) {
    options.schema = type;
    return Embedded;
  }
}

exports.object =
function object_middleware(info) {
  if (!isPlainObject(info.type)) return
  if (!isEmpty(info.type)) {
    if (!info.isExplicit()) {
      info.set('schema', info.type);
      info.type = 'document';
    }
  } else {
    info.type = 'mixed';
  }
}

exports.enum =
function enum_middleware(info) {
  if (!Array.isArray(info.type)) return
  if (info.type.length > 1) {
    info.set('enum', info.type);
    info.type = 'string';
    return 'string'
  }
}

exports.array =
function array_middleware(info) {
  if (!Array.isArray(info.type) || info.type.length > 1) return
  info.set('items', info.type[0] || 'mixed');
  info.type = 'array';
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


