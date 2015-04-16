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
  it('should validate children', function () {
    var type = schematic.create({foo: {type: String, min: 5}});
    assert.instanceOf(type.get('schema').foo, StringType);
    assert.equal(type.get('schema').foo.get('min'), 5);

    type.validate({foo: 'bar'}, function (errors) {
      try {
        assert.ok(errors);
        next();
      } catch (err) { next(err); }
    })
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

    it('should allow explicit definition of schema', function () {
      var type = schematic.create({foo : {type: DocumentType, schema: {bar: String } } });
      assert.instanceOf(type.tree.foo, DocumentType);
      assert.instanceOf(type.tree.foo.tree.bar, StringType);
    })

    it('should allow implicit schema definition via explicit type property', function() {
      var type = schematic.create({ type: {foo: String}});
      assert.instanceOf(type, DocumentType);
      assert.instanceOf(type.tree.foo, StringType);
    })

  })
})
