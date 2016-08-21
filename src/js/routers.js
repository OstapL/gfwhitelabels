
let appRoutes = Backbone.Router.extend({
    routes: {
      '': 'mainPage',
      'api/campaign': 'campaignList',
      'api/campaign/:id': 'campaignDetail',
      'api/campaign/:id/invest': 'campaignInvestment',
      'sketches/:name': 'sketches',
      'pg/:name': 'pagePG',
      'page/:id/': 'pageDetail',
      'page/:id': 'pageDetail',
      'account/profile': 'accountProfile',
      'company/create': 'companyCreate',
      'campaign/general_information/:id': 'campaignGeneralInformation',
      'campaign/media/:id': 'campaignMedia',
      'campaign/team_members/:id': 'campaignTeamMembers',
      'campaign/specifics/:id': 'campaignSpecifics',
      'campaign/perks/:id': 'campaignPerks',
      'account/login': 'login',
      'account/signup': 'login',
      'account/logout': 'logout',
      'account/dashboard/issuer': 'dashboardIssuer',
      'account/dashboard/investor': 'dashboardInvestor',
    },
    back: function(event) {
        var url = event.target.pathname;
        if(app.cache.hasOwnProperty(event.target.pathname) == false) {
            window.history.back();
        } else {
            $('#content').html(app.cache[event.target.pathname]);
            app.routers.navigate(
                event.target.pathname,
                {trigger: false, replace: false}
            );
        }
        app.hideLoading();
    },

    sketches: function(name) {

        let templateName = 'sketches' + name.charAt(0).toUpperCase() + name.slice(1);
        $('#content').append(
            window[templateName]({
                serverUrl: serverUrl,
                Urls: Urls,
            })
        );
        app.hideLoading();
    },

    campaignList: function() {
        let model = require('models/campaign');
        let view = require('views/campaign');

        app.collections.campaigns = new model.collection();
        app.collections.campaigns.fetch({
            success: (collection, response, options) => {

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
    },

    campaignDetail: function(id) {
        let model = require('models/campaign');
        let view = require('views/campaign');

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
    },

    campaignInvestment: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let investModel = require('models/investment');
            let view = require('views/campaign');

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
    },

    accountProfile: function() {
        if(!app.user.is_anonymous()) {
            let view = require('views/user');

            $.ajax(_.extend({
                    url: serverUrl + Urls['rest_user_details'](),
                }, app.defaultOptionsRequest)
            ).done((response) => {
                var i = new view.profile({
                    el: '#content',
                    model: app.user,
                    fields: response.actions.PUT
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

    companyCreate: function() {
        if(!app.user.is_anonymous()) {
            //let model = require('models/company');
            let view = require('views/company');

            app.user.getCompany((company) => {
                console.log('hello done');
                console.log(app.defaultOptionsRequest);
                $.ajax(_.extend({
                        url: company.urlRoot,
                    }, app.defaultOptionsRequest)
                ).done((response) => {
                    console.log('hello done 2');
                    var i = new view.createOrUpdate({
                        el: '#content',
                        fields: response.actions.POST,
                        model: company
                    });
                    i.render();
                    //app.views.campaign[id].render();
                    //app.cache[window.location.pathname] = i.$el.html();

                    app.hideLoading();
                }).fail(app.DefaultSaveActions.error);
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignGeneralInformation: function(company_id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');

            let campaign = new model.model({
                company: company_id
            });
            campaign.urlRoot += '/general_information'
            $.ajax(_.extend({
                url: campaign.urlRoot,
            }, app.defaultOptionsRequest)).
                done((response) => {
                var i = new view.generalInformation({
                    el: '#content',
                    fields: response.actions.POST,
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

    campaignMedia: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');
            let campaign = new model.model({
                id: id
            });
            campaign.urlRoot += '/media'
            campaign.fetch();
            $.ajax(_.extend({
                    url: campaign.urlRoot,
                }, app.defaultOptionsRequest)
            ).done((response) => {
                var i = new view.media({
                    el: '#content',
                    fields: response.actions.POST,
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

    campaignTeamMembers: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');

            let campaign = new model.model({
                id: id
            });
            campaign.urlRoot += '/team_members'
            campaign.fetch();

            $.ajax(_.extend({
                    url: campaign.urlRoot,
                }, app.defaultOptionsRequest)
            ).done((response) => {
                var i = new view.teamMembers({
                    el: '#content',
                    fields: response.actions.POST,
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

    campaignSpecifics: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');

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
                app.DefaultSaveActions.error($('#content'), error);
                app.hideLoading();
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignPerks: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');

            let campaign = new model.model({
                id: id
            });
            campaign.urlRoot += '/perks';
            campaign.fetch();

            $.ajax(_.extend({
                    url: campaign.urlRoot,
                }, app.defaultOptionsRequest)
            ).done((response) => {
                var i = new view.perks({
                    el: '#content',
                    fields: response.actions.POST,
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

    issuerDashboard: function() {
        var i = new view.profile({
            el: '#content',
            user: app.user.toJSON(),
            template: template.profile,
        });
        i.render();
        //app.views.campaign[id].render();
        app.cache[window.location.pathname] = i.$el.html();

        app.hideLoading();
    },

    investorDashboard: function() {
        var i = new view.profile({
            el: '#content',
            user: app.user.toJSON(),
            template: template.profile,
        });
        i.render();
        //app.views.campaign[id].render();
        app.cache[window.location.pathname] = i.$el.html();

        app.hideLoading();
    },

    pagePG: function(name) {
        console.log(name);
        let view = require('templates/' + name + '.pug');
        $('#content').html(view({
                Urls: Urls,
                serverUrl: serverUrl
            }
        ));
        app.hideLoading();
    },


    pageDetail: function(id) {
        let model = require('models/page');
        let view = require('views/page');
        console.log('hello page detail');

        let element = new model.model({
            id: id
        });

        let collection = new model.collection()

        element.fetch({
            success: (response) => {
                collection.fetch({
                    success: (response) => {
                        app.models.page[id] = model;
                        app.views.page[id] = new view.detail({
                            el: '#content',
                            model: element,
                            related_pages: collection.toJSON(),
                        });
                        app.views.page[id].render();
                        app.cache[window.location.pathname] = app.views.page[id].$el.html();

                        app.hideLoading();
                }
                });
            }
        });
    },

    mainPage: function(id) {
        let pageModel = require('models/page');
        let pageView = require('views/page');
        let template = require('templates/mainPage.pug');
        
        app.cache[window.location.pathname] = template();
        $('#content').html(template());
        app.hideLoading();

    },

    login: function(id) {
        let view = require('views/user');
        var a1 = $.ajax(_.extend({
                url: serverUrl + Urls['rest_login'](),
            }, app.defaultOptionsRequest));
        var a2 = $.ajax(_.extend({
                url: serverUrl + Urls['rest_register'](),
            }, app.defaultOptionsRequest));
        $.when(a1, a2).done((r1, r2) => {
            let loginView = new view.login({
                el: '#content',
                login_fields: r1[0].actions.POST,
                register_fields: r2[0].actions.POST,
                model: new userModel(),
            })
            loginView.render();
            app.cache[window.location.pathname] = loginView.$el.html();
            app.hideLoading();
        }).fail((xhr, error) =>  {
            // ToDo
            // Show global error message
            console.log('cant get fields ');
            console.log(xhr, error);
            app.hideLoading();
        });
    },

    logout: function(id) {
        // ToDo
        // Do we really want have to wait till user will be ready ?
        app.user.logout();
        app.on('userLogout', function() {
            window.location = '/';
        });
    },
});

app.on('userLoaded', function(data){

    app.routers = new appRoutes();
    app.user.url = serverUrl + Urls['rest_user_details']();
    // if user is not authenticated - add login/sign up popup
    if(data.id == '') {
        $('body').after(
            `  <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
<div class="modal-dialog" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title" id="loginModalLabel">Login</h4>
    </div>
    <div class="modal-body">
      <form>
        <div class="clearfix"><div class="form-group row email"><div class="col-lg-3 col-md-3 text-md-right"><label for="email">email</label></div><div class="col-lg-7 col-md-7"><input class="form-control" id="email" name="email" placeholder="email" type="email" value=""><span class="help-block"> </span></div></div><div class="form-group row password"><div class="col-lg-3 col-md-3 text-md-right"><label for="password">password</label></div><div class="col-lg-7 col-md-7"><input class="form-control" id="password" name="password" placeholder="password" type="password" value=""><span class="help-block"> </span></div></div><div class="socialaccount_ballot clearfix"><div class="col-lg-12 col-sm-12 col-xs-12 text-sm-left"><p>Or login with</p></div><div class="col-sm-12 col-xs-12 col-lg-12"><ul class="social-icons list-inline clearfix text-lg-left"><li><a class="fa fa-facebook social-icon-color facebook" data-original-title="facebook" href="/accounts/facebook/login/?process=login"> </a></li><li><a class="fa fa-google-plus social-icon-color googleplus" data-original-title="Google Plus" href="/accounts/google/login/?process=login"></a></li><li><a class="fa fa-linkedin social-icon-color linkedin" data-original-title="Linkedin" href="/accounts/linkedin_oauth2/login/?process=login"></a></li></ul></div></div></div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary">Login</button>
    </div>
  </div>
</div>
</div>
`
        )
    }

    let menu = require('views/menu');

    app.menu = new menu.menu({
        el: '#menuList',
    });
    app.menu.render();

    app.notification = new menu.notification({
        el: '#menuNotification',
    });
    app.notification.render();

    app.profile = new menu.profile({
        el: '#menuProfile',
    });
    app.profile.render();
    app.trigger('menuReady');

    app.routers.navigate(
        window.location.pathname + '#',
        {trigger: true, replace: true}
    );
    console.log('user ready');
});

$(document).ready(function(){
    // show bottom logo while scrolling page

    $(window).scroll(function(){
        var $bottomLogo = $('#fade_in_logo'),
            offsetTopBottomLogo = $bottomLogo.offset().top;

        if (($(window).scrollTop() + $(window).height() >= offsetTopBottomLogo) && !$bottomLogo.hasClass('fade-in') ) {
            $bottomLogo.addClass('fade-in');
        }
    });
});
