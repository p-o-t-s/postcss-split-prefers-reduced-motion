var postcss = require('postcss');
var plugin = require('./index');

function run (input, output, opts) {
  return postcss([plugin(opts)]).process(input).then(function (result) {
    expect(result.css).toEqual(output)
    expect(result.warnings()).toHaveLength(0)
  })
}

// @todo
// it('does something', function () {
//   return run('a{ }', 'a{ }', { })
// })
