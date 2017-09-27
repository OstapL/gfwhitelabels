const authPages = ['success-guide', 'advertising'];

const historicalTemplates = {
  'investorquestions': 'investor-questions',
  'entrepreneurquestions': 'entrepreneur-questions',
};

module.exports = {
  routes: {
    '': 'mainPage',
    'pg/:name': 'pagePG',
    'subscription-thanks': 'subscriptionThanks',
    'scrapper/unsubscribe': 'scrapperUnsubscribe',
  },
  methods: {
    mainPage() {
      require.ensure([], (require) => {
        const Views = require('src/components/pg/views.js');

        api.makeCacheRequest(app.config.raiseCapitalServer + '?limit=6').then((data) => {
          data.data = data.data.map(c => new app.models.Company(c));
          app.currentView = new Views.main({ collection: data, });
          app.currentView.render();
          $('body').scrollTo();
          app.hideLoading();
        });
      }, 'main_page_chunk');
    },

    pagePG: function (name) {
      if (historicalTemplates[name])
        return window.location = `/pg/${historicalTemplates[name]}`;

      require.ensure([], (require) => {
        //TODO: move this to common router ensure logged in
        if (authPages.includes(name) && !app.user.ensureLoggedIn(window.location.pathname))
          return false;

        const Views = require('./views.js');

        app.currentView = Views.createView(name);
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'pg_chunk');
    },

    subscriptionThanks() {
      const pageType = {
        urgent: '1',
      };

      require.ensure([], (require) => {
        const Views = require('./views.js');

        const template = app.getParams().type == pageType.urgent
          ? require('./templates/subscription-thanks-urgent.pug')
          : require('./templates/subscription-thanks.pug');

        app.currentView = new Views.subscriptionThanks({ template });
        app.currentView.render();

        $('body').scrollTo();
        app.hideLoading();
      }, 'pg_chunk');
    },

		scrapperUnsubscribe: function () {

      require.ensure([], (require) => {

        const Views = require('./views.js');

        app.currentView = Views.createView('scrapper-unsubscribe');
        app.currentView.render();
        $('body').scrollTo();
        app.hideLoading();
      }, 'pg_chunk');
    },

  },
};
