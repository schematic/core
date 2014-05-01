/* global describe, it ,before, beforeEach */
var assert        = require('chai').assert
  , TestContainer = require('../lib/type-container.js')
  , NumberType    = require('../types/number.js')
  , tc            = null

describe('TestContainer', function() {
  before(function() {
    tc = TestContainer()
    tc.type('Number', NumberType)
  })
  it('should register types by name', function() {
    assert.strictEqual(tc.type('Number'), NumberType, 'type name registered')
    assert.strictEqual(tc.type('number'), NumberType, 'lookup is case-insensitive')
  })

  describe('#infer', function() {
    before(function() {
      tc.infer('Number', NumberType)
    })

    it('should infer type from constructor', function(){
      assert.instanceOf(tc.infer(Number), NumberType)
    })
  })
})
