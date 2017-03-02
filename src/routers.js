const payBackShareCalculator = require('components/payBackShareCalculator/route');
const capitalRaiseCalculator = require('components/capitalRaiseCalculator/route');
const whatMyBusinessWorthCalc = require('components/whatMyBusinessWorthCalculator/route');
const campaignRoute = require('components/campaign/route');
const pageRoute = require('components/pg/route');
const raiseFunds = require('components/raiseFunds/route');
const anonymousAccount = require('components/anonymousAccount/route');
const accountProfile = require('components/accountProfile/route');
const establishedBusinessCalc = require('components/establishedBusinessCalculator/route');
const formc = require('components/formc/route');
const blog = require('components/blog/route');

const errorPageHelper = require('helpers/errorPageHelper.js');

// Backbone.Router.execute = function (callback, args, name) {
//   if (name == '/company/create' && !app.user.ensureLoggedIn(name))
//     return false;
//
//   if (callback) callback.apply(this, args);
// };

const AppRoutes = Backbone.Router.extend(_.extend({
  routes: _.extend({
    '*notFound': function () {
      errorPageHelper({ status: 404 });
      app.hideLoading();
    },
  }, accountProfile.routes, anonymousAccount.routes, establishedBusinessCalc.routes,
      capitalRaiseCalculator.routes, campaignRoute.routes, formc.routes,
      whatMyBusinessWorthCalc.routes, raiseFunds.routes, pageRoute.routes, blog.routes),

  initialize() {
    console.log('initialize');
  },

  execute(callback, args, name) {
    debugger;
    // alert('router: ' + name);
    console.debug('/src/routers.js');
    if (callback) callback.apply(this, args);

    //TODO: implement///!!!!!
    // const slashAtTheEnd = /\/$/;
    // const isSlashAtTheEnd = slashAtTheEnd.test(Backbone.history.fragment);
    //
    // if (isSlashAtTheEnd) {
    //   let fragment = Backbone.history.fragment.replace(slashAtTheEnd, '');
    //   this.navigate(fragment, {trigger: true, replace: true});
    // } else if (callback) {
    //   callback.apply(this, args)
    // };
  },

  back: function (e) {
    // Create requirements and do clean up before
    // running view function
    // Undelegate and clear all popovers
    $('#content').off('submit');
    $('#content').off('click');
    //$('form').undelegate();
    $('.popover').popover('hide');
  },

}, accountProfile.methods, anonymousAccount.methods, establishedBusinessCalc.methods,
    capitalRaiseCalculator.methods, campaignRoute.methods, formc.methods,
    whatMyBusinessWorthCalc.methods, raiseFunds.methods, pageRoute.methods, blog.methods));

//TODO: why this code is here
app.on('userLoaded', function (data) {

  app.routers = new AppRoutes();
  app.user.url = serverUrl + Urls['rest_user_details']();
  Backbone.history.start({ pushState: true });

  window.addEventListener('popstate', app.routers.back);

  let menu = require('components/menu/views.js');
  app.menu = new menu.menu({
    el: '#menuList',
  });
  app.menu.render();
  let i = new menu.footer({
    el: '.footer_new',
  });
  i.render();

  app.notification = new menu.notification({
    el: '#menuNotification',
  });
  app.notification.render();
  app.profile = new menu.profile({
    el: '#menuProfile',
  });
  app.profile.render();
  app.trigger('menuReady');
});

$(document).ready(function () {

  // show bottom logo while scrolling page
  $(window).scroll(function () {
    let $bottomLogo = $('#fade_in_logo');
    let offsetTopBottomLogo = $bottomLogo.offset().top;

    if (($(window).scrollTop() + $(window).height() >= offsetTopBottomLogo) &&
      !$bottomLogo.hasClass('fade-in')) {
      $bottomLogo.addClass('fade-in');
    }
  });

});
