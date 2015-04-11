
# schema

`schematic/schema` provides a light and modular component for casting and validating objects based on mongoose-esque schemas

It's currently non-functioning and I'm in the middle of a major rewrite. A usable version should be up soon along.

[![Build Status](https://travis-ci.org/schematic/schema.png)](https://travis-ci.org/schematic/schema)


## API (Planned, not implemented)
```javascript
var schematic = require('schematic-core')
var model = require('schematic-core/model') // model helper, not the type!

var UserSchema = {
  username: String,
  password: String,
  age: {type: Number, min: 13}
};

function User(obj) {
  schema.cast(obj, null, this)
}
// Model methods are just normal methods on the prototype
// Define your classes like you ussually do
User.prototype.login = function (password) {
  return password == this.password;
}

User.schema = model(User, UserSchema); // will add a `schema` property to `User`


// Adding a `schema` property is very special in schematic
// This allows you to use your model directly in schematic with no special glue
// No special construction methods required
schematic.define('User', User);

// To intrusive? no problem! Just define your model like so
var UserType = model(User, UserSchema);
schematic.define('User', UserType);
// In order to make your class a first class citizen you will need some middleware
schematic.on('infer', function (info) {
  if (info.type == User) return UserType; // or 'User'/'user' since we defined it in schematic
});

// Your model is now a first class citizen
var Blog = schematic.create({ // automatically creates a schema with the `Document` type
  title: String,
  body: String,
  author: User,
  comments: [{
    text: String,
    author: User
  }]
});

blog.attr('author') == User.schema // true
blog.attr('author').model == User // true

// You can implment your find/save/delete functions on your model prototype.
// Schematic leaves such matters to higher level libraries

```



## License

  MIT
