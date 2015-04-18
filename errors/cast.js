module.exports = CastError

function CastError(type, value, error) {
  /*if (Error.captureStackTrace)
    Error.captureStackTrace(this, this.constructor)*/
  this.error = error
  this.type = type
  this.value = value
  this.stack = error.stack
  var message = [type,
                  ': Failed to cast value `',
                  value,
                  '`'
                ];
  var path = type.path();
  if (path && path.length > 0) {
    message.push(' at path `',
                  type.path(),
                  '`')
  }

  if (error)
    message.push(' : ', error.toString())
  this.message = message.join('');

}

CastError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: CastError
  },
  name: {
    value: 'CastError'
  }
})

function toTypeName (type) {
  return type.name ? type.name
                   : type.constructor.name
}
