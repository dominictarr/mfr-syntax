// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["array"], "postprocess": d=> d[0]},
    {"name": "value$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "value$ebnf$1", "symbols": ["value$ebnf$1", /[a-zA-Z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "value", "symbols": ["value$ebnf$1"], "postprocess": d => d[0].join('')},
    {"name": "expression", "symbols": ["array"], "postprocess": d=> d[0]},
    {"name": "expression", "symbols": ["value"], "postprocess": d=> d[0]},
    {"name": "array$macrocall$2", "symbols": ["expression"]},
    {"name": "array$macrocall$3", "symbols": [{"literal":","}]},
    {"name": "array$macrocall$1$ebnf$1", "symbols": ["array$macrocall$2"], "postprocess": id},
    {"name": "array$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array$macrocall$1", "symbols": ["array$macrocall$1$ebnf$1"], "postprocess": d => d[0] ? [d[0][0]] : []},
    {"name": "array$macrocall$1$ebnf$2$subexpression$1", "symbols": ["array$macrocall$3", "array$macrocall$2"]},
    {"name": "array$macrocall$1$ebnf$2", "symbols": ["array$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "array$macrocall$1$ebnf$2$subexpression$2", "symbols": ["array$macrocall$3", "array$macrocall$2"]},
    {"name": "array$macrocall$1$ebnf$2", "symbols": ["array$macrocall$1$ebnf$2", "array$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array$macrocall$1", "symbols": ["array$macrocall$2", "array$macrocall$1$ebnf$2"], "postprocess":  d => [d[0][0]].concat(d[1].map(e => e[1][0]))
          },
    {"name": "array", "symbols": [{"literal":"["}, "array$macrocall$1", {"literal":"]"}], "postprocess": value => value[1]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
