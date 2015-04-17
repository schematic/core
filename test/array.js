/* global describe, it ,before */
var assert = require('chai').assert
var schematic = require('../')
var ArrayType = schematic.type('array')
var Mixed = require('../types/mixed')

describe('Array Type', function() {
  it('should infer item type', function() {
    var type = schematic.create([String])

  })
  it('should infer item type via explicit definition', function () {
    var type = schematic.create({type: [String]});
    assert.instanceOf(type, ArrayType, 'from array literal')
    assert.instanceOf(type.get('items'), schematic.type('string'), 'item type')
  })
  it('should use Mixed type for empty arrays', function () {
    var type = schematic.create([]);
    assert.instanceOf(type, ArrayType, 'from empty array');
    assert.instanceOf(type.get('items'), Mixed, 'mixed type');
  })
  it('should validate children', function(next) {
    var type = schematic.create([{type: String, min: 5}]);
    assert.instanceOf(type.get('items'), schematic.type('string'))
    assert.equal(type.settings.items.settings.min, 5);
    type.validate(['foo'], function(errors) {
      try {
        assert.ok(errors);
        next();
      } catch (err) { next(err) }
    })
  })
})
