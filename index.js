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
schematic.define('Boolean', require('./types/boolean'));

// Middleware for array literals ([String])
schematic.use('array');
schematic.use('string');
schematic.use('date');
schematic.use('boolean');
schematic.use('number')
// Middleware for parsing documents ({foo: String})
schematic.use('document');

schematic.Schematic = Schematic;
module.exports  = schematic;

