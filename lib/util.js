var type = require('type-component');


/**
 * isPlainObject
 * Determines if an object is a plain object/hash/map
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @private
 */
exports.isPlainObject =
function isPlainObject(obj) {
  return type(obj) == 'object' && (!obj.constructor || obj.constructor === Object || obj.constructor.name === 'Object')
}
