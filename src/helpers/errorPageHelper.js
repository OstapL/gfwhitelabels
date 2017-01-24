module.exports = function (opts) {
  var notFoundTpl = require('templates/errorPage.pug');
  var notFound = notFoundTpl(opts);
  $('#content').html(notFound);
};