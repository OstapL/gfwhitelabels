module.exports = Backbone.Router.extend({
  routes: {
    'api/campaign': 'list',
    'api/campaign/:id': 'detail',
    'api/campaign/:id/invest': 'investment',
  },

  list() {
    require.ensure([], () => {
      const Model = require('./models.js');
      const View = require('./views.js');
      const campaigns = new Model.collection();

      campaigns.fetch({
        success: (collection, response, options) => {

          $('body').scrollTo(); 
          $('#content').html('');
          const i = new View.list({
            el: '#content',
            collection: collection,
          });
          i.render();

          setTimeout(() => {
            app.cache[window.location.pathname] = i.$el.html();
          }, 500);

          /*
             let filterView = new CampaignFilterView();
             filterView.render();

             $('#content').append(_.template($('#campaignListT').html())());

             collection.forEach(function(model) {
             let campaignView = new CampaignListView({
             model: model,
             template: campaignItemListT,
             });
             campaignView.render();
             });
          */
          app.hideLoading();
        },
        error: (model, response, options) => {
          // ToDo
          // Move that check to global check
          if (response.responseJSON.detail == 'Invalid token.') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
          }
        },
      });

    });
  },

  detail(id) {
    require.ensure([], () => {
      const Model = require('./models.js');
      const View = require('./views.js');

      api.makeCacheRequest(Urls['campaign-detail'](id)).
        then((modelData) => {
          let i = new View.detail({
            el: '#content',
            model: new Model.model(modelData),
          });
          i.render();
          $('#content').scrollTo();
          app.hideLoading();
      });
    })
  },

  investment(id) {
    require.ensure([], () => {
      if (!app.user.is_anonymous()) {
        const Model = require('./models.js');
        //const investModel = require('../investment/models.js');
        const View = require('./views.js');

        api.makeCacheRequest(Urls['investment-list'](), 'OPTIONS').
          then((metaData) => {
            var i = new View.investment({
              el: '#content',
                model: new Backbone.Model(),
                campaignModel: campaignModel,
                fields: metaData.actions.POST
            });
            i.render();
            //app.cache[window.location.pathname] = app.views.campaign[id].$el.html();
            $('#content').scrollTo();
            app.hideLoading();
          })
        } else {
          app.routers.navigate(
            '/account/login', {trigger: true, replace: true}
          );
        }
    });
  },
});
