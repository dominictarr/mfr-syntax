function interpreter (value, ast, stack) {
  if(!exports[ast.name]) throw new Error('unknown method:'+ast.name+', '+JSON.stringify(ast))
  if(!stack) stack = [value]
  return exports[ast.name].call(null, value, ast.value, stack || [])
}

function interpret_arg (value, arg, stack) {
  if(arg && 'object' === typeof arg)
    return interpreter(value, arg, stack)
  else
    return arg
}

exports = module.exports = interpreter

//basic operations: all the stuff a normal language might
//have built in operators for.
var basic = require('./basic')

for(var k in basic) (function (fn, name) {
  exports[name] = function (value, args, stack) {
    return fn(value, interpret_arg(value, args[0], stack))
  }
})(basic[k], k)

//only allow strings or integers.
//do not allow access of functions, or __proto__
function safe_get (value, key) {
  var result
  if(!value) return null
  if('object' !== typeof value) return null
  if(Array.isArray(value)) {
    if(!Number.isInteger(key)) return null
    result = value[key >= 0 ? key : value.length+key]
  }
  //excludes __proto__, and anything inherited
  if(Object.hasOwnProperty.call(value, key))
    result = value[key]
  if('function' === typeof result) return null
  return result
}

function safe_set(object, key, value) {
  if(!object) return null
  if('object' !== typeof object) return null
  if(Array.isArray(object)) {
    if(!Number.isInteger(key)) return null
    object[key >= 0 ? key : key.length + key] = value
  }
  else if(key === '__proto__')
    return null //cannot update prototype!
  else
    object[key] = value
  return object
}

exports.get = function (value, path) {
  return safe_get(value, path[0])
}

exports.pipe = function (value, ops, stack) {
  for(var i = 0; i < ops.length; i++) {
    value = interpreter(value, ops[i], stack)
    stack = [value].concat(stack)
  }
  return value
}

//special for async
exports.object = function (value, pairs, stack) {
  var o = {}
  stack = [value].concat(stack)
  for(var i = 0; i < pairs.length; i += 2) {
    var _key = pairs[i], _value = pairs[i+1]
    o[_key] = interpret_arg(safe_get(value, _key), _value, stack)
  }

  return o
}

//special for async
exports.parent = function (value, args, stack) {
  if(!Number.isInteger(args[0]) && args[0] >= 0) return null
  //is value == stack[0] ?
  return stack[args[0]]
}

function filter(array, each) {
  return array.filter(each)
}

//special for async
exports.filter = function (value, args, stack) {
  return filter(value, function (e) {
    return interpret_arg(e, args[0], [e].concat(stack))
  })
}

//special for async
exports.map = function (value, args, stack) {
  return value.map(function (e) {
    return interpret_arg(e, args[0], [e].concat(stack))
  })
}

//special handling for async
exports.if = function (value, args, stack) {
  return (
      interpret_arg(value, args[0], stack)
    ? interpret_arg(value, args[1], stack)
    : interpret_arg(value, args[2], stack)
  )
}

exports.reduce = function (value, args, stack) {
  var initial = interpret_arg(value, args[1], stack)
  return value.reduce(function (a, b) {
    return interpret_arg(a, args[0], [a, b].concat(stack))
  }, initial)
}

exports.set = function (value, args, stack) {
  if(value == null) value = {}
  var key = interpret_arg(value, args[0], stack)

  // SECURITY: what happens if someone tries to set a value to it's parent, creating a cycle?
  // if we had a recursive operator that could be an infinite loop.
  // when that message is serialized to JSON it will throw an error.
  // would be good just to nip that in the bud.
  //
  // if the value being set is an object, iterate up the stack and check it's not set already.
  // if it was the same object as before, we can skip the check.

  var __value = safe_get(value, key)
  var _value = interpret_arg(__value, args[1], stack)
  if('object' === typeof _value && _value !== __value) {
    for(var i = 0; i < stack.length; i++)
      if(stack[i] === _value)
        return value //just ignore it!

    //if each test passes, fall through to safe_set
  }

  return safe_set(value, key, _value)
}



