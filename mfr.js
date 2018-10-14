// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "expression$subexpression$1", "symbols": ["value"]},
    {"name": "expression$subexpression$1", "symbols": ["name"]},
    {"name": "expression$subexpression$1", "symbols": ["pipe"]},
    {"name": "expression$subexpression$1", "symbols": ["object"]},
    {"name": "expression$subexpression$1", "symbols": ["call"]},
    {"name": "expression", "symbols": ["expression$subexpression$1"], "postprocess": (d) => d[0]},
    {"name": "non_pipe$subexpression$1", "symbols": ["name"]},
    {"name": "non_pipe$subexpression$1", "symbols": ["object"]},
    {"name": "non_pipe$subexpression$1", "symbols": ["call"]},
    {"name": "non_pipe", "symbols": ["non_pipe$subexpression$1"], "postprocess":  (d, a, b) => {
          if(d[0][0] == null) throw new Error('null in non-pipe')
          return d[0][0]
        } },
    {"name": "pipe$ebnf$1", "symbols": [{"literal":"."}]},
    {"name": "pipe$ebnf$1", "symbols": ["pipe$ebnf$1", {"literal":"."}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "pipe", "symbols": ["pipe$ebnf$1"], "postprocess": d => ({name: 'parent', value: [d[0].length]})},
    {"name": "pipe", "symbols": ["non_pipe"], "postprocess": d => d[0]},
    {"name": "pipe$ebnf$2", "symbols": [{"literal":"."}]},
    {"name": "pipe$ebnf$2", "symbols": ["pipe$ebnf$2", {"literal":"."}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "pipe", "symbols": ["pipe$ebnf$2", "non_pipe"], "postprocess": d => ({name: 'pipe', value: [{name: 'parent', value: [d[0].length] }, d[1]] })},
    {"name": "pipe$ebnf$3", "symbols": []},
    {"name": "pipe$ebnf$3", "symbols": ["pipe$ebnf$3", {"literal":"."}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "pipe$ebnf$4$subexpression$1", "symbols": [{"literal":"."}, "non_pipe"]},
    {"name": "pipe$ebnf$4", "symbols": ["pipe$ebnf$4$subexpression$1"]},
    {"name": "pipe$ebnf$4$subexpression$2", "symbols": [{"literal":"."}, "non_pipe"]},
    {"name": "pipe$ebnf$4", "symbols": ["pipe$ebnf$4", "pipe$ebnf$4$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "pipe", "symbols": ["pipe$ebnf$3", "non_pipe", "pipe$ebnf$4"], "postprocess": 
        (d) => {
          return {
            name: 'pipe', value: (d[0].length ? [{name: 'parent', value: [d[0].length]}] : [])
              .concat([d[1]].concat(d[2].map(e => e[1])))
          }
        }
            },
    {"name": "object_pair", "symbols": ["literal_name"], "postprocess": ([literal_name]) => [literal_name, {name: 'id', value: []}]},
    {"name": "object_pair", "symbols": ["literal_name", {"literal":":"}, "expression"], "postprocess": ([literal_name, _, expression]) => expression ? [literal_name, expression[0]] : []},
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
    {"name": "object", "symbols": ["object$macrocall$1"], "postprocess": d => ({name: 'object', value: d[0].reduce( (a, b) => a.concat(b), [] )})},
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
    {"name": "call", "symbols": ["literal_name", "call$macrocall$1"], "postprocess": ([literal_name, value]) => ({name: literal_name, value: value.map(e => e[0]) })},
    {"name": "boolean$subexpression$1$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "boolean$subexpression$1", "symbols": ["boolean$subexpression$1$string$1"]},
    {"name": "boolean$subexpression$1$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "boolean$subexpression$1", "symbols": ["boolean$subexpression$1$string$2"]},
    {"name": "boolean", "symbols": ["boolean$subexpression$1"], "postprocess":  ([d]) => d[0] === 'true' //
        //d[0].join('') === 'true'
        },
    {"name": "name$ebnf$1", "symbols": []},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-zA-Z_0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "name", "symbols": [/[a-zA-Z_]/, "name$ebnf$1"], "postprocess":  (d, _, reject) => {
          var v = d[0]+d[1].join('')
          // ugly hack, not sure how to make nearley pick true only as value
          if(v === 'true' || v === 'false' || v ==='null') return reject
          return {name: 'get', value: [v]}
        }
        },
    {"name": "literal_name$ebnf$1", "symbols": []},
    {"name": "literal_name$ebnf$1", "symbols": ["literal_name$ebnf$1", /[a-zA-Z_0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "literal_name", "symbols": [/[a-zA-Z_]/, "literal_name$ebnf$1"], "postprocess":  d => {
          var v = d[0]+d[1].join('')
          return v
        }
        },
    {"name": "value$subexpression$1", "symbols": ["boolean"]},
    {"name": "value$subexpression$1", "symbols": ["number"]},
    {"name": "value$subexpression$1", "symbols": ["string"]},
    {"name": "value$subexpression$1", "symbols": ["nul"]},
    {"name": "value", "symbols": ["value$subexpression$1"], "postprocess":  d => {
          if(d[0][0] == null) throw new Error('null in value')
          return d[0][0]
        } },
    {"name": "nul$string$1", "symbols": [{"literal":"n"}, {"literal":"u"}, {"literal":"l"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "nul", "symbols": ["nul$string$1"], "postprocess": d => ({name: 'null', value: null})},
    {"name": "number", "symbols": [{"literal":"0"}], "postprocess": ([d]) => +d},
    {"name": "number$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$string$1", "symbols": [{"literal":"0"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "number$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$2", "symbols": ["number$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1", "number$string$1", "number$ebnf$2"], "postprocess": ([neg, d, r]) => (neg ? -1 : 1)*+(d+r.join(''))},
    {"name": "number$ebnf$3", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$subexpression$1$ebnf$1", "symbols": []},
    {"name": "number$subexpression$1$ebnf$1", "symbols": ["number$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$subexpression$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["number$subexpression$1$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number$subexpression$1$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "number$subexpression$1$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "number$subexpression$1$ebnf$2", "symbols": ["number$subexpression$1$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "number$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$subexpression$1", "symbols": [/[1-9]/, "number$subexpression$1$ebnf$1", "number$subexpression$1$ebnf$2"]},
    {"name": "number", "symbols": ["number$ebnf$3", "number$subexpression$1"], "postprocess": ([neg, [leading, rest, decimal]]) => (neg ? -1 : 1)*+((leading+rest.join('')) + (decimal ? '.' + decimal[1].join('') :''))},
    {"name": "string$ebnf$1", "symbols": []},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1", /[^"]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string", "symbols": [{"literal":"\""}, "string$ebnf$1", {"literal":"\""}], "postprocess": (d) => d[1].join('')}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
