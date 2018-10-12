var tape = require('tape')
var eval = require('../interpreter')

function pipe() {
  return {name: 'pipe', value: [].slice.call(arguments)}
}

function get (k) {
  return {name: 'get', value: k}
}

function object (obj) {
  var a = []
  for(var k in obj) {
    a.push(k); a.push(obj[k])
  }
  return {name: 'object', value: a}
}

function parent (n) {
  return {name: 'parent', value: n}
}

function gt (v) {
  return {name: 'gt', value: v}
}

function eq (v) {
  return {name: 'eq', value: v}
}

function filter(v) {
  return {name: 'filter', value: v}
}

function map(v) {
  return {name: 'map', value: v}
}

function iff (test, ifTrue, ifFalse) {
  return {name: 'if', value: [test, ifTrue, ifFalse]}
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

tape('simple', function (t) {
  t.equal(eval(value, get('easy')), true)
  t.equal(eval(value, pipe(get('easy'))), true)
  t.equal(eval(value, pipe(get('foo'), get('bar'))), false)

  t.deepEqual(eval(value,
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
    ), {bar: false, baqq: 1})

  t.deepEqual(eval(value,
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
    ), {bar: false, baqq: 3})

  t.deepEqual(eval(value,
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
    ), {bar: false, baqq: -1})


  t.equal(eval(value, pipe(get('fop'), gt(0))), false)

//  t.equal(eval(value, pipe(get('more'), all(eq())

  t.deepEqual(eval(value,
    object({
      fooQux: pipe(get('foo'), get('qux')),
      equal: pipe(
        pipe(get('foo'), get('qux')),
        eq(pipe(parent(1), get('more'), get(2))))
   })
  ),
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
    map(iff(pipe(get('foo'), eq(true)), get('bar'), get('baz')))
  ), [
    1, -2, 3, 4, -5, -6
  ])

  t.end()
})

