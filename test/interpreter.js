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
  return {name: 'eq', value: [].slice.call(arguments)}
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
  return {name: 'add', value: [].slice.call(arguments)}
}

function reduce (op, initial) {
  return {name: 'reduce', value: [].slice.call(arguments)}
}

function set(key, value, defaults) {
  return {name: 'set', value: [key, value]}
}

function id() {
  return {name: 'id', value: []}
}

function input () {
  return {name: 'input', value: []}
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

function Test(t, value) {
  function AST(src, expected) {
    return each(src, function (src) {
      console.log('interpret:', src)
      var actual = decode(src)

      t.deepEqual(actual, expected)
      var a = JSON.stringify(actual), b = JSON.stringify(expected)
      if(a != b) {
        for(var i = 0; i < a.length; i++)
          if(a[i] != b[i]) {
            console.log(a.substring(0, i) + '*****<'+a.substring(i)+'>*****<'+b.substring(i)+'>*****')
            return actual
          }
      }
      return actual
    })
  }

  return function test(src, ast, expected) {
    t.deepEqual(eval(value, AST(src, ast)), expected)
  }

}

tape('simple', function (t) {
  var test = Test(t, value)

  t.equal(eval(value, pipe(input(), get('easy'))), true)
  t.equal(eval(value, pipe(input(), get('easy'))), true)
  t.equal(eval(value, pipe(input(), get('foo'), get('bar'))), false)

  test([
//      '.foo.{bar,baqq:..baz.parent(1).qux}',
      '.foo.{bar,baqq:..qux}',
    ],
    pipe(
      input(),
      get('foo'),
      object({
        bar:id(),
        baqq: pipe(
//          parent(1),
//          get('baz'),
          parent(1),
          get('qux')
        )
      })
    ),
    {bar: false, baqq: 3})

  //correct way to perform the above query
  test(
    '.foo.{bar,baqq:..qux}',
    pipe(
      input(),
      get('foo'),
      object({ bar:id(), baqq: pipe(parent(1), get('qux')) })
    ),
    {bar: false, baqq: 3}
  )

  test(
    '.foo.{bar,baqq:...fop}',
    pipe(
      input(),
      get('foo'),
      object({
        bar:id(),
        baqq: pipe(
          parent(2),
          get('fop')
        )
      })
    ),
    {bar: false, baqq: -1}
  )

  test(
    '.fop.gt(0)',
    pipe(input(), get('fop'), gt(0)),
    false
  )

  test(
    '.{fooQux:..foo.qux,equal:..foo.qux.eq(....more.get(2))}',
    pipe(input(), object({
      fooQux: pipe(parent(1), get('foo'), get('qux')),
      equal: pipe(parent(1), get('foo'), get('qux'), eq(pipe(parent(3), get('more'), get(2))))
   })),
    {fooQux: 3, equal: true }
  )

  test(
    '.{fooQux:..foo.qux,equal:eq(..more.get(2),..foo.qux)}',
    pipe(input(), object({
      fooQux: pipe(parent(1), get('foo'), get('qux')),
      equal: pipe(eq(pipe(parent(1), get('more'), get(2) ), pipe(parent(1), get('foo'), get('qux') )))
   })),
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

  test(
    '.more.filter(.eq(2))',
    pipe(input(), get('more'), filter(pipe(input(), eq(2)))),
    [2]
  )

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
  var test = Test(t, value2)
  test(
    '.filter(.foo.eq(true))',
    pipe(input(), filter(pipe(input(), get('foo'), eq(true)))),
    [
      value2[0],
      value2[2],
      value2[3],
    ]
  )

  //map(foo.eq(true) ? bar : baz)
  //map(if(foo.eq(true), bar, baz))

  //XXX not sure this is correct. I don't think if should need `.if` should just be `if`?
  test(
    '.map(.if(.foo.eq(true),.bar,.baz))',
    pipe(input(),
      map(pipe(
        input(),
        iftt(
        pipe(input(), get('foo'), eq(true)),
        pipe(input(), get('bar')),
        pipe(input(), get('baz'))
      )))
    ),
    [1, -2, 3, 4, -5, -6]
  )

  t.end()
})

tape('reduce', function (t) {
  var test = Test(t, value2)
  // reduce(bar.add(0))
  // reduce(bar.add())
  // reduce(.add(..), 0)
  test(
    '.reduce(.add(..bar),0)',
    pipe(input(), reduce(pipe(input(), add( pipe(parent(1), get('bar')) )), 0)),
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
  var test = Test(t, edges)

  test(
    '.filter(.from.eq(0)).reduce(.set(..to,true))',
    pipe(
      input(),
      filter(pipe(input(), get('from'), eq(0))),
      reduce(pipe(input(), set( pipe(parent(1), get('to')), true) ))
    ),
    {0: true, 1: true, 2: true}
  )

  var o = {}

  test(
    '.reduce(.set(..from,.set(...to,true)))',
    pipe(
      input(),
      reduce(
        pipe(
          input(), set(
            pipe(parent(1), get('from')), //key
            pipe(
              input(), set(
                pipe(parent(2), get('to')),
                true
              )
            )
          )
        )
      )
    ),
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






