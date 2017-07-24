require('babel-polyfill');
require('jquery-serializejson');
require('js/html5-dataset.js');
require('classlist-polyfill');
require('dom4');
//fix for safari 9.1
// if (!global.Intl) {
require('intl');
require('intl/locale-data/jsonp/en.js');
// }

require('bootstrap/dist/js/bootstrap.js');
require('owl.carousel');

(function () {
  if ( typeof NodeList.prototype.forEach === "function" ) return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();
