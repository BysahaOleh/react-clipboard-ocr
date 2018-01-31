var typescript = require('rollup-plugin-typescript');

var config = {
  input: 'src/index.ts',
  plugins: [typescript()],
  output: {
    file: 'index.js',
    format: 'cjs'
  }
};

module.exports = config