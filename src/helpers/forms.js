'use strict';

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

    if(url.indexOf('http') == -1) {
      url = serverUrl + url
    } 

    if(type == 'POST' || type == 'PUT' || type == 'PATCH') {
      data = JSON.stringify(data);
    }

    let params = _.extend({
      url: url,
      type: type,
      data: data,
    }, api.requestOptions);

    return $.ajax(params);
  },

  submitAction(e, data) {
    this.$el.find('.alert').remove();
    e.preventDefault();

    data = data || $(e.target).serializeJSON({useIntKeysAsArrayIndex: true});

    // if view already have some data - extend that info
    if(this.hasOwnProperty('model')) {
      _.extend(this.model, data);
      data = Object.assign({}, this.model)
    }

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
    if (!validation.validate(this.fields, data, this)) {
      _(validation.errors).each((errors, key) => {
        validation.invalidMsg(this, key, errors);
      });
      this.$('.help-block').scrollTo(45);
      return;
    } else {
      let url = this.urlRoot;
      let type = 'POST';

      if (data.hasOwnProperty('id')) {
        url = url.replace(':id', data.id);
        delete data.id;
        // type = 'PUT';
        type = document.activeElement.dataset.method || 'PUT';
      }

      api.makeRequest(url, type, data).
        then((data) => {
          app.showLoading();

          // ToDo
          // Create clearity function
          this.$el.find('.alert-warning').remove();
          this.undelegateEvents();
          $('.popover').popover('hide');

          if (typeof this._success == 'function') {
            this._success(data);
          } else {
            $('#content').scrollTo();
            app.routers.navigate(
              this.getSuccessUrl(data),
              { trigger: true, replace: false }
            );
          }
        }).
        fail((xhr, status, text) => {
          api.errorAction(this, xhr, status, text, this.fields);
        });
    }
  },

  submitRisk(e, data) {
    this.$el.find('.alert').remove();
    e.preventDefault();

    data = data || $(e.target).serializeJSON({useIntKeysAsArrayIndex: true});

    // if view already have some data - extend that info
    if(this.hasOwnProperty('model') && !(document.activeElement.dataset.concat == 'false')) {
      _.extend(this.model, data);
      data = Object.assign({}, this.model)
    } else if (this.hasOwnProperty('model')) {
      data.id = this.model.id;
    }

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
    if (!validation.validate(this.fields, data, this)) {
      _(validation.errors).each((errors, key) => {
        validation.invalidMsg(this, key, errors);
      });
      this.$('.help-block').scrollTo(45);
      return;
    } else {
      let url = this.urlRoot;
      let type = 'POST';

      if (data.hasOwnProperty('id')) {
        url = url.replace(':id', data.id);
        delete data.id;
        // type = 'PUT';
        type = $(e.target).data('method') || 'PUT';
      }

      let riskIndex = data.index;
      let riskData = data;
      url = url.replace(':index', riskIndex);

      api.makeRequest(url, type, data).
        then((data) => {
          // app.showLoading();

          // ToDo
          // Create clearity function
          this.$el.find('.alert-warning').remove();
          $('.popover').popover('hide');

          if (typeof this._success == 'function') {
            this._success(data, riskIndex, riskData, type);
          } else {
            $('#content').scrollTo();
            app.routers.navigate(
              this.getSuccessUrl(data),
              { trigger: true, replace: false }
            );
          }
        }).
        fail((xhr, status, text) => {
          api.errorAction(this, xhr, status, text, this.fields);
        });
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
        validation.invalidMsg(
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
    //contentType: "application/json; charset=utf-8",
    beforeSend: function (xhr) {
      let token = localStorage.getItem('token');
      if (token !== null && token !== '') {
        xhr.setRequestHeader('Authorization', token);
      }
    },
  },
};
