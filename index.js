var Schema = require('./lib/schema')
Schema.type('String', require('./types/String'));
Schema.type('Number', require('./types/number'));
Schema.type('Date', require('./types/date'));
Schema.type('Mixed', require('./types/mixed'));
Schema.type('Array', require('./types/array'));
Schema.type('Document', require('./types/document'));
Schema.get('types').use(require('./lib/middleware'));
module.exports = require('./types/document')

