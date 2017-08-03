const componentRoutes = [
  require('components/payBackShareCalculator/route.js'),
  require('components/capitalRaiseCalculator/route.js'),
  require('components/whatMyBusinessWorthCalculator/route.js'),
  require('components/raiseFunds/route.js'),
  require('components/pg/route.js'),
  require('components/campaign/route.js'),
  require('components/anonymousAccount/route.js'),
  require('components/accountProfile/route.js'),
  require('components/establishedBusinessCalculator/route.js'),
  require('components/formc/route.js'),
  // require('components/blog/route'),
];

const checkSafeExtend = (dest={}, src={}) => {
  let keys = Object.keys(dest);
  _(keys).each((key) => {
    if (src[key])
      console.error(`Method ${key} is already in Router`, src);
  });
};

const routesMap = _.reduce(componentRoutes, (dest, route) => {
  checkSafeExtend(dest.routes, route.routes);
  checkSafeExtend(dest.methods, route.methods);

  dest.routes = _.extend(dest.routes, route.routes);
  dest.methods = _.extend(dest.methods, route.methods);
  if (Array.isArray(route.auth)) {
    dest.auth = dest.auth.concat(route.auth);
  } else if (route.auth === '*') {
    dest.auth = dest.auth.concat(Object.keys(route.methods));
  }

  return dest;
}, { routes: {}, methods: {}, auth: [] });

const notFound = () => {
  app.helpers.errorPage({ status: 404 });
  app.hideLoading();
};


module.exports = Backbone.Router.extend(_.extend({
  routes: _.extend({}, routesMap.routes, { '*notFound': notFound }),

  initialize() {
  },

  execute(callback, args, name) {
    if (
        window.location.pathname.substr(window.location.pathname.length-1, 1) == '/' &&
        window.location.pathname != '/'
        ) {
      window.location = window.location.pathname.substr(0, window.location.pathname.length-1);
    }

    app.clearClasses('#page', ['page']);

    if (_.contains(routesMap.auth, name) && !app.user.ensureLoggedIn()) {
      return false;
    }

    if(app.seo.title[window.location.pathname]) {
      document.title = app.seo.title[window.location.pathname];
      document.head.querySelector('meta[name="description"]').content = app.seo.meta[window.location.pathname];
      document.head.querySelector('meta[property="og:title"]').content = app.seo.title[window.location.pathname];
      document.head.querySelector('meta[property="og:description"]').content = app.seo.meta[window.location.pathname];
      document.head.querySelector('meta[property="og:url"]').content = window.location.href;
    }

    if (!app.user.is_anonymous()) {
      api.makeRequest(app.config.authServer + '/log', 'POST', {
        path:window.location.pathname,
        device: navigator.userAgent
      });
    }

    if (callback) {
      callback.apply(this, args);
    } else {
      console.error(`Route handler '${name}' not found.`);
    }
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

  navigateWithReload(href, options) {
    const currentLocation = window.location.pathname + (window.location.search || '');
    if (href === currentLocation) {
      setTimeout(() => { window.location.reload(); }, 10);
      return true;
    }

    this.navigate(href, options);
  },

}, routesMap.methods));
