
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
      'company/create': 'companyCreate',
      'campaign/general_information/': 'campaignGeneralInformation',
      'campaign/general_information/:id': 'campaignGeneralInformation',
      'campaign/media/:id': 'campaignMedia',
      'campaign/team_members/:id/add/:type/:index': 'campaignTeamMembersAdd',
      'campaign/team_members/:id': 'campaignTeamMembers',
      'campaign/specifics/:id': 'campaignSpecifics',
      'campaign/perks/:id': 'campaignPerks',
      'account/profile': 'accountProfile',
      'account/login': 'login',
      'account/signup': 'signup',
      'account/logout': 'logout',
      'account/facebook/login/': 'loginFacebook',
      'account/google/login/': 'loginGoogle',
      'account/linkedin/login/': 'loginLinkedin',
      'account/finish/login/': 'finishSocialLogin',
      'account/dashboard/issuer': 'dashboardIssuer',
      'account/dashboard/investor': 'dashboardInvestor',
      'calculator/paybackshare/step-1': 'calculatorPaybackshareStep1',
      'calculator/paybackshare/step-2': 'calculatorPaybackshareStep2',
      'calculator/paybackshare/step-3': 'calculatorPaybackshareStep3',
        
      'calculator/capitalraise/intro': 'calculatorCapitalraiseIntro',
      'calculator/capitalraise/step-1': 'calculatorCapitalraiseStep1',
      'calculator/capitalraise/finish': 'calculatorCapitalraiseFinish'
    },
    back: function(event) {
        var url = event.target.pathname;
        $('#content').undelegate();
        $('form').undelegate();
        if(app.cache.hasOwnProperty(event.target.pathname) == false) {
            window.history.back();
            app.routers.navigate(
                event.target.pathname,
                {trigger: true, replace: false}
            );
        } else {
            $('#content').html(app.cache[event.target.pathname]);
            app.routers.navigate(
                event.target.pathname,
                {trigger: false, replace: false}
            );
        }
        app.hideLoading();
    },

    calculatorPaybackshareStep1() {
        let Model = require('models/calculators/paybackshare');
        let View = require('views/calculator/paybackshare/step1');

        new View({
            model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
        }).render();

        app.hideLoading();
    },

    calculatorPaybackshareStep2: function() {
        let Model = require('models/calculators/paybackshare');
        let View = require('views/calculator/paybackshare/step2');

        new View({
            model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
        }).render();
        
        app.hideLoading();
    },

    calculatorPaybackshareStep3: function() {
        let Model = require('models/calculators/paybackshare');
        let View = require('views/calculator/paybackshare/step3');

        new View({
            model: app.getModelInstance(Model, 'calculatorPaybackshare').setFormattedPrice()
        }).render();

        app.hideLoading();
    },

    calculatorCapitalraiseIntro() {
        let Model = require('models/calculators/capitalraise');
        let View = require('views/calculator/capitalraise/intro');

        new View({
            model: app.getModelInstance(Model, 'calculatorCapitalraise').setFormattedPrice()
        }).render();

        app.hideLoading();
    },

    calculatorCapitalraiseStep1() {
        let Model = require('models/calculators/capitalraise');
        let View = require('views/calculator/capitalraise/step1');

        new View({
            model: app.getModelInstance(Model, 'calculatorCapitalraise').setFormattedPrice()
        }).render();

        app.hideLoading();
    },

    calculatorCapitalraiseFinish() {
        let Model = require('models/calculators/capitalraise');
        let View = require('views/calculator/capitalraise/finish');

        new View({
            model: app.getModelInstance(Model, 'calculatorCapitalraise').setFormattedPrice()
        }).render();

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

            // ToDo
            // Rebuild this
            app.user.getCompany((company) => {
                var optionsAjax = $.ajax(_.extend({
                        url: company.urlRoot,
                    }, app.defaultOptionsRequest)
                );
                var params = _.extend({
                    url: serverUrl + '/api/campaign/general_information?company_id=' + company.id,
                }, app.defaultOptionsRequest);
                params.type = 'GET';

                var campaignAjax = $.ajax(params);

                $.when(optionsAjax, campaignAjax).done((rOptions, rCampaignList) => {
                    console.log(rCampaignList);
                    var i = new view.createOrUpdate({
                        el: '#content',
                        fields: rOptions[0].actions.POST,
                        model: company,
                        campaign: rCampaignList[0][0]
                    });
                    i.render();
                    //app.views.campaign[id].render();
                    //app.cache[window.location.pathname] = i.$el.html();

                    app.hideLoading();
                }).fail(function(xhr, response, error) {
                    console.log(arguments);
                    var $view = {
                        $el: $('#content'),
                        $: app.$
                    };
                    app.DefaultSaveActions.error.call($view, xhr, response, error);
                });
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },

    campaignGeneralInformation: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');

            let company_id = app.getParams().company_id;

            if(id === null && typeof company_id === 'undefined') {
                alert('please set up id or company_id');
                console.log('not goinng anywhere');
                return;
            }
            let campaign = '';
            console.log('company_id is ', company_id);
            if(id.indexOf('=') == -1) {
                campaign = new model.model({
                    id: id
                });
                campaign.urlRoot += '/general_information'
                // ToDo
                // Make it sync
            } else {
                campaign = new model.model();
                campaign.urlRoot += '/general_information?company_id=' + company_id
            }

            var a1 = campaign.fetch();
            var a2 = $.ajax(_.extend({
                url: campaign.urlRoot,
            }, app.defaultOptionsRequest));

            $.when(a1, a2).done((r1, r2) => {
                var i = new view.generalInformation({
                    el: '#content',
                    fields: r2[0].actions.POST,
                });
                if(id.indexOf('=') == -1) {
                    i.model = campaign;
                } else {
                    i.model = new model.model(r1[0][0]);
                    i.model.set('company', company_id);
                }

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

    campaignMedia: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');
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

    campaignTeamMembers: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');

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

    campaignTeamMembersAdd: function(id, type, index) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let view = require('views/campaign');

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
            });
            loginView.render();
            app.hideLoading();
        }).fail((xhr, error) => {
            // ToDo
            // Show global error message
            console.log('cant get fields ');
            console.log(xhr, error);
            app.hideLoading();
        });
    },

    signup: function(id) {
        let view = require('views/user');
        var a2 = $.ajax(_.extend({
                url: serverUrl + Urls['rest_register'](),
            }, app.defaultOptionsRequest));
        $.when(a2).done((r2) => {
            console.log(r2);
            let signView = new view.signup({
                el: '#content',
                register_fields: r2.actions.POST,
                model: new userModel(),
            });
            signView.render();
            app.hideLoading();
        }).fail((xhr, error) => {
            // ToDo
            // Show global error message
            console.log('cant get fields ');
            console.log(xhr, error);
            app.hideLoading();
        });
    },

    loginFacebook: function() {

        let socialAuth = require('views/social-auth');
        let hello = require('hellojs');

        hello('facebook').login({
            scope: 'public_profile,email'}).then(
            function (e) {
                var sendToken = socialAuth.sendToken('facebook', e.authResponse.access_token);

                $.when(sendToken).done(function (data) {
                    localStorage.setItem('token', data.key);
                    window.location = '/account/profile';
                });
            },
            function (e) {

                // TODO: notificate user about reason of error;
                app.routers.navigate(
                    '/account/login',
                    {trigger: true, replace: true}
                );
            });

    },

    loginLinkedin: function() {

        let socialAuth = require('js/views/social-auth.js');
        let hello = require('hellojs');

        hello('linkedin').login({
            scope: 'r_basicprofile,r_emailaddress',}).then(
            function (e) {
                var sendToken = socialAuth.sendToken('linkedin', e.authResponse.access_token);

                $.when(sendToken).done(function (data) {
                    localStorage.setItem('token', data.key);
                    window.location = '/account/profile';
                });
            },
            function (e) {

                // TODO: notificate user about reason of error;
                app.routers.navigate(
                    '/account/login',
                    {trigger: true, replace: true}
                );
            });

    },

    loginGoogle: function() {

        let socialAuth = require('js/views/social-auth.js');
        let hello = require('hellojs');

        hello('google').login({
            scope: 'profile,email'}).then(
            function (e) {
                var sendToken = socialAuth.sendToken('google', e.authResponse.access_token);

                $.when(sendToken).done(function (data) {
                    localStorage.setItem('token', data.key);
                    window.location = '/account/profile';
                });
            },
            function (e) {

                // TODO: notificate user about reason of error;
                app.routers.navigate(
                    '/account/login',
                    {trigger: true, replace: true}
                );
            });
        
    },

    finishSocialLogin: function() {

        let socialAuth = require('js/views/social-auth.js');
        let hello = require('hellojs');

    },

    logout: function(id) {
        // ToDo
        // Do we really want have to wait till user will be ready ?
        app.user.logout();
        app.on('userLogout', function() {
            window.location = '/';
        });
    },

    execute(callback, args, name) {

        // disable enter to the final step of paybackshare calculator without data
        if (name == 'calculatorPaybackshareStep3') {
            if (!app.models['calculatorPaybackshare'] || !app.models['calculatorPaybackshare'].get('outputData')) {
                app.routers.navigate('/calculator/paybackshare/step-2', {trigger: true});
                return false;
            }
        }

        // disable enter to the final step of capitalraise calculator without data
        if (name == 'calculatorCapitalraiseFinish') {
            if (!app.models['calculatorCapitalraise'] || !app.models['calculatorCapitalraise'].get('dataIsFilled')) {
                app.routers.navigate('/calculator/capitalraise/step-1', {trigger: true});
                return false;
            }
        }

        if (callback) callback.apply(this, args);
    }
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

