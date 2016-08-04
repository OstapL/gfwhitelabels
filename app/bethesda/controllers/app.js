let app = {
    $: jQuery,

    collections: {
    },

    models: {
        campaign: [],
        page: [],
    },

    views: {
        campaign: [],
        page: [],
    },


    routers: {},
    cache: {},

    getModel: function(name, model, id, callback) {
        if(this.models.hasOwnProperty(name) == false) {
            this.models[name] = [];
        }

        if(this.models[name][id] == null) {
            this.models[name][id] = new model({
                id: id
            });
            this.models[name][id].fetch({
                success: callback
            });
        } else {
            callback(this.models[name][id]);
        }
    },
    
    /* 
     * Misc Display Functions 
     *
     */
    showLoading: function() {
        $('.loader_overlay').show();
    },

    hideLoading: function() {
        $('.loader_overlay').hide();
    },

    showError: function(form, type, errors) {
        let msgBox = $(form).find('.error-messages');

        // ToDo
        // Create template/message.js
        // And use messages dynamicly base on the message type
        

        if(msgBox.length == 0) {
            $(form).prepend(`<div class="alert alert-warning" role="alert">
                <strong>Error!</strong>  
            </div>`);
        }
        $('.loader_overlay').hide();
    },
    
    /*
     * Strip /api in urls
     * and remove all urls not related to API
     *
     */
    getUrls: function() {

        $.ajax({
            url: serverUrl + "/jsreverse/",
        }).done(function(oldUrls) {
            oldUrls = eval(oldUrls);
            let newUrls = Object();
            for(k in oldUrls) {
                let v = oldUrls[k](0);
                if(v !== null && v.indexOf('api') != -1) {
                    newUrls[k] = oldUrls[k];
                }
            }
            app.Urls = newUrls;
            console.log(app.Urls);
            app.trigger('urlsReady');
        });
    },
};


requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/',
    //paths: {
    //    urls: serverUrl + '/jsreverse'
    //}
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
});

requirejs(['/templates/templates.js'], function() {

_.extend(app, Backbone.Events);
app.getUrls();

app.on('urlsReady', function() {

    let appRoutes = Backbone.Router.extend({
        routes: {
          '': 'mainPage',
          'api/campaign': 'campaignList',
          'api/campaign/:id': 'campaignDetail',
          'api/campaign/:id/invest': 'campaignInvestment',
          'sketches/:name': 'sketches',
          'page/:id/': 'pageDetail',
          'account/profile': 'accountProfile',
          'account/login/': 'login',
          'account/logout/': 'logout',
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
            requirejs(['models/campaign', 'views/campaign', ], function(model, view) {
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
            });
        },

        campaignDetail: function(id) {
            requirejs(['models/campaign', 'views/campaign', '/templates_js/campaignDetail.js', ], (model, view, campaignDetailT) => {

                app.getModel('campaign', model.model, id, function(model) {
                    app.views.campaign[id] = new view.detail({
                        el: '#content',
                        model: model,
                        template: campaignDetailT,
                    });
                    app.views.campaign[id].render();
                    app.cache[window.location.pathname] = app.views.campaign[id].$el.html();
                    $('#content').scrollTo();

                    app.hideLoading();
                });
            });
        },
                                                                                      
        campaignInvestment: function(id) {
            requirejs(['models/campaign', 'models/investment', 'views/campaign', ], (model, investModel, view) => {

                app.getModel('campaign', model.model, id, function(campaignModel) {
                    var i = new view.investment({
                        el: '#content',
                        model: new investModel.model(),
                        campaignModel: campaignModel,
                    });
                    i.render();
                    //app.views.campaign[id].render();
                    //app.cache[window.location.pathname] = app.views.campaign[id].$el.html();

                    app.hideLoading();
                });

            });
        },

        accountProfile: function() {
            app.on('menuReady', function(data) {
                console.log('account profile');
                if(app.user.get('token') != '') {
                    requirejs(['views/user', ], (view) => {
                        var i = new view.profile({
                            el: '#content',
                            model: app.user,
                        });
                        i.render();
                        //app.views.campaign[id].render();
                        app.cache[window.location.pathname] = i.$el.html();

                        app.hideLoading();
                    });
                } else {
                    app.routers.navigate(
                        '/account/login/', 
                        {trigger: true, replace: true}
                    );
                }
            });
        },

        issuerDashboard: function() {
            requirejs(['models/user', ], (model, view, template) => {

                var i = new view.profile({
                    el: '#content',
                    model: app.user,
                    template: template.profile,
                });
                i.render();
                //app.views.campaign[id].render();
                app.cache[window.location.pathname] = i.$el.html();

                app.hideLoading();
            });
        },

        investorDashboard: function() {
            requirejs(['models/user', ], (model, view, template) => {

                var i = new view.profile({
                    el: '#content',
                    model: app.user,
                    template: template.profile,
                });
                i.render();
                //app.views.campaign[id].render();
                app.cache[window.location.pathname] = i.$el.html();

                app.hideLoading();
            });
        },

        pageDetail: function(id) {
            requirejs(['models/page', 'views/page', ], (model, view, pageDetailT) => {

                let element = new model.model({
                    id: id
                });

                element.fetch({
                    success: (response) => {
                        app.models.page[id] = model;
                        app.views.page[id] = new view.detail({
                            el: '#content',
                            model: element,
                            template: pageDetailT,
                        });
                        app.views.page[id].render();
                        app.cache[window.location.pathname] = app.views.page[id].$el.html();

                        app.hideLoading();
                    }
                });
            });
        },

        mainPage: function(id) {
            requirejs(['models/page', 'views/page', ], (model, view, mainPageT) => {
                app.cache[window.location.pathname] = window.mainPage();
                $('#content').html(window.mainPage());
                app.hideLoading();
            });
        },

        login: function(id) {
            requirejs(['views/user', ], (userView, userT) => {
                let loginView = new userView.login({
                    el: '#content',
                    template: userT,
                })
                loginView.render();
                app.cache[window.location.pathname] = loginView.$el.html();
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

    app.routers = new appRoutes();

    app.user = new userModel();

    app.on('userReady', function(data){
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
        require(['views/menu', ], (menu) => {
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
        });
        app.routers.navigate(
            window.location.pathname + '#',
            {trigger: true, replace: true}
        );
        console.log('user ready');
    });

    app.user.load();

    $('body').on('click', 'a', function(event) {
        var href = event.currentTarget.getAttribute('href');
        if(href.substr(0,1) != '#' && href.substr(0, 4) != 'http' && href.substr(0,3) != 'ftp') {
            event.preventDefault();
            app.showLoading();


            // If we already have that url in cache - we will just update browser location 
            // and set cache version of the page
            // overise we will trigger app router function
            var url = href;

            if(app.cache.hasOwnProperty(url) == false) {
                app.routers.navigate(
                    url, 
                    {trigger: true, replace: false}
                );
            } else {
                $('#content').html(app.cache[url]);
                app.routers.navigate(
                    url, 
                    {trigger: false, replace: false}
                );
                app.hideLoading();
            }
        }
    });
    Backbone.history.start({pushState: true});
});
});
