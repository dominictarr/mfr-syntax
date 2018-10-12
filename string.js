// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "string$ebnf$1", "symbols": []},
    {"name": "string$ebnf$1$subexpression$1", "symbols": [/[^"\] | "\\" ["\bfnrtb]/]},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1", "string$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string", "symbols": [{"literal":"\""}, "string$ebnf$1", {"literal":"\""}]},
    {"name": "special", "symbols": [{"literal":"\""}]}
]
  , ParserStart: "string"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
