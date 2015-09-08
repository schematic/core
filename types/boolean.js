var Schema = require('../lib/schema');

exports = module.exports =
Schema
  .extend(null, 'Boolean')
  .check(check)
  .cast(cast)
  
function check(value) {
  return value === true || value === false;
}

function cast(value) {
  if (null === value || undefined === value) return value;
  return !! value;
}
