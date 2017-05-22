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
const { JSDOM } = require('jsdom');

global.localStorage = new LocalStorage('./test/localStorageTemp');
global.window = (new JSDOM('<body><div id="page"><div id="content"></div></div></body>', {
  url: 'https://alpha.growthfountain.com'
})).window;
global.document = window.document;

global.window.localStorage = global.localStorage;
global.navigator = {userAgent: 'node.js'};
global.$ = require('jquery')(window);
global._ = require('underscore');
global.Backbone = require('backbone');
// global.require = require;
global.api = require('src/helpers/forms.js');
const App = require('../src/app.js');
global.app = App();
app.user = {};

