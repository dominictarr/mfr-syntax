var tape = require('tape')
var eval = require('../interpreter')
var decode = require('../').decode

//just define these wrappers so I don't have to type out verbose ASTs
function pipe() {
  return {name: 'pipe', value: [].slice.call(arguments)}
}

function get (k) {
  return {name: 'get', value: [k]}
}

function object (obj) {
  var a = []
  for(var k in obj) {
    a.push(k); a.push(obj[k])
  }
  return {name: 'object', value: a}
}

function parent (n) {
  return {name: 'parent', value: [n]}
}

function gt (v) {
  return {name: 'gt', value: [v]}
}

function eq (v) {
  return {name: 'eq', value: [v]}
}

function filter(v) {
  return {name: 'filter', value: [v]}
}

function map(v) {
  return {name: 'map', value: [v]}
}

function iftt (test, then, that) {
  return {name: 'if', value: [test, then, that]}
}

function add (v) {
  return {name: 'add', value: [v]}
}

function reduce (op, initial) {
  return {name: 'reduce', value: [op, initial]}
}

function set(key, value, defaults) {
  return {name: 'set', value: [key, value]}
}

var value = {
  easy: true,
  foo: {
    bar: false,
    baz: 1,
    qux: 3
  },
  fop: -1,
  more: [1,2,3]
}

function each(a, iter) {
  if('string' == typeof a) return iter(a)
  for(var i = 0; i < a.length; i++)
    var v = iter(a[i])
  return v
}

tape('simple', function (t) {
  t.equal(eval(value, get('easy')), true)
  t.equal(eval(value, pipe(get('easy'))), true)
  t.equal(eval(value, pipe(get('foo'), get('bar'))), false)

  function AST(src, expected) {
    return each(src, function (src) {
      console.log('interpret:', src)
      var actual = decode(src)

      t.deepEqual(actual, expected)
      t.deepEqual(JSON.stringify(actual), JSON.stringify(expected))
      return actual
    })
  }

  t.deepEqual(eval(value,
    AST([
      'foo.{bar:bar,baqq:baz.parent(0)}', //TODO nice syntax for parent, and object to same key
      'foo.{bar,baqq:baz.parent(0)}', //TODO nice syntax for parent, and object to same key
    ],
      pipe(
        get('foo'),
        object({
          bar:get('bar'),
          baqq: pipe(
            get('baz'),
            parent(0)
          )
          })
        )
      )
    ), {bar: false, baqq: 1})

  t.deepEqual(eval(value,
    AST('foo.{bar:bar,baqq:baz.parent(1).qux}',
    pipe(
      get('foo'),
      object({
        bar:get('bar'),
        baqq: pipe(
          get('baz'),
          parent(1),
          get('qux')
        )
        })
      )
    )), {bar: false, baqq: 3})

  t.deepEqual(eval(value,
    AST('foo.{bar:bar,baqq:baz.parent(2).fop}',
    pipe(
      get('foo'),
      object({
        bar:get('bar'),
        baqq: pipe(
          get('baz'),
          parent(2),
          get('fop')
        )
        })
      )
    )), {bar: false, baqq: -1})


  t.equal(eval(value, pipe(get('fop'), gt(0))), false)

//  t.equal(eval(value, pipe(get('more'), all(eq())

  t.deepEqual(eval(value,
    AST('{fooQux:foo.qux,equal:foo.qux.eq(parent(2).more.get(2))}',
    object({
      fooQux: pipe(get('foo'), get('qux')),
      equal: pipe(get('foo'), get('qux'), eq(pipe(parent(2), get('more'), get(2))))
   })
  )),
    {fooQux: 3, equal: true }
  )

  // "{fooQux: foo.qux, equal: foo.qux.eq(.more[2])}"

  /*
    source("log").filter(value.content.{type: eq("post"), root: is("undefined")})
    .map({
      key, value,
      timestamp: if(value.timestamp.gt(0), value.timestamp.max(timestamp), timestamp),
      replies: source("log").filter(value.content.root.eq(..key))
    })
  */

  t.deepEqual(eval(value,
    pipe(get('more'), filter(eq(2)))
  ), [2])

  t.end()
})

var value2 = [
  {foo: true,  bar: 1, baz: -1},
  {foo: false, bar: 2, baz: -2},
  {foo: true,  bar: 3, baz: -3},
  {foo: true,  bar: 4, baz: -4},
  {foo: false, bar: 5, baz: -5},
  {foo: false, bar: 6, baz: -6},
]

tape('interesting', function (t) {

  t.deepEqual(eval(value2,
    filter(pipe(get('foo'), eq(true)))
  ), [
      value2[0],
      value2[2],
      value2[3],
  ])

  //map(foo.eq(true) ? bar : baz)
  //map(if(foo.eq(true), bar, baz))

  t.deepEqual(eval(value2,
    map(iftt(pipe(get('foo'), eq(true)), get('bar'), get('baz')))
  ), [
    1, -2, 3, 4, -5, -6
  ])

  t.end()
})

tape('reduce', function (t) {
  // reduce(bar.add(0))
  // reduce(bar.add())
  // reduce(.add(..), 0)
  t.equal(eval(value2,
    reduce(add( pipe(parent(1), get('bar')) ), 0)
  ),
    1+2+3+4+5+6
  )
  t.end()
})

/*
//add edge from a node already in the graph to new edge
//gaurantees a connected graph.
var edges = []
for(var i = 0; i < 10; i++)
  edges.push({from: ~~(Math.random()*i), to: i})

for(var i = 0; i < 20; i++)
  edges.push({from: ~~(Math.random()*10), to: ~~(Math.random()*10)})

console.log(edges)
*/

//actually, copy the output in, so that tests are deterministic
var edges = [ { from: 0, to: 0 },
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 2, to: 3 },
  { from: 1, to: 4 },
  { from: 4, to: 5 },
  { from: 3, to: 6 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 5, to: 9 },
  { from: 4, to: 4 },
  { from: 6, to: 3 },
  { from: 1, to: 0 },
  { from: 7, to: 0 },
  { from: 8, to: 3 },
  { from: 8, to: 5 },
  { from: 2, to: 1 },
  { from: 0, to: 1 },
  { from: 6, to: 4 },
  { from: 3, to: 0 },
  { from: 9, to: 1 },
  { from: 7, to: 3 },
  { from: 3, to: 9 },
  { from: 4, to: 5 },
  { from: 8, to: 1 },
  { from: 0, to: 2 },
  { from: 7, to: 2 },
  { from: 6, to: 1 },
  { from: 7, to: 4 },
  { from: 5, to: 5 }
]

tape('reduce graph', function (t) {
  var ast = pipe(
      filter(pipe(get('from'), eq(0))),
      reduce(set(pipe(parent(1), get('to')), true), object())
    )
  console.log(JSON.stringify(ast))
  t.deepEqual(eval(edges, ast), {0: true, 1: true, 2: true})

  var ast2 = reduce(
      set(
        pipe(parent(1), get('from')), //key
        set(pipe(parent(1), get('to')), true) //value
      )
    )

  // reduce([.from,.to]=true, {})

  /*
    map(mrts=value.timestamp.gt(0) ? value.timestamp.min(timestamp) : value.timestamp)

    reduce(set(.value.author, set(.value.content.contact, .value.content.following)), {})
    reduce([.value.author]=[.value.content.contact]=.value.content.following, {})
  */

//  set([.from, .to], .value

  var o = {}
  edges.forEach(e => (o[e.from] = o[e.from] || {})[e.to] = true )

  console.log(JSON.stringify(ast))
  t.deepEqual(
    eval(edges, ast2),
    { '0': { '0': true, '1': true, '2': true },
      '1': { '0': true, '4': true },
      '2': { '1': true, '3': true },
      '3': { '0': true, '6': true, '9': true },
      '4': { '4': true, '5': true },
      '5': { '5': true, '7': true, '9': true },
      '6': { '1': true, '3': true, '4': true, '8': true },
      '7': { '0': true, '2': true, '3': true, '4': true },
      '8': { '1': true, '3': true, '5': true },
      '9': { '1': true }
    }
  )

  t.end()
})




