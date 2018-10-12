expression -> path | object | call | value {% (d) => d[0] %}

separated[V, X] ->
    $V:?              {% d => d[0] ? [d[0][0]] : [] %}
  | $V ( $X $V ):+
                       {% d => [d[0][0]].concat(d[1].map(e => e[1][0])) %}
path ->
  separated[name, "."] {% d => ({name:'path', args: d[0]}) %}

open_close[OP, V, CL]
  -> $OP $V $CL        {% d => d[1][0] %}


object_pair -> name ":" expression
  {% ([name, _, expression]) => expression ? [name, expression[0]] : [] %}

object ->
    open_close["{", separated[object_pair, ","], "}"]

  {% d => ({name: 'object', args: d[0].reduce( (a, b) => a.concat(b) )}) %}

call
  -> name open_close["(", separated[expression, ","],")"]

  {% ([name, value]) => ({name: name, args: value.map(e => e[0]) }) %}

name -> [a-zA-Z_] [a-zA-Z_0-9]:*     {% d => d[0]+d[1].join('') %}


_ -> [\s]:*                        {% d => null %}

value -> boolean | number | string | null {% ([d]) => d %}

boolean -> "true" | "false"        {% d => d %}

null -> "null"                     {% d => 'null' %}



number
  -> "0"                           {% ([d]) => +d %}
  | [1-9] [0-9]:*                  {% ([leading, rest]) => +(leading+rest.join('')) %}

#{% id %}
# weird, disable

string -> "\"" [^"]:* "\""        {% (d) => d[1].join('') %}













