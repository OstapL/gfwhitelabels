'use strict';

const formatHelper = require('helpers/formatHelper');
const validation = require('components/validation/validation.js');
const deepDiff = require('deep-diff').diff;

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
    options = options || {};
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
      contentType: "application/x-www-form-urlencoded",
      beforeSend: function (xhr) {
        let token = localStorage.getItem('token');
        if (token !== null && token !== '') {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
      },
    }, options);

    return $.ajax(params);
  },

  submitAction(e, newData) {
    e.preventDefault();

    this.$el.find('.alert').remove();

    let url = this.urlRoot || '';
    let method = e.target.dataset.method || 'POST';

    if(this.model && this.model.hasOwnProperty('id')) {
      url = url.replace(':id', this.model.id);
      method = e.target.dataset.method || 'PATCH';
    }

    newData = newData || $(e.target).closest('form').serializeJSON({ useIntKeysAsArrayIndex: true });
    api.deleteEmptyNested.call(this, this.fields, newData);
    api.fixDateFields.call(this, this.fields, newData);
    api.fixMoneyFields.call(this, this.fields, newData);

    // if view already have some data - extend that info
    if(this.hasOwnProperty('model') && !this.doNotExtendModel && method != 'PATCH') {
      newData = _.extend({}, this.model, newData);
    }

    // for PATCH method we will send only difference
    if(method == 'PATCH') {
      let patchData = {};
      let d = deepDiff(newData, this.model);
      _(d).forEach((el, i) => {
        if(el.kind == 'E' || el.kind == 'A') {
          patchData[el.path[0]] = newData[el.path[0]];
          if(this.fields[el.path[0]].hasOwnProperty('dependies')) {
            this.fields[el.path[0]].dependies.forEach((dep, index) => {
              patchData[dep] = newData[dep]; 
            });
          }
        } else if(el.kind == 'N' && newData.hasOwnProperty(el.path[0])) {
          // In case if we delete data that was in the model
          var newArr = [];
          newData[el.path[0]].forEach((arr, i) => {
            newArr.push(arr);
          });
          patchData[el.path[0]] = newArr;
          if(this.fields[el.path[0]].hasOwnProperty('dependies')) {
            this.fields[el.path[0]].dependies.forEach((dep, index) => {
              patchData[dep] = newData[dep];
            });
          }
        }
      });

      /*
      if(this.fields.hasOwnProperty('dependies')) {
        _(this.fields.dependies).each((k, v) => {
          if(patchData.hasOwnProperty(k) == false) {
            patchData[k] = newData[k];
          }
        });
      }
      */

      newData = patchData;
    };

    this.$('.help-block').remove();
    let fields = this.fields;
    if (method == 'PATCH') {
      let patchFields = {};
      _(newData).each((el, key) => {
        if(fields[key]) {
          patchFields[key] = fields[key];
        } else {
          console.error('field meta data not found: ' + key);
        }
      })
      fields = patchFields;
    }

    if(!validation.validate(fields, newData, this)) {
      _(validation.errors).each((errors, key) => {
        validation.invalidMsg(this, key, errors);
      });
      this.$('.help-block').prev().scrollTo(5);
      return false;
    } else {

      api.makeRequest(url, method, newData).
        then((responseData) => {
          // ToDo
          // Do we really need this ?!
          if(method != 'POST') {
            _.extend(this.model, newData);
          }
          app.showLoading();

          // ToDo
          // Create clearity function
          this.$el.find('.alert-warning').remove();
          // this.undelegateEvents();
          $('.popover').popover('hide');

          let defaultAction  = 1;
          if (typeof this._success == 'function') {
            defaultAction = this._success(responseData, newData);
          } 
          
          if(defaultAction == 1) {
            $('#content').scrollTo();
            this.undelegateEvents();
            app.routers.navigate(
              this.getSuccessUrl(responseData),
              { trigger: true, replace: false }
            );
          }
        }).
        fail((xhr, status, text) => {
          api.errorAction(this, xhr, status, text, this.fields);
        });
    }

    // Here it means the validation result is true;
    return true;
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

  deleteEmptyNested(fields, data) {
    _(fields).each((el, key) => {
      if(el.type == 'nested') {
        if(Array.isArray(data[key])) {
          data[key] = data[key].filter(function(el) { return el !== null;})
          data[key].forEach((el, i) => {
            let emptyValues = 0;
            _(el).each((val, subkey) => {
              if(val == '' || val == 0) {
                emptyValues ++;
              }
            });
            if(Object.keys(el).length == emptyValues) {
              delete data[key][i];
              if(Object.keys(data[key]).length == 0) {
                data[key] = this.model[key];
              }
            };
          });
        }
      }
    });
  },

  fixMoneyFields(fields, data) {
    _(fields).each((el, key) => {
      if(el.type == 'money') {
        if (data && data[key]) {
          data[key] = formatHelper.unformatPrice(data[key]);
        }
      } else if(el.type == 'nested' && data[key]) {
        _.each(data[key], (val, index, list) => {
          api.fixMoneyFields.call(this, el.schema, data[key][index]);
       });
      }
    });
  }
};
