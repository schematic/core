
# schema

`schematic/schema` provides a light and modular component for casting and validating objects based on mongoose-esque schemas

It's currently non-functioning and I'm in the middle of a major rewrite. A usable version should be up soon along. Ideally there'll be a way to use schematic schemas with `component/model`

[![Build Status](https://travis-ci.org/schematic/schema.png)](https://travis-ci.org/schematic/schema)

## Installation

  Install with [component(1)](http://component.io):

    $ component install schematic/schema

## API (Planned, not implemented)
```javascript
var Document = require('schema/types').Document

var UserSchema = new Document({
  username: String,
  password: String,
  age: {
      type: Number,
      min: 13
  }
})

var user = UserSchema.cast({username: 'foo', password: 'bar', age: '11' }) // returns {username: 'foo', password: 'bar', age: 11}
UserSchema.validate(function(errors) {
  console.log(errors.age) // TypeError: `age` must be greater than 13
})

// Models are not a part of schematic but you they're very easily to implement via the `cast(ctor, parent, target)` function
function User(obj) {
  UserSchema.cast(obj, null, this)
}
// You can even implement `cast` and `validate` functions so your models will work with your schemas as first class-citizens
User.cast = UserSchema.cast.bind(UserSchema)
User.validate = UserSchema.validate.bind(UserSchema)
// You can also use the short-hand method of creating a `schema` property instead of defining cast/validate functions
User.schema = UserSchema

// Don't want to dirty up your models with these properties? No problem! Just add a type-inferer middleware
UserSchema.use(function (type, options) {
  if (type === User) return UserSchema
})

// Now you can use your User model directly in schematic (and you can use any constructor you want, we just need a cast function)
var BlogSchema = new Document({
  title: String,
  body: String,
  author: User,
  comments: [{
    text: String,
    author: User
  }]
})

// You can implment your find/save/delete functions on your model prototype.
// Schematic leaves such matters to higher level libraries

```



## License

  MIT
