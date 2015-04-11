var Document = require('./document')
  , exports = module.exports = Document.extend(Model).cast(cast)

function Model(settings, key, parent) {
  Document.call(this, settings, key, parent);
  this.rule('model', model);
}

function cast(value, parent, target) {
  if (!target) {
    target = Object.create(this.get('model').prototype);
  }
  return Document.cast.call(this, value, parent, target)
}

function model(value, ctor) {
  var type = typeof ctor
  if ('function' === type && value instanceof ctor)
        return;
  else throw new TypeError('must be an instance of `' + name(ctor) + '`')
}

function prototype(ctor) {
  return ctor.prototype || ctor
}

function name(ctor) {
  return ctor.name
      ? ctor.name
      : ctor.constructor.name
}
