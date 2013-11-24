/* global describe, it, before */
var assert = require('chai').assert
  , Schema = require('../lib/schema')
  , Embedded = require('../types/embedded')
  , Document = require('../types/document')
  , StringType = require('../types/string')
  , type = require('../lib/type-container.js')()

describe('Embedded Type', function() {
  before(function() {
    type('Document', Document)
    type('String', StringType)
    type('Embedded', Embedded)

    Document.type('String', StringType)
    Document.type('Embedded', Embedded)
    Document.type('Document', Document)
  })

  it('should embed schema types', function(){
    var User = new Document({
      username: {type: 'String'}
    })
    var Blog = new Document({
      title: {type: 'String'},
      author: User
    })
    assert.instanceOf(Blog.attr('author'), Embedded, 'embedded type')
    assert.strictEqual(Blog.attr('author').get('schema'), User, 'embedded schema type')
    assert.instanceOf(Blog.attr('title'), StringType, 'string type (not embedded)')
  })
  it('should embed cast functions', function() {
    var Cat = new Document({
      favourite_phrase: function(value) { // always meow!
        return 'meow'
      }
    })
    assert.instanceOf(Cat.attr('favourite_phrase'), Embedded, 'cast function type')
    assert.equal('meow', Cat.cast({favourite_phrase: 'not meow'}).favourite_phrase, 'cast value')
  })
})
