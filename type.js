module.exports = SchemaType;
function SchemaType(path, options, cast){
	this.caster = caster(cast)
	this.path = path
	this.options = options
}

SchemaType.prototype.cast = function(value, parent){
	return this.caster(value, parent)
}

function caster(ctor){
	if (typeof ctor.cast == 'function') {
		return function (data, parent, schema){
			return ctor.cast(data, parent, schema)
		}
	} else if (typeof ctor == 'function') {
		return function (data, parent, schema){
			return new ctor(data)
		}
	} else {
		return function (data, parent, schema){
			console.warn('invalid caster for ', data, ' on ', parent)
			return data
		}
	}
}