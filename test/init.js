const pug = require('pug');

function compile(module, filename) {
  var template = pug.compileFile(filename, { pretty: true });
  module.exports = template
}

if (require.extensions) {
  require.extensions['.pug'] = compile
}

const LocalStorage = require('node-localstorage').LocalStorage;
global.localStorage = new LocalStorage('./test/localStorageTemp');

const jsdom = require('jsdom');

global.document = jsdom.jsdom('<body><div>1</div></body>');
global.window = document.defaultView;
global.window.localStorage = global.localStorage;
global.navigator = {userAgent: 'node.js'};

global.app = require('../src/app.js');


if(require) {
  require.ensure = function ensure(param, cb) {
    cb();
  };
}
if(global.require) {
  global.require.ensure = function ensure(param, cb) {
    cb();
  };
}
