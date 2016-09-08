module.exports = Backbone.Router.extend({
    routes: {
        'api/campaign': 'campaignList',
        'api/campaign/:id': 'campaignDetail',
        'api/campaign/:id/invest': 'campaignInvestment',
    },

    campaignList: function() {
        require.ensure([], () => {
            const model = require('./models.js');
            const view = require('./views.js');

            app.collections.campaigns = new model.collection();
            app.collections.campaigns.fetch({
                success: (collection, response, options) => {

                    $('body').scrollTo(); 
                    $('#content').html('');
                    app.views.campaigns = new view.list({
                        el: '#content',
                        collection: collection,
                    });
                    app.views.campaigns.render();

                    setTimeout(() => {
                        app.cache[window.location.pathname] = app.views.campaigns.$el.html();
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
                    if(response.responseJSON.detail == 'Invalid token.') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.reload();
                    }
                },
            });

        });
    },

    campaignDetail: function(id) {
        require.ensure([], () => {
            const model = require('./models.js');
            const view = require('./views.js');

            app.getModel('campaign', model.model, id, function(model) {
                app.views.campaign[id] = new view.detail({
                    el: '#content',
                    model: model,
                });
                app.views.campaign[id].render();
                //app.cache[window.location.pathname] = app.views.campaign[id].$el.html();
                $('#content').scrollTo();

                app.hideLoading();
            });
        })
    },

    campaignInvestment: function(id) {
        require.ensure([], () => {
            if(!app.user.is_anonymous()) {
                const model = require('./models.js');
                //const investModel = require('../investment/models.js');
                const view = require('./views.js');

                app.getModel('campaign', model.model, id, function(campaignModel) {
                    $.ajax(_.extend({
                            url: serverUrl + Urls['investment-list'](),
                    }, app.defaultOptionsRequest)).done((response) => {
                        var i = new view.investment({
                            el: '#content',
                            model: new investModel.model(),
                            campaignModel: campaignModel,
                            fields: response.actions.POST
                        });
                        i.render();
                        //app.cache[window.location.pathname] = app.views.campaign[id].$el.html();
                        $('#content').scrollTo();

                        app.hideLoading();
                    })
                });
            } else {
                app.routers.navigate(
                    '/account/login',
                    {trigger: true, replace: true}
                );
            }
        });
    },
});
