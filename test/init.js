require('./registerBabel.js');

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

const { LocalStorage } = require('node-localstorage');
const { JSDOM } = require('jsdom');

global.localStorage = new LocalStorage('./test/localStorageTemp');
global.window = (new JSDOM('<body><div id="page"><div id="content"></div></div></body>', {
  url: 'https://alpha.growthfountain.com'
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

require('js/html5-dataset.js');
require('classlist-polyfill');

// global.require = require;
global.api = require('../src/helpers/forms.js');
const App = require('../src/app.js');
global.app = App();
const Router = require('src/router.js');
app.routers = new Router();
$.fn.scrollTo = function (padding=0) {
  $('html, body').animate({
    scrollTop: $(this).offset().top - padding + 'px',
  }, 'fast');
  return this;
};
require('jquery-serializejson');

$.serializeJSON.defaultOptions = _.extend($.serializeJSON.defaultOptions, {
  customTypes: {
    decimal(val) {
      return app.helpers.format.unformatPrice(val);
    },
    percent(val) {
      return app.helpers.format.unformatPercent(val);
    },
    money(val) {
      return app.helpers.format.unformatMoney(val);
    },
    integer(val) {
      return parseInt(val);
    },
    url(val) {
      return String(val);
    },
    text(val) {
      return String(val);
    },
    email(val) {
      return String(val);
    },
    password(val) {
      return String(val);
    },
  },
  useIntKeysAsArrayIndex: true,
  parseNulls: true,
  parseNumbers: true
});

global.testHelpers = require('./testHelpers.js');
