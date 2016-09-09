module.exports = Backbone.Router.extend({
    routes: {
        // Company Campaign URLS
        'company/create': 'companyCreate',
        'campaign/general_information/': 'campaignGeneralInformation',
        'campaign/general_information/:id': 'campaignGeneralInformation',
        'campaign/media/:id': 'campaignMedia',
        'campaign/team-members/:id/add/:type/:index': 'campaignTeamMembersAdd',
        'campaign/team-members/:id': 'campaignTeamMembers',
        'campaign/specifics/:id': 'campaignSpecifics',
        'campaign/perks/:id': 'campaignPerks',
    },

    companyCreate() {
        if(!app.user.is_anonymous()) {
            const model = require('components/company/models.js');
            const view = require('components/raisefunds/views.js');
            const campaignModel = require('components/campaign/models.js');

            // ToDo
            // Rebuild this
            var a1 = app.makeRequest(Urls['company-list']());
            var a2 = app.makeRequest(Urls['company-list'](), {}, 'OPTIONS');

            $.when(a1, a2).done((r1, r2) => {
                app.makeRequest(Urls['campaign-list']() + '/general_information')
                .then((campaign_data) => {
                    console.log('campaignis', campaign_data[0]);
                    $('body').scrollTo(); 
                    var i = new view.createOrUpdate({
                        el: '#content',
                        fields: r2.actions.POST,
                        model: new model.model(r1[0] || {}),
                        camp: Object.assign({}, campaign_data[0])
                    });

                    // ToDo
                    // Check if campaign are exists already
                    i.campaign = {};
                    app.hideLoading();
                    i.render();
                    //app.views.campaign[id].render();
                    //app.cache[window.location.pathname] = i.$el.html();

                }).fail(function(xhr, response, error) {
                    var $view = {
                        $el: $('#content'),
                        $: app.$
                    };
                    app.defaultSaveActions.error.call($view, xhr, response, error);
                });
            })
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignGeneralInformation(id) {
        if(!app.user.is_anonymous()) {
            const model = require('components/campaign/models.js');
            const view = require('components/raisefunds/views.js');

            if(id === null) {
                alert('please set up id or company_id');
                console.log('not goinng anywhere');
                return;
            }
            $('body').scrollTo(); 

            var a1 = app.makeRequest(Urls['campaign-list']() + '/general_information', {}, 'OPTIONS');
            var a2 = app.makeRequest(Urls['campaign-detail'](id));

            $.when(a1, a2).done((meta_data, model_data) => {
                debugger;
                var i = new view.generalInformation({
                    el: '#content',
                    fields: meta_data.actions.POST,
                    model: new model.model(model_data)
                });

                i.render();
                //app.views.campaign[id].render();
                //app.cache[window.location.pathname] = i.$el.html();

                app.hideLoading();
            }).fail((xhr, error) =>  {
                app.defaultSaveActions.error($('#content'), error);
                app.hideLoading();
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignMedia(id) {
        if(!app.user.is_anonymous()) {
            $('body').scrollTo(); 
            const model = require('components/campaign/models.js');
            const view = require('components/raisefunds/views.js');
            let campaign = new model.model({
                id: id
            });
            campaign.urlRoot += '/media'
            campaign.fetch();

            var a1 = campaign.fetch();
            var a2 = $.ajax(_.extend({
                url: campaign.urlRoot,
            }, app.defaultOptionsRequest));

            $.when(a1, a2).done((r1, r2) => {
                var i = new view.media({
                    el: '#content',
                    fields: r2[0].actions.POST,
                    model: campaign
                });
                i.render();
                //app.views.campaign[id].render();
                //app.cache[window.location.pathname] = i.$el.html();
                console.log('loaded');

                app.hideLoading();
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignTeamMembers(id) {
        if(!app.user.is_anonymous()) {
            $('body').scrollTo(); 
            const model = require('components/campaign/models.js');
            const view = require('components/raisefunds/views.js');

            let members = new model.model({
                id: id
            });
            members.urlRoot += '/team_members';
            var a1 = members.fetch();

            $.when(a1).done((r1) => {
                var i = new view.teamMembers({
                    el: '#content',
                    model: members,
                });
                i.render();
                //app.views.campaign[id].render();
                //app.cache[window.location.pathname] = i.$el.html();

                app.hideLoading();
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignTeamMembersAdd(id, type, index) {
        if(!app.user.is_anonymous()) {
            $('body').scrollTo(); 
            const model = require('components/campaign/models.js');
            const view = require('components/raisefunds/views.js');

            let members = new model.model({
                id: id
            });
            members.urlRoot += '/team_members';
            var a1 = members.fetch();

            $.when(a1).done((r1) => {
                const addForm = new view.teamMemberAdd({
                    el: '#content',
                    model: members,
                    type: type,
                    index: index
                });
                addForm.render();
                app.hideLoading();
            });

        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignSpecifics(id) {
        if(!app.user.is_anonymous()) {
            $('body').scrollTo(); 
            const model = require('components/campaign/models.js');
            const view = require('components/raisefunds/views.js');

            let campaign = new model.model({
                id: id
            });
            campaign.urlRoot += '/specifics'
            var a1 = campaign.fetch();
            var a2 = $.ajax(_.extend({
                    url: campaign.urlRoot,
                }, app.defaultOptionsRequest)
            );

            $.when(a1, a2).done((r1, r2) => {
                console.log(r1, r2);
                var i = new view.specifics({
                    el: '#content',
                    fields: r2[0].actions.POST,
                    model: campaign
                });
                i.render();
                //app.views.campaign[id].render();
                //app.cache[window.location.pathname] = i.$el.html();

                app.hideLoading();
            }).fail((xhr, error) =>  {
                app.defaultSaveActions.error.error($('#content'), error);
                app.hideLoading();
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignPerks(id) {
        if(!app.user.is_anonymous()) {
            $('body').scrollTo(); 
            const model = require('components/campaign/models.js');
            const view = require('components/raisefunds/views.js');

            let campaign = new model.model({
                id: id
            });
            campaign.urlRoot += '/perks';
            var a1 = campaign.fetch();
            var a2 = $.ajax(_.extend({
                    url: campaign.urlRoot,
                }, app.defaultOptionsRequest)
            );

            $.when(a1, a2).done((r1, r2) => {
                var i = new view.perks({
                    el: '#content',
                    fields: r2[0].actions.POST,
                    model: campaign
                });
                i.render();
                //app.views.campaign[id].render();
                //app.cache[window.location.pathname] = i.$el.html();

                app.hideLoading();
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },    
})
