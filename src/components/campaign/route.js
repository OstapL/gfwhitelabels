//TODO: move helpers to app.js
const helpers = require('./helpers.js');
const GENERAL = require('consts/general.json');

module.exports = {
  routes: {
    ':id/invest-thanks': 'investmentThankYou',
    'companies': 'list',
    ':name': 'detail',
    ':name/invest': 'investment',
  },
  methods: {
    investmentThankYou(id) {
      require.ensure([], () => {
        //TODO: move this to common code
        if (!app.user.ensureLoggedIn(window.location.pathname))
          return false;

        api.makeRequest(app.config.investmentServer + '/' + id).done((data) => {
          data.id = id;
          const View = require('./views.js');
          let i = new View.investmentThankYou({
            model: data,
          });
          i.render();
          app.hideLoading();
        });
      });
    },

    list() {
      require.ensure([], () => {
        const View = require('./views.js');
        let params = '?limit=' + GENERAL.COMPANIES_PER_PAGE;
        let page = parseInt(app.getParams().page);
        let offset = ((page > 0) ? page : 1) - 1;
        if (offset) params += '&offset=' + (offset * GENERAL.COMPANIES_PER_PAGE);
        let orderBy = app.getParams().orderby;
        if (orderBy) params += '&orderby=' + orderBy;
        api.makeCacheRequest(app.config.raiseCapitalServer + params).then((data) => {
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
      });
    },

    detail(name) {
      require.ensure([], () => {
        const View = require('./views.js');

        $.when(
          api.makeCacheRequest(app.config.raiseCapitalServer + '/company', 'OPTIONS'),
          api.makeCacheRequest(app.config.raiseCapitalServer + '/' + name)
        ).done((companyFields, companyData) => {
          let i = new View.detail({
            model: new app.models.Company('', companyData[0], companyFields[0]),
          });
          i.render();
          if (location.hash && $(location.hash).length) {
            setTimeout(() => {
              $(location.hash).scrollTo(65);
            }, 300);
          } else {
            $('body').scrollTo();
          }

          app.hideLoading();
        });
      });
    },

    investment(name) {
      require.ensure([], () => {
        if (!app.user.ensureLoggedIn(window.location.pathname))
          return false;

        if (!app.user.is_anonymous()) {
          const View = require('./views.js');
          let investmentR = api.makeCacheRequest(app.config.investmentServer + '/', 'OPTIONS');
          let companyR = api.makeCacheRequest(app.config.raiseCapitalServer + '/' + name);

          // TODO
          // Do we really need this ?
          let userR = api.makeCacheRequest(app.config.authServer + '/rest-auth/data');

          $.when(investmentR, companyR, userR).done((investmentMeta, companyData, userData) => {
            Object.assign(app.user.data, userData[0]);
            const i = new View.investment({
              model: companyData[0],
              user: userData[0],
              fields: investmentMeta[0].fields,
            });
            i.render();
            $('body').scrollTo();
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
      });
    },
  },
};
