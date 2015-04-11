/* global describe, it ,before */
var assert = require('chai').assert
  , schematic = require('../index')
  , StringType = schematic.type('string')
  , DocumentType = schematic.type('document')

describe('Document Type', function() {
  it("should cast child properties", function() {
    var x = new DocumentType({schema: {foo: String}});
    var y = x.cast({foo: 1});
    assert.equal(typeof y.foo, 'string', 'must cast child properties');
    assert.equal(y.foo, '1');
    
  })
  describe('Type Inference', function() {
    it('should infer schema', function() {
      var type = schematic.create({foo: String});
      assert.instanceOf(type, DocumentType, 'from document literal')
      assert.instanceOf(type.tree.foo, StringType, 'item type')
    })

    it('should ignore explicit schematic with a `type` property', function(){
      var type = schematic.create({type: {type: String}})
      assert.instanceOf(type.tree.type, StringType)
    })


  })
})
