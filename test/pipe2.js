var tape = require('tape')
var eval = require('../interpreter')
var mfr = require('../')

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

function input () {
  return {name: 'input', value: []}
}

function id () {
  return {name: 'id', value: []}
}

var value = {foo: 3, bar: 3, baz: { qux: true }}
tape('simple', function (t) {
  function test (src, ast, expected) {
    console.log("test:", src)
    if(src) {
      var _ast = mfr.decode(src, true)
      t.deepEqual(_ast, ast)
    }
    t.deepEqual(eval(value, ast), expected)
  }
  test(
    '.get(0)',
    pipe(input(), get(0)),
    undefined
  )


  //simplest possible pipelines:
  // .              - single item
  test(
    '.',
    input(),
    value
  )
  // ..             - parent item
  test(
    '..',
    parent(1),
    undefined
  )
  // .foo           - property access
  test(
    '.foo',
    pipe(input(), get('foo')),
    value.foo
  )
  // .baz.qux       - chained property
  test(
    '.baz.qux',
    pipe(input(), get('baz'), get('qux')),
    value.baz.qux
  )
  // .eq(2)         - function call

  test(
    '.eq(2)',
    pipe(input(), eq(2)),
    value === 2
  )
  // .foo.eq(3)     - function call on property
  test(
    '.foo.eq(3)',
    pipe(input(), get('foo'), eq(3)),
    value.foo === 3
  )

  // eq(.foo, 3)    - function call on args, not a pipe!
  test(
    'eq(.foo,3)',
    pipe(eq(pipe(input(), get('foo')), 3)),
    value.foo === 3
  )
  // eq(.foo, .bar) - function call with args
  // .foo.eq(..bar) - piped call with backtrack
  test(
    'eq(.foo,.bar)',
    pipe(eq(pipe(input(), get('foo')), pipe(input(), get('bar')))),
    value.foo === value.bar
  )

  t.end()
})

tape('more', function (t) {
  var value = {
    data: [1,2,3]
  }

  function test (src, ast, expected) {
    if(src) {
      var _ast = mfr.decode(src, true)
      t.deepEqual(_ast, ast)
      t.equal(JSON.stringify(_ast),JSON.stringify( ast))
    }
    t.deepEqual(eval(value, ast), expected)
  }

  //.reduce(.add(..))
  test(
    '.data.reduce(.add(..))',
    pipe(input(), get('data'), reduce(
      pipe(
        input(),
        add(
//          parent(1)
          parent(1)
        )
      )
    )),
    value.data.reduce((a, b) => { return a + b }, 0)
  )

  test(
    '.data.reduce(add(.,..),0)',
    pipe(input(), get('data'), reduce(pipe(add(
      input(), parent(1)
    )), 0) ),
    value.data.reduce((a, b) => { return a + b }, 0)
  )

  test(
    null,
    pipe(
      input(), get('data'),
      reduce( pipe(add(parent(0), parent(1))), 0)
    ),
    value.data.reduce((a, b) => { return a + b }, 0)
  )

  t.end()
})

tape('object', function (t) {
  var value = {
    foo: 2, bar: 3, baz: {qux: true}
  }

  function test (src, ast, expected) {
    if(src) {
      var _ast = mfr.decode(src, true)
      t.deepEqual(_ast, ast)
      t.equal(JSON.stringify(_ast),JSON.stringify( ast))
    }
    t.deepEqual(eval(value, ast), expected)
  }

  //.reduce(.add(..))
  test(
    '.{foo,bar}',
    pipe(input(), object({foo:id(), bar: id()})),
    {foo: value.foo, bar: value.bar}
  )
  t.end()
})


