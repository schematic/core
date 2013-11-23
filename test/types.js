/* global describe, it ,before, beforeEach */
var assert        = require('chai').assert
  , TestContainer = require('../lib/type-container.js')
  , NumberType    = require('../types/number.js')
  , tc            = null

describe('TestContainer', function() {
  before(function() {
    tc = TestContainer()
    tc('Number', NumberType)
  })

  it('should register types by name', function() {
    assert.strictEqual(tc('Number'), NumberType, 'type name registered')
    assert.strictEqual(tc('number'), NumberType, 'lookup is case-insensitive')
    assert.isObject(tc.Types, 'has a mongoose-style type map')
    assert.strictEqual(tc.Types.Number, NumberType, 'type saved to map in type-case')
  })

  describe('#infer', function() {
    before(function() {
      tc('Number', NumberType)
    })

    it('should infer type from constructor', function(){
      assert.instanceOf(tc.infer(Number), NumberType)
    })
  })
})
