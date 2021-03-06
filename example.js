var schematic = require('./');
function User(obj) {
  if (!(this instanceof User)) return new User(obj);
  User.schema.cast(obj, null, this);
}
User.schema = schematic.create({
  username: {type: 'String', required: true},
  password: {type: 'String', min: 10, required: true},
  bio: String,
  age: Number,
  gender: {type: String, enum: ['male', 'female', 'other']}
});

User.schema.enable('strict')

User.prototype.checkPassword = function (password){
  return this.password == password;
};

User.prototype.about = function() {
  return 'Hello! My name is ' + this.username + "! Here's some neat stuff about me: \n" + this.bio;
}

var chris = new User({username: "Chris", password: "sss", age: "21", gender: 'male', bio: 'I code stuff all day'});
console.log(chris);
console.log('Age: ', chris.age, '(', typeof chris.age, ')');
console.log(chris.about());



User.schema.validate(chris, function (errors){
  console.log('errors: ',errors, errors && errors.toString());
});
