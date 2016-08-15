global.config = require('config');
global.jQuery = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.Validation = require('backbone-validation');
global.Tether = require('tether');
global.Bootstrap = require('../../node_modules/bootstrap/dist/js/bootstrap.min.js');
global.userModel = require('models/user.js');
global.Urls = require('jsreverse.js');

console.log(global.userModel);
