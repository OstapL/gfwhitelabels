const pug = require('pug');

if (require.extensions) {
  require.extensions['.pug'] = function compile(module, filename) {
    var template = pug.compileFile(filename, {
      pretty: false,
      client: true,
      inlineRuntimeFunctions: true,
    });
    module.exports = template
  }
}


const { LocalStorage } = require('node-localstorage');
const { JSDOM } = require('jsdom');

global.localStorage = new LocalStorage('./test/localStorageTemp');
global.window = (new JSDOM(`<html><head>
      <meta name="description" />
      <meta property="og:title" content=""/>
      <meta property="og:description" content=""/>
      <meta property="og:image" content=""/>
      <meta property="og:url" content=""/>
      <body><div id="page"><div id="content"></div></div>
      </body></html>`, {
  url: process.env.URL || 'https://alpha.growthfountain.com'
})).window;

global.document = window.document;
global.window.localStorage = global.localStorage;
window.__defineSetter__('location', (val) => {});
global.location = window.location;
global.navigator = { userAgent: 'node.js' };
global.$ = global.jQuery = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
global.Tether = window.Tether = require('tether');
require('bootstrap');
global.Element = window.Element;
global.Node = window.Node;

require('babel-polyfill');
require('jquery-serializejson');
require('js/html5-dataset.js');
require('classlist-polyfill');

require('../src/extensions.js');

global.api = require('../src/helpers/forms.js');
const App = require('../src/app.js');
global.app = App();
const Router = require('src/router.js');
app.routers = new Router();

global.testHelpers = require('./testHelpers.js');
