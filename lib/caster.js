var Schema = require('../schema')
exports.caster =
function caster(ctor){
	if (!ctor) return Schema.prototype._cast
  if ('function' == typeof ctor.cast) {
		return function(obj, parent, target){
			return ctor.cast(obj, parent, target)
		}
	} else return typeof ctor == 'function'
				? ctor
				: Schema.prototype.cast
}


exports.validator =
function validator(ctor) {
	if (!ctor) return Schema.prototype._validate
  if ('function' == typeof ctor.validate) {
		return function(obj, parent, target){
			return ctor.validate(obj, parent, target)
		}
	} else return typeof ctor == 'function'
				? ctor
				: Schema.prototype.validate
}