var tape = require('tape')
var eval = require('../interpreter')

function pipe() {
  return {name: 'pipe2', value: [].slice.call(arguments)}
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
  return {name: 'add', value: [].slice.call(arguments)}
}

function reduce (op, initial) {
  return {name: 'reduce', value: [op, initial]}
}

function set(key, value, defaults) {
  return {name: 'set', value: [key, value]}
}

function input () {
  return {name: 'input', value: []}
}

var value = {foo: 3, bar: 3, baz: { qux: true }}
tape('simple', function (t) {
  function test (ast, expected) {
    t.deepEqual(eval(value, ast), expected)
  }
  //simplest possible pipelines:
  // .              - single item
  test(pipe(input()), value)
  // ..             - parent item
  test(pipe(parent(1)), undefined)
  // .foo           - property access
  test(pipe(input(), get('foo')), value.foo)
  // .baz.qux       - chained property
  test(pipe(input(), get('baz'), get('qux')), value.baz.qux)
  // .eq(2)         - function call
  return t.end()
  test(pipe(input(), eq(2)), value === 2)
  // .foo.eq(3)     - function call on property
  test(pipe(input(), get('foo'), eq(3)), value.foo === 3)
  // eq(.foo, 3)    - function call on args, not a pipe!
  test(pipe(eq(get('foo'), 3)), value.foo === value.bar)
  // eq(.foo, .bar) - function call with args
  // .foo.eq(..bar) - piped call with backtrack

  t.end()
})


tape('more', function (t) {
  var value = {
    data: [1,2,3]
  }

  function test (src, ast, expected) {
    console.log("eval:", src)
    //TODO: parse(src) deepEqual ast
    t.deepEqual(eval(value, ast), expected)
  }

  //.reduce(.add(..))
  test(
    '.reduce(.add(..))', //this is the better version.
    pipe(input(), get('data'), reduce(pipe(input(), add(parent(1))))),
    value.data.reduce((a, b) => { return a + b }, 0)
  )

  test(
    '.reduce(add(.,..))',
    pipe(input(), get('data'), reduce(pipe(add(input(), parent(1))), 0) ),
    value.data.reduce((a, b) => { return a + b }, 0)
  )

  t.end()
})



