expression -> (value | name | pipe | object | call) {% (d) => d[0] %}

non_pipe -> ( name | object | call ) {% (d, a, b) => {
  if(d[0][0] == null) throw new Error('null in non-pipe')
  return d[0][0]
} %}

separated[V, X] ->
    $V:?              {% d => d[0] ? [d[0][0]] : [] %}
  | $V ( $X $V ):+
                       {% d => [d[0][0]].concat(d[1].map(e => e[1][0])) %}

separated1[V, X] ->
    $V ( $X $V ):+
                       {% d => [d[0][0]].concat(d[1].map(e => e[1][0])) %}

pipe ->
  ".":+ {% d => ({name: 'parent', value: [d[0].length]}) %}
  | non_pipe {% d => d[0] %}
  | ".":+ non_pipe {% d => ({name: 'pipe', value: [{name: 'parent', value: [d[0].length] }, d[1]] }) %}
  | ".":* non_pipe ("." non_pipe):+
    {%
      (d) => {
        return {
          name: 'pipe', value: (d[0].length ? [{name: 'parent', value: [d[0].length]}] : [])
            .concat([d[1]].concat(d[2].map(e => e[1])))
        }
      }
    %}

open_close[OP, V, CL]
  -> $OP $V $CL        {% d => d[1][0] %}

object_pair
  -> literal_name
    {% ([literal_name]) => [literal_name, {name: 'id', value: []}] %}

  | literal_name ":" expression
    {% ([literal_name, _, expression]) => expression ? [literal_name, expression[0]] : [] %}

object ->
    open_close["{", separated[object_pair, ","], "}"]

  {% d => ({name: 'object', value: d[0].reduce( (a, b) => a.concat(b), [] )}) %}

call
  -> literal_name open_close["(", separated[expression, ","],")"]

  {% ([literal_name, value]) => ({name: literal_name, value: value.map(e => e[0]) }) %}

boolean -> ("true" | "false")        {% ([d]) => d[0] === 'true' //
//d[0].join('') === 'true'
%}

name ->
    [a-zA-Z_] [a-zA-Z_0-9]:*

{% (d, _, reject) => {
    var v = d[0]+d[1].join('')
    // ugly hack, not sure how to make nearley pick true only as value
    if(v === 'true' || v === 'false' || v ==='null') return reject
    return {name: 'get', value: [v]}
  }
%}

literal_name -> [a-zA-Z_] [a-zA-Z_0-9]:*
{% d => {
    var v = d[0]+d[1].join('')
    return v
  }
%}

value -> (boolean | number | string | nul)
{% d => {
  if(d[0][0] == null) throw new Error('null in value')
  return d[0][0]
} %}


# null needs to be a literal, because nearley handles it specially (i think)
nul -> "null"                     {% d => ({name: 'null', value: null}) %}

#TODO better numbers!!!
number
  -> "0"                           {% ([d]) => +d %}
  | ([1-9] [0-9]:* ("." [0-9]:+):?)                  {% ([[leading, rest, decimal]]) => +((leading+rest.join('')) + (decimal ? '.' + decimal[1].join('') :'')) %}

#TODO fix strings to support full escapes
string -> "\"" [^"]:* "\""        {% (d) => d[1].join('') %}

