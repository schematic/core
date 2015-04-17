var assert = require('chai').assert;
var schematic = require('../');
var StringSchema = schematic.type('string');

describe('String', function() {
  it('should infer type', function () {
    assert.instanceOf(schematic.create(String), StringSchema);
  })
  describe('#cast(value)', function () {
    it('should cast schematic to a string', function() {
      var schema = new StringSchema();
      var result = schema.cast(1);
      assert.equal(result, '1');
      assert.equal(typeof result, 'string');
    })
    it('should allow null/undefined values by default', function() {
      var schema = new StringSchema();
      var result = schema.cast(undefined);
      assert.equal(result, undefined);
      assert.equal(typeof result, 'undefined');
    })
  })
  describe('#validate', function() {
    it('should validate required', function(next) {
      var schema = new StringSchema({ required: true });
      schema.validate(null, function(errors) {
        try {
          assert.ok(errors);
          assert.equal(errors.errors[0].rule, 'required');
          next();
        } catch (err) {next(err)}
      })
    })
    it('should validate minimum', function(next) {
      var schema =  new StringSchema({min: 5});
      schema.validate('foo', function(errors) {
        try {
          assert.ok(errors);
          assert.equal(errors.errors[0].rule, 'min');
          next();
        }catch (err) {next(err)}
      })
    })
    it('should validate maximum', function(next) {
      var schema =  new StringSchema({max: 1});
      schema.validate('foo', function(errors) {
        try {
          assert.ok(errors);
          assert.equal(errors.errors[0].rule, 'max');
          next();
        }catch (err) {next(err);}
      })
    })
    it('should validate enum', function(next) {
      var schema = new StringSchema({enum: ['foo', 'bar']});
      var error;
      schema.validate('foo', function (errors) {
        try { assert.notOk(errors);
          schema.validate('qux', function (errors) {
            try {
              assert.ok(errors);
              assert.equal(errors.errors[0].rule, 'enum');
              next();
            } catch (err) {next(err)}
          })
        } catch (err) { next(err)
        }
      })
    })
  })
})
