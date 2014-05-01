// Default schema setup for ease of use
// Should cover most use-cases unless you need to change the default types

var TypeRegistry = require('./lib/registry')
var types = new TypeRegistry();
types.define('String', require('./types/string'));
types.define('Number', require('./types/number'));
types.define('Date', require('./types/date'));
types.define('Mixed', require('./types/mixed'));
types.define('Array', require('./types/array'));
types.define('Document', require('./types/document'));

types.use('array');
types.use('document');
//types.use('string');
module.exports  = types;

