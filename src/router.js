const componentRoutes = [
  require('components/calcRevenueShare/route.js'),
  require('components/calcStartup/route.js'),
  require('components/calcCapitalRaise/route.js'),
  require('components/calcEstablishedBusiness/route.js'),
  require('components/blog/route.js'),
  require('components/raiseFunds/route.js'),
  require('components/pg/route.js'),
  require('components/campaign/route.js'),
  require('components/anonymousAccount/route.js'),
  require('components/accountProfile/route.js'),
  require('components/formc/route.js'),
];

const checkSafeExtend = (dest={}, src={}) => {
  Object.keys(dest).forEach((key) => {
    // ToDo
    // src[key] is always undefined
    if (src[key]) {
      console.error(`Method ${key} is already in Router`, src);
    } 
    /*
    if (key.indexOf('/') !== -1 && key.match(/[A-Z]/) !== null) {
      console.error(`Method ${key} contains upper letters please fix`, src);
    }
    */
  });
};

const routesMap = componentRoutes.reduce((dest, route) => {
  checkSafeExtend(dest.routes, route.routes);
  checkSafeExtend(dest.methods, route.methods);
  checkSafeExtend(dest.routes, route.historicalRoutes || {});

  dest.routes = Object.assign(dest.routes, route.routes);
  dest.methods = Object.assign(dest.methods, route.methods);

  Object.keys(route.historicalRoutes || {}).forEach((historicalRoute) => {
    const actualRoute = route.historicalRoutes[historicalRoute];
    dest.routes[historicalRoute] = () => {
      window.location = actualRoute.startsWith('/') ? actualRoute : `/${actualRoute}`;
    }
  });

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

module.exports = Backbone.Router.extend(Object.assign({
  routes: Object.assign({}, routesMap.routes, { '*notFound': notFound }),
  previousUrl: '',
  currentUrl: '',

  initialize() {
  },

  execute(callback, args, name) {
    if (
        window.location.pathname.substr(window.location.pathname.length-1, 1) == '/' &&
        window.location.pathname != '/'
        ) {
      window.location = window.location.pathname.substr(0, window.location.pathname.length-1);
      return false;
    }

    // Fix 903
    if (window.location.pathname.match(/[A-Z]/) !== null) {
      window.location = window.location.pathname.toLowerCase();
      return false;
    }

    if (routesMap.auth.includes(name) && !app.user.ensureLoggedIn()) {
      // Revert back the current URL, 
      // Do not update url
      if (app.routers.currentUrl) {
        app.routers.navigate(app.routers.currentUrl, {trigger: false});
      }
      return false;
    }


    app.showLoading();
    if (app.currentView) {
      app.currentView.destroy();
    }
    this.previousUrl = this.currentUrl;
    this.currentUrl = window.location.pathname;
    document.title = app.config.siteTitle
    document.head.querySelector('meta[name="description"]').content = app.config.siteDescription
    document.head.querySelector('meta[property="og:url"]').content = window.location.href;

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

  // WHY ?
  // Зачем это ?
  navigateWithReload(href, options) {
    const currentLocation = window.location.pathname + (window.location.search || '');
    if (href === currentLocation) {
      setTimeout(() => { window.location.reload(); }, 10);
      return true;
    }

    this.navigate(href, options);
  },

}, routesMap.methods));
