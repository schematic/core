var Schema = require('./types/document')

var schema = new Schema({schema: {
	title: String,
	ratings: [{type: Number, min: 5}]
}})

console.log(schema.tree.ratings.options.items)
var result = schema.cast({
	title: 'foo',
	ratings: [4]
})

