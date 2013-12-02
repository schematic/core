var Document = require('./document')
  , exports = module.exports = Document.extend()

exports.cast(function (value, parent, target) {
  if (!target) {
    target = Object.create(prototype(this.get('ctor')))
  }
  return Document.cast.call(this, value, parent, target)
})

exports.rule('ctor', function(value, ctor) {
  var type = typeof ctor
  if (null === type ||
      undefined === type ||
      ('function' === type && value instanceof ctor) ||
      ('object' === type && ctor.isPrototypeOf(value)))
        return;
  else throw new TypeError('must be an instance of `' name(ctor) + '`')
})

function prototype(ctor) {
  return ctor.prototype || ctor
}

function name(ctor) {
  return ctor.name
      ? ctor.name
      : ctor.constructor.name
}
