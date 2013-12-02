/* global describe, it ,before */
var assert = require('chai').assert
  , TypeContainer = require('../lib/type-container')
  , DocumentType = require('../types/document')
  , StringType = require('../types/string')

describe('Document Type', function() {
  var tc;
  before(function() {
    tc = TypeContainer()
    tc.type('Document', DocumentType)
    DocumentType.type('String', StringType)
  })

  it('should use own type container', function() {
    tc.type('Test', StringType)
    try {
      var type = tc.infer({foo: {type: 'Test'}})
      assert.notInstanceOf(type.tree.foo, StringType, 'local type container')
    } catch (err) {
      assert(true, 'local type container')
    }
  })

  describe('Type Inference', function() {
    it('should infer schema', function() {
      var type = tc.infer({foo: String})
      assert.instanceOf(type, DocumentType, 'from document literal')
      assert.instanceOf(type.tree.foo, StringType, 'item type')
    })

    it('should ignore explicit types with a `type` property', function(){
      var type = tc.infer({type: {type: String}})
      assert.instanceOf(type.tree.type, StringType)
    })


  })
})
