
function interpreter (value, ast, stack) {
  if(!exports[ast.name]) throw new Error('unknown method:'+ast.name)
  if(!stack) stack = [value]
  return exports[ast.name].call(null, value, ast.value, stack || [])
}

exports = module.exports = interpreter

exports.pipe = function (value, ops, stack) {
  for(var i = 0; i < ops.length; i++) {
    value = interpreter(value, ops[i], stack)
    stack = [value].concat(stack)
  }
  return value
}

exports.get = function (value, key) {
  return value[key]
}

exports.object = function (value, pairs, stack) {
  var o = {}

  for(var i = 0; i < pairs.length; i += 2) {
    var _key = pairs[i], _value = pairs[i+1]
    o[_key] = interpreter(value, _value, stack)
  }

  return o
}

exports.parent = function (value, parent, stack) {
  return stack[parent]
}

function interpret_arg (value, arg, stack) {
  if(arg && 'object' === typeof arg)
    return interpreter(value, arg, stack)
  else
    return arg
}

exports.filter = function (value, arg, stack) {
  return value.filter(function (e) {
    var v = interpret_arg(e, arg, [e].concat(stack))

    return v
  })
}

exports.map = function (value, arg, stack) {
  return value.map(function (e) {
    var v = interpret_arg(e, arg, [e].concat(stack))

    return v
  })
}

exports.if = function (value, arg, stack) {
  return (
      interpret_arg(value, arg[0], stack)
    ? interpret_arg(value, arg[1], stack)
    : interpret_arg(value, arg[2], stack)
  )
}

//basic operators
exports.gt = function (value, arg) {
  return value > arg
}

exports.eq = function (value, arg, stack) {
  return value === interpret_arg(value, arg, stack)
}


