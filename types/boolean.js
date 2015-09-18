var Schema = require('../lib/schema');

exports = module.exports =
Schema
  .extend(null, 'Boolean')
  .check(check)
  .cast(cast);


exports.plugin = function() {
  return function (types) {
    types.on('infer', middleware);
  }
}

function middleware(info) {
  if (info.type === Boolean)
    info.type = exports;
}
function check(value) {
  return value === true || value === false;
}


function cast(value) {
  if (null === value || undefined === value) return value;
  return !!value;
}
