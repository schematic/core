/* global describe, it ,before */
var assert = require('chai').assert
  , schematic = require('../')
  , Schema = require('../lib/schema')

describe('Schema', function() {
  it('should set default options', function() {
    Schema.set('foo', 'bar');
    var schema = new Schema();
    assert.equal(schema.get('foo'), 'bar')
  })
})
