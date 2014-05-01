var assert = require('chai').assert;
var types = require('../');
var string = types.get('string');

describe('String', function() {
  it('should infer type', function(){
    assert.instanceOf(types.infer(String), string);
  })
  describe("#cast(value)", function(){
    it('should cast types to a string', function() {
      var schema = new string();
      var result = schema.cast(1);
      assert.equal(result, "1");
      assert.equal(typeof result, "string");
    })
    it('should allow null/undefined values by default', function() {
      var schema = new string();
      var result = schema.cast(undefined);
      assert.equal(result, undefined);
      assert.equal(typeof result, 'undefined');
    })
  })
  describe("#validate", function() {
    it('should validate required', function(next) {
      var schema = new string({ required: true });
      schema.validate(null, function(errors) {
        try{
        assert.ok(errors);
        assert.equal(errors.errors[0].rule, 'required');
        next();
        } catch(err) {next(err)}
      })
    })
    it("should validate minimum", function(next) {
      var schema =  new string({min: 5});
      schema.validate("foo", function(errors) {
        try{
        assert.ok(errors);
        assert.equal(errors.errors[0].rule, 'min');
        next();
        }catch(err) {next(err)}
      })
    })
    it("should validate maximum", function(next) {
      var schema =  new string({max: 1});
      schema.validate("foo", function(errors) {
        try{
        assert.ok(errors);
        assert.equal(errors.errors[0].rule, 'max');
        next();
        }catch(err) {next(err);}
      })
    })
    it('should validate enum', function(next) {
      var schema = new string({enum: ['foo', 'bar']});
      var error = undefined;
      schema.validate('foo', function (errors) {
        try { assert.notOk(errors);
          schema.validate('qux', function (errors) {
            try { 
              assert.ok(errors);
              assert.equal(errors.errors[0].rule, 'enum');
              next();
            }catch(err) {next(err)}
          })
        } catch (err) { next(err)
        }
      })
    })
  })
})
