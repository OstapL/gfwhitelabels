//TODO: move helpers to app.js
const helpers = require('./helpers.js');
const GENERAL = require('consts/general.json');

module.exports = {
  routes: {
    ':name/:investmentId/invest-thanks': 'investmentThankYou',
    'companies': 'list',
    ':name': 'detail',
    ':name/invest': 'investment',
  },
  methods: {
    investmentThankYou(companyName, investmentId) {
      require.ensure([], () => {
        api.makeRequest(app.config.investmentServer + '/' + investmentId).done((data) => {
          data.id = investmentId;
          const View = require('./views.js');
          let i = new View.investmentThankYou({
            model: new app.models.Company(data),
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

        app.setMeta({
          name: 'keywords',
          content: 'local investing equity crowdfunding GrowthFountain is focused ' +
            'on local investing. Find the perfect fit for your investment with our equity ' +
            'crowdfunding setup by clicking here.'
        });

      });
    },

    detail(name) {
      app.showLoading();

      require.ensure([], () => {
        const View = require('./views.js');
        $.when(
          api.makeCacheRequest(app.config.raiseCapitalServer + '/company', 'OPTIONS'),
          api.makeCacheRequest(app.config.raiseCapitalServer + '/' + name)
        ).done((companyFields, companyData) => {

          document.title = companyData[0].short_name || companyData[0].name;
          document.head.querySelector('meta[name="description"]').content = companyData[0].tagline + '. ' + companyData[0].description.split('.')[0];
          // document.head.querySelector('meta[name="keywords"]').content = companyData[0].tagline.replace(/ /g,',');

          let i = new View.detail({
            model: new app.models.Company(companyData[0], companyFields[0]),
          });
          i.render();
          $('body').scrollTo();
        });
      });
    },

    investment(name) {
      require.ensure([], () => {
        const View = require('./views.js');
        let investmentR = api.makeCacheRequest(app.config.investmentServer + '/', 'OPTIONS');
        let companyR = api.makeCacheRequest(app.config.raiseCapitalServer + '/' + name);

        // TODO
        // Do we really need this ?
        let userR = api.makeCacheRequest(app.config.authServer + '/rest-auth/data');

        $.when(investmentR, companyR, userR).done((investmentMeta, companyData, userData) => {
          Object.assign(app.user.data, userData[0]);
          const i = new View.investment({
            model: new app.models.Company(companyData[0], investmentMeta[0].fields),
            user: userData[0],
            fields: investmentMeta[0].fields,
          });
          i.render();
          $('body').scrollTo();
          app.hideLoading();
        });

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

  auth: ['investment', 'investmentThankYou']
};
