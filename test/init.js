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
const jsdom = require('jsdom');

global.localStorage = new LocalStorage('./test/localStorageTemp');

global.window = new jsdom.JSDOM('<body><div id="content"></div></body>', {
  url: 'https://alpha.growthfountain.com'
});

global.document = global.window.document;
global.window.localStorage = global.localStorage;
global.navigator = {userAgent: 'node.js'};
global._ = require('underscore');
global.Backbone = require('backbone');

require('../src/app.js');
global.require = require;
