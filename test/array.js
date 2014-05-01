/* global describe, it ,before */
var assert = require('chai').assert
  , types = require('../')
  , ArrayType = types.get('array')

describe('Array Type', function() {
  it('should infer item type', function() {
    var type = types.infer([String])
    assert.instanceOf(type, ArrayType, 'from array literal')
    assert.instanceOf(type.get('items'), types.get('string'), 'item type')
  })
  it('should validate children', function(next) {
    var type = types.infer([{type: String, min: 5}]);
    assert.instanceOf(type.get('items'), types.get('string'))
    assert.equal(type.settings.items.settings.min, 5);
    type.validate(['foo'], function(errors) {
      try {
        assert.ok(errors);
        next();
      } catch (err) { next(err) }
    })
  })
})
