var Schema = require('./')

function Model(data, schema, parent){
	schema = schema
		? schema
		: this.constructor.schema


	for(var x in data)
		if(data.hasOwnProperty(x))
			this[x] = data[x]
}

Model.cast = function(obj, parent){

}

function define(obj, prop, desc){
	Object.defineProperty(obj, prop, desc)
}
function model(ctor, schema){
	var proto = typeof ctor === 'function'
		? ctor.prototype
		: ctor

	var ctor = typeof ctor === 'function'
		? ctor
		: createModel(proto, schema)

	define(ctor, 'schema', {
		value: schema
	})

	define(ctor, 'model', {
		value: ctor
	})

	define(ctor, 'cast', {
		value: caster(proto, ctor, schema)
	})
	// configuration stuff
	define(proto, '__model', {
		enumerable: false,
		configurable: false
	})
}

function createModel(proto, schema){
	function _Model(data){
		Model.call(this, data)
	}
	_Model.prototype = Object.create(Model.prototype)
	for(var x in proto)
		if (proto.hasOwnProperty(x))
			_Model.prototype = proto[x]
	model(_Model, schema)
	return _Model
}

function caster(prototype, ctor, schema){
	return function(object, parent){	
		console.log('casting ', object, ' to ', ctor)
		if(object instanceof ctor){
			console.log('object already casted')
			return object
		}
		var instance = Object.create(prototype, {
			parent: {
					value: function() {
						return parent
					}
			}
		})

		if(typeof ctor === 'function')
			ctor.call(instance, object)

		return instance
	}
}


function Profile(data){
	Model.call(this, data, Profile.schema)
}

Profile.schema = new Schema({
	zip: Number,
	city: String
})

Profile.prototype = Object.create(Model.prototype, {
	constructor: {
		value: Profile
	}
})

Profile.prototype.getAddress = function(){
	return this.city + ', ' + this.zip
}



function User(data){
	Model.call(this, data, User.schema)
}

User.prototype = Object.create(Model, {
	constructor: {
		value: User
	}
})

User.schema = new Schema({
	username: String,
	age: {type: 'number', min: 0, max: 10, default: 11},
	born: Date,
	profile: Profile,
	meta: {
		type: {
			foo: String,
			bar: String
		},
		required: true
	}
},{strict: true})






var user = {
	username: 1330,
	age: '19',
	born: 'Apr 28 1993',
	profile: {
		zip: '08053',
		city: 'Marlton'
	},
	meta: {
		foo: 'bar',
		baz: 'quux'
	}
}

var chris = new User(user)
console.log('Me: ', chris, chris.constructor.name)
console.log('Profile: ', chris.profile, chris.profile.getAddress())
var foo = User.schema.attr('meta.foo')
console.log('Schema of profile',foo.path())
console.log('Options: ', foo.options.strict, User.schema.options.strict)
