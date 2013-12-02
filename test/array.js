/* global describe, it ,before */
var assert = require('chai').assert
  , TypeContainer = require('../lib/type-container')
  , ArrayType = require('../types/array')
  , middleware = require('../lib/middleware').array

describe('Array Type', function() {
  var tc;
  before(function() {
    tc = TypeContainer()
    tc.type('Array', ArrayType)
    tc.use(middleware)
  })
  describe('Type Inference', function() {
    it('should infer item type', function() {
      var type = tc.infer([String])
      assert.instanceOf(type, ArrayType, 'from array literal')
      assert.strictEqual(type.get('items'), String, 'item type')
    })
  })
})
