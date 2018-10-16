var mfr = require('../')

var valid = [
  '0',
  '1',
  '10',
  '1.01',
  '-1.01',
  '-20',
  'plus(1,2)',
//  ".{key:1,value:2}",
  '.filter(.{key:"key",value:"value"})',
  '.foo.bar.{key:1,value:2}',
  '.foo.{bar,baqq:.baz.parent(0)}',
  '.foo.{bar,baqq:.baz.parent(0)}',
  '..bar',
  '...bar.foo',
  '.',
  '..',
  '...',
    '.filter(.from.eq(0)).reduce(.set(..to,true))',
  'true'
]

valid.forEach(function (v, i) {
  console.log(i)
  console.log(v)
  console.log(JSON.stringify(mfr.decode(v, true)))
})


