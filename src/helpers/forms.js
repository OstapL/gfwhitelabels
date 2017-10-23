'use strict';
import deepDiff from 'deep-diff';


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
    // return new Promise((resolve, reject) => {
      options = options || {};
      // We can pass type as a string
      // or we can pass dict with type and data
      if (typeof type === 'object') {
        data = type;
        type = data.type;
        delete data.type;
      }

      type = type || 'GET';

      if(type == 'POST' || type == 'PUT' || type == 'PATCH' || type == 'DELETE') {
        data = JSON.stringify(data);
      }

      let params = Object.assign({
        url: url,
        type: type,
        data: data,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
          let token = localStorage.getItem('token');
          if (token !== null && token !== '') {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
          }
        },
      }, options);

      const promise = $.ajax(params);

      promise.always((xhr, status) => {
        // If status is success or it is not get request
        // do not show error
        if (status === 'success' || type.toUpperCase() !== 'GET') {
          return;
        }
        // If we have location in responseJSON
        // do not show error
        if (xhr.hasOwnProperty('responseJSON') &&
          xhr.responseJSON !== undefined &&
          xhr.responseJSON.hasOwnProperty('location')) {
          return;
        }
        app.helpers.errorPage({
          status: xhr.status,
          statusText: xhr.statusText,
        });
        app.hideLoading();
      });
      
      // promise.then(resolve);
      // promise.fail(reject);

      return promise;
    // });
  },

  submitAction(e, newData) {
    e.preventDefault();

    this.$el.find('.alert').remove();

    let url = this.urlRoot || '';
    let method = e.target.dataset.method || 'POST';
    let form = $(e.target).closest('form');

    if(this.model&& Object.keys(this.model).length > 0 && this.model.id) {
      url = url.replace(':id', this.model.id);
      method = e.target.dataset.method || 'PATCH';
    }

    newData = newData || form.serializeJSON();

    // issue 348, disable form for double posting
    if(form.length > 0) {
      form[0].setAttribute('disabled', true);
    }
    e.target.setAttribute('disabled', true);

    const fields = this.fieldsSchema || this.fields;

    api.deleteEmptyNested.call(this, fields, newData);
    api.fixDateFields.call(this, fields, newData);
    // api.fixFieldTypes.call(this, fields, newData);

    // if view already have some data - extend that info
    if(this.hasOwnProperty('model') && Object.keys(this.model).length > 0 && !this.doNotExtendModel && method != 'PATCH') {
      newData = Object.assign({}, this.model.toJSON ? this.model.toJSON() : this.model, newData);
    }

    // for PATCH method we will send only difference
    if(method == 'PATCH') {
      let patchData = {};
      let d = deepDiff(newData, this.model.toJSON ? this.model.toJSON() : this.model);
      d.forEach((el, i) => {
        if(el.kind == 'E' || el.kind == 'A') {
          patchData[el.path[0]] = newData[el.path[0]];
          if(fields[el.path[0]] && fields[el.path[0]].hasOwnProperty('dependies')) {
            fields[el.path[0]].dependies.forEach((dep, index) => {
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
          if(fields[el.path[0]] && fields[el.path[0]].hasOwnProperty('dependies')) {
            fields[el.path[0]].dependies.forEach((dep, index) => {
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
    // let fields = this.fields;
    let changedFields = fields;
    if (method == 'PATCH') {
      let patchFields = {};
      Object.keys(newData).forEach((key) => {
        if(fields[key]) {
          patchFields[key] = fields[key];
        } else {
          console.error('field meta data not found: ' + key);
        }
      });
      changedFields = patchFields;
    }

    if(form.length > 0) {
      let errorsInput = form[0].querySelectorAll('.has-error');
      if (errorsInput.length > 0) {
        errorsInput.forEach((er) => er.classList.remove('has-error'));
      }
    }

    if(!app.validation.validate(changedFields, newData, this)) {
      Object.keys(app.validation.errors).forEach((key) => {
        const errors = app.validation.errors[key];
        app.validation.invalidMsg(this, key, errors);
      });
      this.$('.help-block').prev().scrollTo(25);
      if(form.length > 0) {
        form[0].removeAttribute('disabled');
      }
      e.target.removeAttribute('disabled');
      return false;
    } else {

      api.makeRequest(url, method, newData)
        .then((responseData) => {
          // ToDo
          // Do we really need this ?!
          if(method != 'POST' && this.model) {
            Object.assign(this.model, newData);
          }
          app.showLoading();

          // ToDo
          // Create clearity function
          this.$el.find('.alert-warning').remove();
          // this.undelegateEvents();
          $('.popover').popover('hide');

          if(form.length > 0) {
            form[0].removeAttribute('disabled');
          }
          e.target.removeAttribute('disabled');

          let defaultAction  = 1;
          if (typeof this._success == 'function') {
            defaultAction = this._success(responseData, newData, method);
          }

          if(defaultAction == 1) {
            $('body').scrollTo();
            this.undelegateEvents();
            app.routers.navigate(
              this.getSuccessUrl(responseData),
              { trigger: true, replace: false }
            );
          }
        })
        .fail((xhr, status, text) => {
          if(form.length > 0) {
            form[0].removeAttribute('disabled');
          }
          e.target.removeAttribute('disabled');
          if (typeof this._error == 'function') {
            debugger;
            this._error(xhr.responseJSON, newData, method);
          }
          api.errorAction(this, xhr, status, text, fields);
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
      if (typeof(data) === 'string') {
        app.validation.invalidMsg(
          view, 'error', data
        );
      } else {
        for (let key in data)  {
          app.validation.invalidMsg(
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
    Object.keys(fields || {}).forEach((key) => {
      const el = fields[key];
      if(el.type == 'date') {
        var key_year = key + '__year';
        var key_month = key + '__month';
        var key_day = key + '__day';
        if (data.hasOwnProperty(key_year)) {
          if (data[key_year]) {
            data[key] = data[key_year] + '-' + (data[key_month] || '01') + '-' +
              (data[key_day] || '01')
          } else {
            data[key] = '';
          }
        }

        delete data[key_year];
        delete data[key_month];
        delete data[key_day];
      } else if(el.type == 'nested' && data[key]) {
        if (Array.isArray(data[key])) {
          data[key].forEach((val, index) => {
            api.fixDateFields.call(this, el.schema, data[key][index]);
          });
        } else if (typeof(data[key]) === 'object') {
          Object.keys(data[key]).forEach((name) => {
            api.fixDateFields.call(this, el.schema, data[key][name]);
          });
        }
      }
    });
  },

  deleteEmptyNested(fields, data) {
    Object.keys(fields || {}).forEach((key) => {
      const el = fields[key];
      if(el.type == 'nested') {
        if(Array.isArray(data[key])) {
          data[key] = data[key].filter((el) => el !== null);
          data[key].forEach((el, i) => {
            let emptyValues = 0;
            Object.keys(el).forEach((subkey) => {
              const val = el[subkey];
              if(val === '' || Number.isNaN(val)) {
                emptyValues ++;
              }
            });
            if(Object.keys(el).length == emptyValues) {
              data[key].splice(i, 1);
              if(data[key].length == 0) {
                // Why do we doing this? Issue 417, impossible to delete press in campaign geleral
                /*
                if(this.model[key]) {
                  data[key] = this.model[key];
                } else {
                  delete data[key];
                }
                */
                // fix for 417
                // this.model[key] = [];
                data[key] = [];
              }
            };
          });
        }
      }
    });
  },

  fixFieldsTypes(fields, data) {
    Object.keys(fields).forEach((key) => {
      const el = fields[key];
      if(el.type == 'string') {
        if (data && data[key]) {
          data[key] = app.helpers.format.unformatPrice(data[key]);
        }
      } else if(el.type == 'money') {
        if (data && data[key]) {
          data[key] = app.helpers.format.unformatPrice(data[key]);
        }
      } else if(el.type == 'nested' && data[key]) {
        if (Array.isArray(data[key]) && data[key].length) {
          data[key].forEach((val, index) => {
            api.fixFieldsTypes.call(this, el.schema, data[key][index]);
          });
        } else if (typeof(data[key]) === 'object' && data[key]) {
          Object.keys(data[key]).forEach((name) => {
            api.fixFieldsTypes.call(this, el.schema, data[key][name]);
          });
        }
      }
    });
  }
};
