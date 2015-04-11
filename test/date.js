/* global describe, it ,before */
var assert = require('chai').assert
  , schematic = require('../')
  , DateType = schematic.type('date')
  , Mixed = require('../types/mixed')

describe('Date Type', function() {
  var type;
  beforeEach(function () { type = schematic.create(Date); });
  it('should infer type', function() {
    assert.instanceOf(type, DateType, 'from date ctor')
  })
  it('should cast from a timestamp', function (){
    var ts = Date.now();
    assert.instanceOf(type.cast(ts), Date);
  });
  it('should cast from string', function () {
    var date = new Date().toString();
    assert.instanceOf(type.cast(date), Date);
  })
  it('should throw on invalid date', function () {
    var err = false;
    try { type.cast('Foo Bar') } catch(e) { err = e; };
    assert.ok(err, 'throw on invalid date');
  })
  it('should validate required', function (done){
    type.set('required', true);
    type.validate(null, function (err) {
      if (err) done();
      else done(new Error('required validator did not throw'))
    });
  })
   it('should validate before', function (done) {
    var date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    type.set('before', date);
    type.validate(new Date(), function (err) {
      if (err) done();
      else done(new Error('before did not throw'))
    });
   });
  it('should validate after', function (done) {
    var date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    type.set('after', date);
    type.validate(new Date(), function (err) {
      if (err) done();
      else done(new Error('after did not throw'))
    });
  })
})
