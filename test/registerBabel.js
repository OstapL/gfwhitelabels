require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

require('babel-polyfill');
