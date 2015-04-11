global.describe = function(str, fn) {
  fn()
}

global.it = describe
global.before = function(fn){
  fn()
}
global.before.only = global.before
process.argv[2] = 'document'
console.log('Loading test:', process.argv[2])
require('./test/' + process.argv[2])
