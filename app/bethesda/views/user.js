define(function() {
    return {
        login: Backbone.View.extend({
            events: {
                'submit .login-form': 'login',
            },

            initialize: function(options) {
                this.login_fields = options.login_fields;
                this.register_fields = options.register_fields;
            },

            render: function() {
                this.$el.html(
                    window.userLogin({
                        login_fields: this.login_fields,
                        register_fields: this.register_fields,
                        login: window.location.pathname.indexOf('login') != -1
                    })
                );
                return this;
            },

            login: function(event) {
                event.preventDefault();
                var form = $(event.target);
                app.showLoading();
                this.$('form > .alert-warning').html('');
                var data = form.serializeObject();

                $.ajax({
                    url: serverUrl + Urls['rest_login'](),
                    method: 'POST',
                    data: data,
                    success: (xhr) => {
                        defaultSaveActions.success(this, xhr);
                        if(xhr.hasOwnProperty('key')) {
                            localStorage.setItem('token', xhr.key);
                            setTimeout(function() {
                                window.location = '/' //data.next ? data.next : '/account/profile'
                            }, 200);
                        } else {
                            Backbone.Validation.callbacks.invalid(                                 
                              form, '', 'Server return no authentication data'
                            );
                        }
                    },
                    error: (xhr, status, text) => {
                        defaultSaveActions.error(this, xhr, status, text);
                    }
                });
            },
        }),

        signup: Backbone.View.extend({
            initialize: function(options) {
                this.template = options.template;
            },

            render: function() {
                this.$el.append(
                    _.template(this.template)({
                        serverUrl: serverUrl,
                    })
                );
                return this;
            },
        }),

        profile: Backbone.View.extend({
            initialize: function(options) {
                this.fields = options.fields
            },

            events: {
                'submit form': 'update',
                // 'click .change_state_city' : 'showCityStateModal'
                'focus #ssn' : 'showSSNPopover',
            },

            render: function() {
                requirejs(['/js/dropzone.js',], (dropzone) => {
                    this.$el.html(
                        window.userProfile({
                            serverUrl: serverUrl,
                            user: app.user.toJSON(),
                            fields: this.fields
                        })
                    );
                    createFileDropzone(
                        'image', 
                        'avatars', '', 
                        (data) => {
                            this.model.save({
                                image: data.file_id,
                            }, {
                                patch: true
                            }).then((model) => {
                                localStorage.setItem('user', JSON.stringify(this.model.toJSON()));
                            });
                        }
                    );
                    return this;
                });
            },

            update: function(event) {
                event.preventDefault();
                let data = $(event.target).serializeObject();

                this.model.set(data);
                if(this.model.isValid(true)) {
                    this.model.save(data, {
                        success: (model, response, status) => {
                            defaultSaveActions.success(this, response);
                        },
                        error: (model, response, status) => {
                            defaultSaveActions.error(this, response);
                        }
                    });
                }
            },

            showCityStateModal: function(event) {
                // event.preventDefault(); 
                // console.log('here'); 
                // $('#city_state').modal('toggle');
            },

            showSSNPopover: function(event){
                $('#ssn').popover({
                    // trigger: 'focuse',
                    placement: function(context, src) {
                        $(context).addClass('ssn-popover');
                        return 'right';
                    },
                    html: true,
                    content: function(){
                        var content = $('.profile').find('.popover-content-ssn ').html();
                        return content;
                    }
                });

                $('#ssn').popover('show');
            }
        }),
    
    }
});
