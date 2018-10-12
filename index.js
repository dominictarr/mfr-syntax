var nearley = require('nearley')
var grammar = nearley.Grammar.fromCompiled(require('./mfr'))

function parse (string) {
  var parser = new nearley.Parser(grammar)
  parser.feed(string)
  var a = parser.results
  if(a.length  === 0) throw new Error('unexpected end')
  return a[0]
}

exports.decode = function (str) {
  return parse(str)
}

exports.encode = function () {
}




