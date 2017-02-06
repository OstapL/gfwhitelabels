
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


Backbone.Router.execute = function (callback, args, name) {
  if (name == '/company/create' && !app.user.ensureLoggedIn(name))
    return false;

  if (callback) callback.apply(this, args);
};

let appRoutes = Backbone.Router.extend({
  routes: {
    '*notFound': function () {
      errorPageHelper({status: 404});
      app.hideLoading();
    }
  },

  execute(callback, args, name) {
    console.debug('/src/routers.js');

    const slashAtTheEnd= /\/$/;
    const isSlashAtTheEnd = slashAtTheEnd.test(Backbone.history.fragment);
    
    if (isSlashAtTheEnd) {
      let fragment = Backbone.history.fragment.replace(slashAtTheEnd, '');
      this.navigate(fragment, {trigger: true, replace: true});
    } else if (callback) {
      callback.apply(this, args)
    };
  },

  initialize() {
    const copyRoutes = (router) => {
      _.each(router.routes, (funcName, path) => this.routes[path] = r1[funcName]);
      return router;
    };

    // add routes of components
    // ToDo
    // So messy code
    
    let r1  = new payBackShareCalculator;
    copyRoutes(r1);
    
    let r2  = new capitalRaiseCalculator;
    copyRoutes(r2);
    
    let r3  = new campaignRoute;
    copyRoutes(r3);
    
    let r4  = new pageRoute;
    copyRoutes(r4);
    
    let r5  = new raiseFunds;
    copyRoutes(r5);
    
    let r6  = new anonymousAccount;
    copyRoutes(r6);
    
    let r7  = new accountProfile;
    copyRoutes(r7);
    
    let r8  = new whatMyBusinessWorthCalc;
    copyRoutes(r8);
    
    let r9  = new establishedBusinessCalc;
    copyRoutes(r9);
    
    let r10  = new formc;
    copyRoutes(r10);
    
    let r11  = new blog;
    copyRoutes(r11);
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

});

app.on('userLoaded', function (data) {

  app.routers = new appRoutes();
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
    var $bottomLogo = $('#fade_in_logo');
    var offsetTopBottomLogo = $bottomLogo.offset().top;

    if (($(window).scrollTop() + $(window).height() >= offsetTopBottomLogo) &&
      !$bottomLogo.hasClass('fade-in')) {
      $bottomLogo.addClass('fade-in');
    }
  });
});