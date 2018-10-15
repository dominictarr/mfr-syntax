//basic operators

//This is everything I could think of needing so far.
//everything that APL has https://en.wikipedia.org/wiki/APL_syntax_and_symbols
//that isn't about matrices are in there.

// TODO solid type behaviour:
// what happens when you compare a number to a string (don't coearse the number to a string and compare that, that is stupid)
// add a number to a string should also not concatenate.
// you shouldn't be able to `add` two strings, you should `cat` them.
// if you do want to covert to strings or numbers, there should be an explicit operation for that.
// etc.
// but every comparison should be defined.

exports.gt = function (a, b) {
  return a > b
}

exports.lt = function (a, b) {
  return a < b
}

exports.gte = function (a, b) {
  return a >= b
}

exports.lte = function (a, b) {
  return a <= b
}

exports.eq = function (a, b) {
  return a === b
}

exports.neq = function (a, b) {
  return a !== b
}

exports.add = function (a, b) {
  return (a == null ? 0 : a) + b
}

exports.sub = function (a, b) {
  return (a == null ? 0 : a) - b
}

exports.mul = function (a, b) {
  return (a == null ? 1 : a) * b
}

exports.div = function (a, b) {
  return (a == null ? 1 : a) / b
}

exports.mod = function (a, b) {
  return (a == null ? 1 : a) % b
}

exports.rdiv = function (a, b) {
  return b / (a == null ? 1 : a)
}

exports.rmod = function (a, b) {
  return  b % (a == null ? 1 : a)
}

exports.pow = function (a, b) {
  return Math.pow((a == null ? 1 : a), b)
}

exports.log = function (a, b) {
  //default to Math.E
  //Math.log(Math.E) == 1, so Math.log(a)/Math.log(Math.E) == Math.log(a)
  a = (a == null ? 1 : a)
  return b == null ? Math.log(a) : Math.log(a)/Math.log(b)
}

exports.max = function (a, b) {
  return a > b ? a : b
}

exports.min = function (a, b) {
  return a < b ? a : b
}

exports.is = function (a, b) {
  return typeof a === b
}

//used in a reduce, gets the first item
exports.def = function (a, b) {
  return a == null ? b : a
}

//used in a reduce, gets the last item
exports.defr = function (a, b) {
  return b == null ? a : b
}

exports.xor = function (a, b) {
  return !!(a ^ b)
}
//round to nearest b. 10 rounds to nearest 10. 0.01 rounds to two decimal places
exports.round = function (a, b) {
  b = b || 1
  return Math.round(a/b)*b
}

//boolean

exports.not = function (a) {
  return !a
}

exports.and = function (a, b) {
  return a && b
}

exports.or = function (a, b) {
  return a || b
}


//does nothing
exports.id = function (a) {
  return a
}

