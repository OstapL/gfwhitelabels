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
      }, 'campaign_chunk');
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
          let modelData = [];
          data.data.forEach((d) => {
            modelData.push(new app.models.Company(d));
          });
          modelData = modelData.filter(d => !d.campaign.expired);
          data.data = modelData;

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

      }, 'campaign_chunk');
    },

    detail(name) {
      app.showLoading();

      require.ensure([], () => {
        const View = require('./views.js');
        $.when(
          api.makeCacheRequest(app.config.raiseCapitalServer + '/company', 'OPTIONS'),
          api.makeCacheRequest(app.config.raiseCapitalServer + '/' + name)
        ).done((companyFields, companyData) => {

          let model = new app.models.Company(companyData[0], companyFields[0]);
          let metaDescription = companyData[0].tagline + '. ';
          try {
            metaDescription += companyData[0].description.split('.')[0];
          } catch(e) {
          }

          document.title = companyData[0].short_name || companyData[0].name;
          document.head.querySelector('meta[name="description"]').content = metaDescription;

          document.head.querySelector('meta[property="og:title"]').content = companyData[0].short_name || companyData[0].name;
          document.head.querySelector('meta[property="og:description"]').content = metaDescription;
          document.head.querySelector('meta[property="og:image"]').content = model.campaign.getMainImage();
          document.head.querySelector('meta[property="og:url"]').content = window.location.href;
          // document.head.querySelector('meta[name="keywords"]').content = companyData[0].tagline.replace(/ /g,',');

          let i = new View.detail({
            model: model
          });
          i.render();
          $('body').scrollTo();
        });
      }, 'campaign_chunk');
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
      }, 'campaign_chunk');
    },
  },

  auth: ['investment', 'investmentThankYou']
};
