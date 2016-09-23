const validation = require('components/validation/validation.js');

module.exports = {
  makeCacheRequest(url, type, data) {
    return this.makeRequest(url, type, data);
    /*
    if (app.cache.hasOwnProperty(url) === false) {
      return this.makeRequest(url, type, data)
        .then(function (response) {
          app.cache[url] = response;
          return response;
        });
    } else {
      return new Promise(
        function () {
          return app.cache[url];
        },

        function () {
          console.log('cache raise fail function its stange');
        }
      );
    }
    */
  },

  makeRequest(url, type, data) {

    // We can pass type as a string
    // or we can pass dict with type and data
    if (typeof type === 'object') {
      data = type;
      type = data.type;
      delete data.type;
    }

    let params = _.extend({
      url: serverUrl + url,
      type: type,
      data: data,
    }, api.requestOptions);

    return $.ajax(params);
  },

  submitAction(e, data) {
    this.$el.find('.alert').remove();
    e.preventDefault();

    var data = data || $(e.target).serializeJSON();

    /*
       var newValidators = {};
       for(var k in this.fields) {
       if (k.required == true) {
       newValidators[k] = baseModel.validation[k];
       }
       };
       this.model.validation = newValidators;
    */

    this.$('.help-block').remove();
    if (!validation.validate(this.fields, data.member, this)) {
      _(validation.errors).each((el, key) => {
        Backbone.Validation.callbacks.invalid(this, key, el);
      });
      this.$('.help-block').scrollTo(45);
      return;
    }

    let model = {};
    model = new Backbone.Model();
    if(this.model.hasOwnProperty('id')) {
      model.set('id', this.model.id);
    }
    if(this.model.hasOwnProperty('attributes')) {
      model.set(this.model.attributes);
    }
    if(this.model.hasOwnProperty('urlRoot')) {
      model.urlRoot = this.model.urlRoot;
    } else {
      model.urlRoot = this.urlRoot;
    }

    model.set(data);
    //Backbone.Validation.bind(this, { model: model });

    if (model.isValid(true)) {
      var self = this;
      model.save().
        then((data) => {
          app.showLoading();

          // ToDo
          // Create clearity function
          this.$el.find('.alert-warning').remove();
          self.undelegateEvents();
          $('.popover').popover('hide');

          if (typeof this._success == 'function') {
            this._success(data);
          } else {
            $('#content').scrollTo();
            app.routers.navigate(
              self.getSuccessUrl(data),
              { trigger: true, replace: false }
            );
          }
        }).
        fail((xhr, status, text) => {
          api.errorAction(this, xhr, status, text, this.fields);
        });
    } else {
      if (this.$('.alert').length) {
        $('#content').scrollTo();
      } else {
        this.$el.find('.has-error').scrollTo();
      }
    }
  },

  successAction: (view, response) => {
    view.$('.alert-warning').remove();
    if (typeof view._success == 'function') {
      view._success(response);
    }
  },

  errorAction: (view, xhr, status, text, fields) => {
    if (view.hasOwnProperty('$el') == false) {
      view = {
        $el: view,
        $: app.$,
      };
    }

    view.$el.find('.alert-warning').remove();
    view.$el.find('.help-block').remove();

    if (xhr.hasOwnProperty('responseJSON')) {
      let data = xhr.responseJSON;

      data = data ? data : { Server: status };
      for (let key in data)  {
        Backbone.Validation.callbacks.invalid(
          view, key, data[key]
        );
      }
    } else if (xhr.hasOwnProperty('statusText')) {
      let s = '<strong>Errors:</strong> ';
      s += xhr.statusText;
      if (view.$el.find('form').length >= 1) {
        view.$el.find('form').prepend("<div class='alert alert-warning'" +
          "role='alert'>" + s + '</div>');
      } else {
        view.$el.prepend("<div class='alert alert-warning' role='alert'>" +
          s + '</div>');
      }
    }

    if (view.$el.find('.alert').length) {
      view.$el.find('.alert').scrollTo();
    } else {
      view.$el.find('.has-error').scrollTo();
    }

    app.hideLoading();
  },

  requestOptions: {
    dataType: 'json',
    beforeSend: function (xhr) {
      let token = localStorage.getItem('token');
      if (token !== null && token !== '') {
        xhr.setRequestHeader('Authorization', 'Token ' + token);
      }
    },
  },
};
