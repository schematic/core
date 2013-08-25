require('./')
var model = require('./types/model')

var names = {}
var schema;
function User(obj) {
	if(!(this instanceof User)) return new User(obj)
	schema.cast(obj, null, this)
}

schema = User.schema = new model({
	model: User,
  schema:  {
	username: String,
	age: {type: Number, min: 20}
},
	strict: true
});

User.cast = function(value, parent, target) {
	return schema.cast(value, parent, target)
}

schema.attr('siblings', {type: Array, items: User})


User.prototype.sayHello = function(){
	console.log('Hello, my name is', this.username, 'and I am', this.age, 'years old')
}



var user = new User({
	username: 'Chris Tarquini',
	age: '20',
	siblings: [{username: 'Mike Tarquini', age: '19'}]
})

console.log(user)

