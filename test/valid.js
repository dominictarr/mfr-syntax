var mfr = require('../')

var valid = [
  '0',
  '1',
  '10',
  'plus(1,2)',
  "{key:1,value:2}",
  'filter({key:"key",value:"value"})'
]

valid.forEach(function (v) {
  console.log(JSON.stringify(mfr.decode(v)))
})



