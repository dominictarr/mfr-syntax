// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "pipe$macrocall$2", "symbols": ["expression"]},
    {"name": "pipe$macrocall$3", "symbols": [{"literal":"."}]},
    {"name": "pipe$macrocall$1$ebnf$1", "symbols": ["pipe$macrocall$2"], "postprocess": id},
    {"name": "pipe$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "pipe$macrocall$1", "symbols": ["pipe$macrocall$1$ebnf$1"], "postprocess": d => d[0] ? [d[0][0]] : []},
    {"name": "pipe$macrocall$1$ebnf$2$subexpression$1", "symbols": ["pipe$macrocall$3", "pipe$macrocall$2"]},
    {"name": "pipe$macrocall$1$ebnf$2", "symbols": ["pipe$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "pipe$macrocall$1$ebnf$2$subexpression$2", "symbols": ["pipe$macrocall$3", "pipe$macrocall$2"]},
    {"name": "pipe$macrocall$1$ebnf$2", "symbols": ["pipe$macrocall$1$ebnf$2", "pipe$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "pipe$macrocall$1", "symbols": ["pipe$macrocall$2", "pipe$macrocall$1$ebnf$2"], "postprocess": d => [d[0][0]].concat(d[1].map(e => e[1][0]))},
    {"name": "pipe", "symbols": ["pipe$macrocall$1"], "postprocess": d => ({name:'pipe', value: d[0]})},
    {"name": "expression", "symbols": ["object"]},
    {"name": "expression", "symbols": ["call"]},
    {"name": "expression", "symbols": ["name"], "postprocess": d => d[0]},
    {"name": "path$macrocall$2", "symbols": ["name"]},
    {"name": "path$macrocall$3", "symbols": [{"literal":"."}]},
    {"name": "path$macrocall$1$ebnf$1", "symbols": ["path$macrocall$2"], "postprocess": id},
    {"name": "path$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "path$macrocall$1", "symbols": ["path$macrocall$1$ebnf$1"], "postprocess": d => d[0] ? [d[0][0]] : []},
    {"name": "path$macrocall$1$ebnf$2$subexpression$1", "symbols": ["path$macrocall$3", "path$macrocall$2"]},
    {"name": "path$macrocall$1$ebnf$2", "symbols": ["path$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "path$macrocall$1$ebnf$2$subexpression$2", "symbols": ["path$macrocall$3", "path$macrocall$2"]},
    {"name": "path$macrocall$1$ebnf$2", "symbols": ["path$macrocall$1$ebnf$2", "path$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "path$macrocall$1", "symbols": ["path$macrocall$2", "path$macrocall$1$ebnf$2"], "postprocess": d => [d[0][0]].concat(d[1].map(e => e[1][0]))},
    {"name": "path", "symbols": ["path$macrocall$1"], "postprocess": d => ({name:'path', value: d[0]})},
    {"name": "object_pair", "symbols": ["name", {"literal":":"}, "expression"], "postprocess": ([name, _, expression]) => expression ? [name, expression[0]] : []},
    {"name": "object$macrocall$2", "symbols": [{"literal":"{"}]},
    {"name": "object$macrocall$3$macrocall$2", "symbols": ["object_pair"]},
    {"name": "object$macrocall$3$macrocall$3", "symbols": [{"literal":","}]},
    {"name": "object$macrocall$3$macrocall$1$ebnf$1", "symbols": ["object$macrocall$3$macrocall$2"], "postprocess": id},
    {"name": "object$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "object$macrocall$3$macrocall$1", "symbols": ["object$macrocall$3$macrocall$1$ebnf$1"], "postprocess": d => d[0] ? [d[0][0]] : []},
    {"name": "object$macrocall$3$macrocall$1$ebnf$2$subexpression$1", "symbols": ["object$macrocall$3$macrocall$3", "object$macrocall$3$macrocall$2"]},
    {"name": "object$macrocall$3$macrocall$1$ebnf$2", "symbols": ["object$macrocall$3$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "object$macrocall$3$macrocall$1$ebnf$2$subexpression$2", "symbols": ["object$macrocall$3$macrocall$3", "object$macrocall$3$macrocall$2"]},
    {"name": "object$macrocall$3$macrocall$1$ebnf$2", "symbols": ["object$macrocall$3$macrocall$1$ebnf$2", "object$macrocall$3$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "object$macrocall$3$macrocall$1", "symbols": ["object$macrocall$3$macrocall$2", "object$macrocall$3$macrocall$1$ebnf$2"], "postprocess": d => [d[0][0]].concat(d[1].map(e => e[1][0]))},
    {"name": "object$macrocall$3", "symbols": ["object$macrocall$3$macrocall$1"]},
    {"name": "object$macrocall$4", "symbols": [{"literal":"}"}]},
    {"name": "object$macrocall$1", "symbols": ["object$macrocall$2", "object$macrocall$3", "object$macrocall$4"], "postprocess": d => d[1][0]},
    {"name": "object", "symbols": ["object$macrocall$1"], "postprocess": d => ({name: 'object', value: d[0].reduce( (a, b) => a.concat(b) )})},
    {"name": "call$macrocall$2", "symbols": [{"literal":"("}]},
    {"name": "call$macrocall$3$macrocall$2", "symbols": ["expression"]},
    {"name": "call$macrocall$3$macrocall$3", "symbols": [{"literal":","}]},
    {"name": "call$macrocall$3$macrocall$1$ebnf$1", "symbols": ["call$macrocall$3$macrocall$2"], "postprocess": id},
    {"name": "call$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "call$macrocall$3$macrocall$1", "symbols": ["call$macrocall$3$macrocall$1$ebnf$1"], "postprocess": d => d[0] ? [d[0][0]] : []},
    {"name": "call$macrocall$3$macrocall$1$ebnf$2$subexpression$1", "symbols": ["call$macrocall$3$macrocall$3", "call$macrocall$3$macrocall$2"]},
    {"name": "call$macrocall$3$macrocall$1$ebnf$2", "symbols": ["call$macrocall$3$macrocall$1$ebnf$2$subexpression$1"]},
    {"name": "call$macrocall$3$macrocall$1$ebnf$2$subexpression$2", "symbols": ["call$macrocall$3$macrocall$3", "call$macrocall$3$macrocall$2"]},
    {"name": "call$macrocall$3$macrocall$1$ebnf$2", "symbols": ["call$macrocall$3$macrocall$1$ebnf$2", "call$macrocall$3$macrocall$1$ebnf$2$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "call$macrocall$3$macrocall$1", "symbols": ["call$macrocall$3$macrocall$2", "call$macrocall$3$macrocall$1$ebnf$2"], "postprocess": d => [d[0][0]].concat(d[1].map(e => e[1][0]))},
    {"name": "call$macrocall$3", "symbols": ["call$macrocall$3$macrocall$1"]},
    {"name": "call$macrocall$4", "symbols": [{"literal":")"}]},
    {"name": "call$macrocall$1", "symbols": ["call$macrocall$2", "call$macrocall$3", "call$macrocall$4"], "postprocess": d => d[1][0]},
    {"name": "call", "symbols": ["name", "call$macrocall$1"], "postprocess": ([name, value]) => ({name: name, args: value.map(e => e[0]) })},
    {"name": "name$ebnf$1", "symbols": []},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-zA-Z_0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "name", "symbols": [/[a-zA-Z_]/, "name$ebnf$1"], "postprocess": d => d[0]+d[1].join('')}
]
  , ParserStart: "pipe"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
