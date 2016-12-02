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

  makeRequest(url, type, data, options) {
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
      dataType: 'json',
      contentType: "application/x-www-form-urlencoded",// "application/json; charset=utf-8",
      beforeSend: function (xhr) {
        let token = localStorage.getItem('token');
        if (token !== null && token !== '') {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
      },
    }, options);

    return $.ajax(params);
  },

  submitAction(e, data) {
    this.$el.find('.alert').remove();
    e.preventDefault();

    data = data || $(e.target).closest('form').serializeJSON({ useIntKeysAsArrayIndex: true });
    api.fixDateFields.call(this, this.fields, data);

    // if view already have some data - extend that info
    if(this.hasOwnProperty('model') && !data.doNotExtendModel) {
      _.extend(this.model, data);
      data = _.extend({}, this.model)
    }
    delete data.doNotExtendModel;

    this.$('.help-block').remove();
    if (e.target.dataset.method != 'PATCH' && !validation.validate(this.fields, data, this)) {
      _(validation.errors).each((errors, key) => {
        validation.invalidMsg(this, key, errors);
      });
      this.$('.help-block').prev().scrollTo(5);
      return;
    } else {
      let url = this.urlRoot;
      let type = e.target.dataset.method || 'POST';

      if(data.hasOwnProperty('id')) {
        url = url.replace(':id', data.id);
        delete data.id;
        type = e.target.dataset.method || 'PUT';
      }

      _(this.fields).each((el, key) => {
        if(el.required === false && data[key] == '')
          delete data[key];
      });

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
      if (_.isString(data)) {
        validation.invalidMsg(
          view, 'error', data
        );
      } else {
        for (let key in data)  {
          validation.invalidMsg(
            view, key, data[key]
          );
        }
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
      view.$el.find('.has-error').parent().scrollTo(5);
    }

    app.hideLoading();
  },

  fixDateFields(fields, data) {
    _(fields).each((el, key) => {
      if(el.type == 'date') {
        var key_year = key + '__year';
        var key_month = key + '__month';
        var key_day = key + '__day';
        if(data[key_year]) {
          data[key] = data[key_year] + '-' + (data[key_month] || '01') + '-' + 
            (data[key_day] || '01') 
        }
        delete data[key_year];
        delete data[key_month];
        delete data[key_day];
      } else if(el.type == 'nested' && data[key]) {
        _.each(data[key], (val, index, list) => {
          api.fixDateFields.call(this, el.schema, data[key][index]);  
        });
      }
    });
  },
};
