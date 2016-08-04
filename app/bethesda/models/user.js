    let userModel = Backbone.Model.extend({
        defaults: {
            token: ''
        },

        is_anonymous: function() {
            return this.get('username') == '';
        },

        get_full_name: function() {
            return this.get('first_name') + ' ' + this.get('last_name')
        },

        load: function() {
            // if we have a token we can get information about user
            if(localStorage.getItem('token') !== null) {
                let userData = localStorage.getItem('user');
                this.set('token', localStorage.getItem('token'));

                if(userData == null) {
                    this.fetch({
                        url: serverUrl + Urls['rest_user_details'](),
                        success: (data) => {
                            localStorage.setItem('user', JSON.stringify(this.toJSON()));
                            app.trigger('userReady', data);
                        },
                        error: (model, xhr, status) => {
                            localStorage.removeItem('token');
                            defaultSaveActions.error(app, xhr, status, '');
                        },
                    });
                } else {
                    userData = JSON.parse(userData);
                    this.set(userData);
                    app.trigger('userReady', userData);
                }
            } else {
                app.trigger('userReady', {id: ''});
            }
        },

        // ToDo
        // Move login function from views/user.js to model
        /*
        login: function(cb) {
            $.ajax({
                url: serverUrl + Urls['rest_logout'](),
                success: (data) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    cb();
                }
            });
        },
        */

        logout: function() {
            $.ajax({
                type: 'POST',
                url: serverUrl + Urls['rest_logout'](),
                success: (data) => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    app.trigger('userLogout', data);
                }
            });
        },
    });
