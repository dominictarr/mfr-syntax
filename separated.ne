main -> array  {% d=> d[0] %}

separated[V, X]
  -> $V:?              {% d => d[0] ? [d[0][0]] : [] %}
  | $V ( $X $V ):+
                       {% d => [d[0][0]].concat(d[1].map(e => e[1][0])) %}

value -> [a-zA-Z]:+ {% d => d[0].join('') %}

expression -> array  {% d=> d[0] %}
  | value {% d=> d[0] %}

array -> "[" separated[expression, ","] "]" {% value => value[1] %}















