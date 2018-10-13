expression -> (value | name | pipe | object | call) {% (d) => d[0] %}

non_pipe -> (value | name | object | call ) {% (d) => d[0][0] %}

separated[V, X] ->
    $V:?              {% d => d[0] ? [d[0][0]] : [] %}
  | $V ( $X $V ):+
                       {% d => [d[0][0]].concat(d[1].map(e => e[1][0])) %}

separated1[V, X] ->
    $V ( $X $V ):+
                       {% d => [d[0][0]].concat(d[1].map(e => e[1][0])) %}

pipe ->
  separated1[non_pipe, "."] {% d => ({name:'pipe', value: d[0]}) %}

#path ->
#  separated[name, "."] {% d => ({name:'path', value: d[0]}) %}

open_close[OP, V, CL]
  -> $OP $V $CL        {% d => d[1][0] %}

object_pair -> literal_name ":" expression
  {% ([literal_name, _, expression]) => expression ? [literal_name, expression[0]] : [] %}

object ->
    open_close["{", separated[object_pair, ","], "}"]

  {% d => ({name: 'object', value: d[0].reduce( (a, b) => a.concat(b) )}) %}

call
  -> literal_name open_close["(", separated[expression, ","],")"]

  {% ([literal_name, value]) => ({name: literal_name, value: value.map(e => e[0]) }) %}

name -> [a-zA-Z_] [a-zA-Z_0-9]:*     {% d => ({name: 'get', value: [d[0]+d[1].join('')]}) %}

literal_name -> [a-zA-Z_] [a-zA-Z_0-9]:*     {% d => d[0]+d[1].join('') %}


_ -> [\s]:*                        {% d => null %}

value -> (boolean | number | string | null) {% d => d[0][0] %}

boolean -> "true" | "false"        {% d => d === 'true' %}

# null needs to be a literal, because nearley handles it
null -> "null"                     {% d => ({name: 'null', value:null}) %}



number
  -> "0"                           {% ([d]) => +d %}
  | [1-9] [0-9]:*                  {% ([leading, rest]) => +(leading+rest.join('')) %}

#{% id %}
# weird, disable

string -> "\"" [^"]:* "\""        {% (d) => d[1].join('') %}

