//TODO: move helpers to app.js
const helpers = require('./helpers.js');
const GENERAL = require('consts/general.json');

module.exports = {
  routes: {
    ':name/:investmentId/invest-thanks': 'investmentThankYou',
    'companies': 'list',
    ':name': 'detail',
    ':name/invest-thanks-share': 'investThanksShareDetail',
    ':name/invest': 'investment',
    ':slug/esignature/:pdfType': 'previewPdf',
  },
  methods: {
    investmentThankYou(companyName, investmentId) {
      require.ensure([], () => {
        api.makeRequest(app.config.investmentServer + '/' + investmentId).done((data) => {
          data.id = investmentId;
          const View = require('./views.js');
          app.currentView = new View.investmentThankYou({
            model: new app.models.Company(data),
          });
          app.currentView.render();
          app.hideLoading();
        });
      }, 'campaign_chunk');
    },

    investThanksShareDetail(name) {
      app.showLoading();
      this.detail(name, 'share');
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
          modelData = modelData.filter(d => !(d.campaign.expired && d.is_approved >= 6) && !d.isClosed());
          data.data = modelData;

          app.currentView = new View.list({
            el: '#content',
            collection: data,
          });
          $('body').scrollTo();
          app.currentView.render();
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

    detail(name, params) {
      app.showLoading();

      require.ensure([], () => {
        const View = require('./views.js');
        $.when(
          api.makeCacheRequest(app.config.raiseCapitalServer + '/company', 'OPTIONS'),
          api.makeCacheRequest(app.config.raiseCapitalServer + '/' + name)
        ).done((companyFields, companyData) => {
          const model = new app.models.Company(companyData[0], companyFields[0]);
          let metaDescription = model.tagline + '. ';
          const dotIdx = model.description ? model.description.indexOf('.') : 0;
          if (dotIdx > 0)
            metaDescription += model.description.substring(0, dotIdx);

          const companyName = companyData[0].short_name || companyData[0].name;

          document.title = companyName;
          document.head.querySelector('meta[name="description"]').content = metaDescription;

          const getShareTags = () => {
            if (params === 'share') {
              const siteName = window.location.host.replace(/growthfountain/i, 'GrowthFountain');

              const title = `Everyone’s doing it! I just invested in ${companyName} on ${siteName}`;
              const description = model.description;
              const url = `${window.location.origin}/${(model.slug || model.id)}`;
              const image = model.campaign.getMainImage();

              return { title, description, url, image };
            }

            const title = companyName;
            const description = metaDescription;
            const image = model.campaign.getMainImage();
            const url = window.location.href;

            return { title, description, url, image };
          };

          const tags = getShareTags();

          document.head.querySelector('meta[property="og:title"]').content = tags.title;
          document.head.querySelector('meta[property="og:description"]').content = tags.description;
          document.head.querySelector('meta[property="og:image"]').content = tags.image;
          document.head.querySelector('meta[property="og:url"]').content = tags.url;

          app.currentView = new View.detail({
            model: model
          });
          app.currentView.render();
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
          app.currentView = new View.investment({
            model: new app.models.Company(companyData[0], investmentMeta[0].fields),
            user: userData[0],
            fields: investmentMeta[0].fields,
          });
          app.currentView.render();
          $('body').scrollTo();
          app.hideLoading();
          app.analytics.emitEvent(app.analytics.events.InvestmentClicked, app.user.stats);
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

    previewPdf(slug, pdfType) {
      app.showLoading();

			function base64Encode(str) {
	        var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	        var out = "", i = 0, len = str.length, c1, c2, c3;
					while (i < len) {
						c1 = str.charCodeAt(i++) & 0xff;
						if (i == len) {
							out += CHARS.charAt(c1 >> 2);
							out += CHARS.charAt((c1 & 0x3) << 4);
							out += "==";
							break;
						}
						c2 = str.charCodeAt(i++);
						if (i == len) {
							out += CHARS.charAt(c1 >> 2);
							out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
							out += CHARS.charAt((c2 & 0xF) << 2);
							out += "=";
							break;
						}
						c3 = str.charCodeAt(i++);
						out += CHARS.charAt(c1 >> 2);
						out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
						out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
						out += CHARS.charAt(c3 & 0x3F);
					}
					return out;
			}

      require.ensure([], () => {
        const View = require('./views.js');
        $.when(
          api.makeRequest(
              app.config.esignServer + '/preview/' + slug + '/' + pdfType + window.location.search,
              "GET",
              {},
              {
                dataType: "text",
                contentType: "application/text",
                mimeType: "text/plain; charset=x-user-defined"
              },
          )
        ).done((rawData) => {

          const iframe = document.createElement('iframe');
          document.title = slug + ' esignature';
          document.body.appendChild(iframe);
          iframe.setAttribute('style', "position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;");
          iframe.setAttribute('src', "data:application/pdf;base64," + base64Encode(rawData));

          $('body').scrollTo();
          app.hideLoading();
        });
      }, 'campaign_chunk');
    },


  },

  auth: ['investment', 'investmentThankYou', 'previewPdf',]
};
