// Default schema setup for ease of use
// Should cover most use-cases unless you need to change the default types

var Schematic = require('./lib/schematic')
var schematic = new Schematic();
schematic.define('String', require('./types/string'));
schematic.define('Number', require('./types/number'));
schematic.define('Date', require('./types/date'));
schematic.define('Mixed', require('./types/mixed'));
schematic.define('Array', require('./types/array'));
schematic.define('Document', require('./types/document'));

// Middleware for array literals ([String])
schematic.use('array');
// Middleware for parsing documents ({foo: String})
schematic.use('document');
module.exports  = schematic;

