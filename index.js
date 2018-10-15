var nearley = require('nearley')
var grammar = nearley.Grammar.fromCompiled(require('./mfr'))

function parse (string, unambigious) {
  var parser = new nearley.Parser(grammar)
  parser.feed(string)
  var a = parser.results
  if(a.length  === 0) throw new Error('unexpected end')
  if(unambigious && a.length > 1)
    throw new Error('ambigious parse:'+JSON.stringify(a))
  return a[0][0]
}

exports.decode = function (str, unambigious) {
  return parse(str, unambigious)
}

exports.encode = function () {
}




