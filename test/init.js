const pug = require('pug');

function compile(module, filename) {
  // ToDo
  // Why does globals require is not working ?!
  var template = pug.compileFile(filename, { 
    pretty: false,
    client: true,
    inlineRuntimeFunctions: true,
    globals: ['require', 'app'],
  });
  module.exports = template
}

if (require.extensions) {
  require.extensions['.pug'] = compile
}

const LocalStorage = require('node-localstorage').LocalStorage;
global.localStorage = new LocalStorage('./test/localStorageTemp');

const jsdom = require('jsdom');

global.document = jsdom.jsdom('<body><div id="content"></div></body>');
global.window = document.defaultView;
global.window.localStorage = global.localStorage;
global.navigator = {userAgent: 'node.js'};

require('../src/app.js');
global.require = require;
