const helpers = require('./helpers.js');

//TODO: move this to common method in main router
// execute: function (callback, args, name) {
//   if (callback)
//     callback.apply(this, args);
//   else
//     alert('Not such url');
// },

module.exports = {
  routes: {
    ':id/invest-thanks': 'investmentThankYou',
    'companies': 'list',
    ':name': 'detail',
    ':name/invest': 'investment',
  },
  methods: {
    investmentThankYou(id) {
      //TODO: move this to common code
      if (!app.user.ensureLoggedIn(window.location.pathname))
        return false;

      api.makeRequest(investmentServer + '/' + id).done((data) => {
        data.id = id;
        const View = require('./views.js');
        let i = new View.investmentThankYou({
          model: data,
        });
        i.render();
        app.hideLoading();
      });
    },

    list() {
      const View = require('./views.js');
      let params = '?limit=6';
      let page = parseInt(app.getParams().page);
      let offset = ((page > 0) ? page : 1) - 1;
      if (offset) params += '&offset=' + (offset * 6);
      let orderBy = app.getParams().orderby;
      if (orderBy) params += '&orderby=' + orderBy;
      api.makeCacheRequest(raiseCapitalServer + params).then((data) => {
        let i = new View.list({
          el: '#content',
          collection: data,
        });
        $('body').scrollTo();
        i.render();
        app.hideLoading();
      });
      const meta = '<meta name="keywords" ' +
        'content="local investing equity crowdfunding GrowthFountain is focused ' +
        'on local investing. Find the perfect fit for your investment with our equity ' +
        'crowdfunding setup by clicking here."></meta>';
      $(document.head).append(meta);
    },

    detail(name) {
      const View = require('./views.js');

      api.makeCacheRequest(raiseCapitalServer + '/' + name).
      then((companyData) => {
        let i = new View.detail({
          model: companyData,
        });
        i.render();
        if (location.hash && $(location.hash).length) {
          setTimeout(() => {
            $(location.hash).scrollTo(65);
          }, 100);
        } else {
          $('#content').scrollTo();
        }

        app.hideLoading();
      });
    },

    investment(name) {
      if (!app.user.ensureLoggedIn(window.location.pathname))
        return false;

      if (!app.user.is_anonymous()) {
        const View = require('./views.js');
        let investmentR = api.makeCacheRequest(investmentServer + '/', 'OPTIONS');
        let companyR = api.makeCacheRequest(raiseCapitalServer + '/' + name);

        // TODO
        // Do we really need this ?
        let userR = api.makeCacheRequest(authServer + '/rest-auth/data');

        $.when(investmentR, companyR, userR).done((investmentMeta, companyData, userData) => {
          const i = new View.investment({
            model: companyData[0],
            user: userData[0],
            fields: investmentMeta[0].fields,
          });
          i.render();
          $('#content').scrollTo();
          app.hideLoading();
        });
      } else {
        app.routers.navigate('/account/login', { trigger: true, replace: true });
      }

      //TODO: fixme
      // if (!window.pdfMake) {
      //   ['/js/pdfmake.js', '/js/vfs_fonts.js'].forEach( (uri) => {
      //     let script = document.createElement('script');
      //     script.type = 'text/javascript';
      //     script.src = uri;
      //     $('head').append(script);
      //   });
      // }
    },
  },
};
