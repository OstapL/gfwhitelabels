define(function() {
    return {
        login: Backbone.View.extend({
            events: {
                'submit .login-form': 'login',
                'submit .signup-form': 'signup',
            },

            initialize: function(options) {
                this.login_fields = options.login_fields;
                this.register_fields = options.register_fields;
            },

            render: function() {
                let template = require('templates/userLogin.pug');
                this.$el.html(
                    template({
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
                        app.defaultSaveActions.success(this, xhr);
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
                        app.defaultSaveActions.error(this, xhr, status, text);
                    }
                });
            },


            signup: function(event) {
                event.preventDefault();
                let data = $(event.target).serializeObject();

                this.model.set(data);
                this.model.url = serverUrl + Urls.rest_register();
                Backbone.Validation.bind(this, {model: this.model});

                if(this.model.isValid(true)) {
                    this.model.save(data, {
                        success: (model, response, status) => {
                            $.ajax({
                                url: serverUrl + Urls['rest_login'](),
                                method: 'POST',
                                data: {email: data.email, password: data.password1},
                                success: (xhr) => {
                                    app.defaultSaveActions.success(this, xhr);
                                    if(xhr.hasOwnProperty('key')) {
                                        localStorage.setItem('token', xhr.key);
                                        setTimeout(function() {
                                            window.location = '/' //data.next ? data.next : '/account/profile'
                                        }, 200);
                                    } else {
                                        Backbone.Validation.callbacks.invalid(                                 
                                          this, '', 'Server return no authentication data'
                                        );
                                    }
                                },
                                error: (xhr, status, text) => {
                                    app.defaultSaveActions.error(this, xhr, status, text);
                                }
                            });
                        },
                        error: (model, response, status) => {
                            app.defaultSaveActions.error(this, response);
                        }
                    });
                }
            },
        }),

        profile: Backbone.View.extend({
            initialize: function(options) {
                this.fields = options.fields;

                // define ui elements
                this.cityStateArea = null;
                this.cityField = null;
                this.stateField = null;
                this.zipCodeField = null;

                // define timeout for zip code keyup event
                this.zipCodeTimeOut = null;

                // define flag for the geocode function respond
                this.geocodeIsNotInProgress = true;
            },

            events: {
                'submit form': 'update',
                'focus #ssn' : 'showSSNPopover',
                'focuseout #ssn' : 'hideSSNPopover',
                'keyup #zip_code': 'changeZipCode',
                'change .js-city': 'changeAddressManually',
                'change .js-state': 'changeAddressManually'
            },

            render: function() {
                this.getCityStateByZipCode = require("../helpers/getSityStateByZipCode");
                this.usaStates = require("../helpers/usa-states");
                let dropzone = require('dropzone');
                let template = require('templates/userProfile.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        user: app.user.toJSON(),
                        fields: this.fields,
                        states: this.usaStates
                    })
                );

                this.cityStateArea = this.$('.js-city-state');
                this.cityField = this.$('.js-city');
                this.stateField = this.$('.js-state');
                this.zipCodeField = this.$('#zip_code');

                /*
                app.createFileDropzone(
                    dropzone,
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
                */
                return this;
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

            showSSNPopover: function(event){
                $('#ssn').popover({
                    trigger: 'focus',
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
            },

            hideSSNPopover: function(event){
                $('#ssn').popover('hide');
            },

            changeZipCode(e) {
                if (!this.geocodeIsNotInProgress) return false;

                clearTimeout(this.zipCodeTimeOut);
                this.zipCodeTimeOut = setTimeout(() => {
                    this.geocodeIsNotInProgress = false;
                    this.getCityStateByZipCode(e.target.value, ({ success=false, city="", state="" }) => {
                        this.geocodeIsNotInProgress = true;
                        // clear error
                        this.zipCodeField.closest('div').find('.help-block').remove();

                        if (success) {
                            if (!this.usaStates.find((el) => el.name == state)) {
                                this.resetAddressValues();
                                return false;
                            }

                            this.cityStateArea.text(`${city}/${state}`);
                            this.cityField.val(city);
                            this.stateField.val(state);
                        } else {
                            this.resetAddressValues();
                        }
                    });
                }, 200);
            },

            resetAddressValues() {
                this.cityStateArea.text('City/State');
                this.cityField.val('');
                this.stateField.val('');
                Backbone.Validation.callbacks.invalid(this, 'zip_code', 'Sorry your zip code is not found');
            },

            changeAddressManually() {
                this.cityStateArea.text(`${this.cityField.val()}/${this.stateField.val()}`);
            }
        })
    
    }
});
