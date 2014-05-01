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

// register middleware
var middleware = require('./lib/middleware');
// Should we include the enum middleware by default?
// Note: Caster middleware must come before object middleware
['object', 'array'].forEach(function(id) {
  types.use(middleware[id]);
});

module.exports  = types;

