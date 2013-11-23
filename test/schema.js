/*global describe, before, it */
var assert = require('chai').assert
  , Schema = require('../lib/schema')

describe('Schema', function() {
  var schema;
  before(function() {
    schema = new Schema()
  })

  describe(".cast", function() {
    it('should return constructor', function() {
      assert.strictEqual(Schema, Schema.cast(function() {}))
    })
  })

  describe(".rule", function() {
    it('should return constructor', function() {
      assert.strictEqual(Schema, Schema.rule('foo', function(){}))
    })
  })

  describe(".validate", function() {
    it('should return constructor', function() {
      assert.strictEqual(Schema, Schema.validate(function(){}))
    })
  })

})
