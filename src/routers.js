const componentRoutes = [
  require('components/payBackShareCalculator/route'),
  require('components/capitalRaiseCalculator/route'),
  require('components/whatMyBusinessWorthCalculator/route'),
  require('components/campaign/route'),
  require('components/pg/route'),
  require('components/raiseFunds/route'),
  require('components/anonymousAccount/route'),
  require('components/accountProfile/route'),
  require('components/establishedBusinessCalculator/route'),
  require('components/formc/route'),
  // require('components/blog/route'),
];

const routesMap = _.reduce(componentRoutes, (dest, route) => {
  dest.routes = _.extend(dest.routes, route.routes);
  dest.methods = _.extend(dest.methods, route.methods);
  if (Array.isArray(route.auth)) {
    dest.auth = dest.auth.concat(route.auth);
  } else if (route.auth === '*') {
    dest.auth = dest.auth.concat(Object.keys(route.methods));
  }

  return dest;
}, { routes: {}, methods: {}, auth: [] });

//TODO: move into app.js
const errorPageHelper = require('helpers/errorPageHelper.js');

const runGoogleAnalytics = (id) => {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0];
    var j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', id);
};

const emitGoogleAnalyticsEvent = () => {
  //TODO: this will be fixed when we fix facebook/googleTagManager scripts
  // if (!window.fbq) {
  //   console.error('Google analytics service is not running');
  //   return;
  // }
  // fbq('track', 'ViewContent');
  // ga('send', 'pageview', '/' + Backbone.history.getPath());
};

const notFound = () => {
  errorPageHelper({ status: 404 });
  app.hideLoading();
};

const Router = Backbone.Router.extend(_.extend({
  routes: _.extend({}, routesMap.routes, { '*notFound': notFound }),

  initialize() {
    runGoogleAnalytics(googleAnalyticsId);
  },

  execute(callback, args, name) {
    emitGoogleAnalyticsEvent();

    if (_.contains(routesMap.auth, name) && !app.user.ensureLoggedIn())
      return false;

    if (callback)
      callback.apply(this, args);
    else
      console.error(`Route handler '${name}' not found.`);
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

}, routesMap.methods));

//TODO: why this code is here
app.on('userLoaded', function (data) {

  app.routers = new Router();
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

    if (($(window).scrollTop() + $(window).height() >= offsetTopBottomLogo) && !$bottomLogo.hasClass('fade-in')) {
      $bottomLogo.addClass('fade-in');
    }
  });
});