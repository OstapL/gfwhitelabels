// При выводе ошибок для форм у нас может быть две ситуации:
// 1. Мы выводим ошибку для элементы который у нас есть в форме => 
// нам нужно вывести это ошибку в help-block рядом с тем элементом где была ошибка
//
// 2. Мы выводим ошибку для элемента которого у нас в форме нет или это глобальная ошибка
// => Нам нужно вывести сообщение в .alert-warning и при необиходимости создать его
// See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
//
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var $el = view.$('[name=' + attr + ']');
        var $group = null;

        // if element not found - do nothing
        // we had clean alert-warning before submit
        if($el.length == 0) {
        }
        else {
            $group = $el.parent();
            if($group.find('.help-block').length == 0) {
                $group = $group.parent();
            }
        }

        $group.removeClass('has-error');
        $group.find('.help-block').html(error).addClass('hide');
    },
    invalid: function (view, attr, error, selector) {
        var $el = view.$('[name=' + attr + ']');
        var $group = null;

        // if element not found - we will show error just in alert-warning div 
        if($el.length == 0) {
            $el = view.$('form > .alert-warning');

            // If we don't have alert-warning - we should create it as 
            // first element in form
            if($el.length == 0) {
                $el = $('<div class="alert alert-warning" role="alert">' +
                    error.join(',') + '</div>');
                view.$('form').prepend($el);
            }
            else {
                $el.html(
                 $el.html() + '<p>' + error.join(',') + '</p>'
                );
            }
        }
        else {
            $group = $el.parent();
            if($group.find('.help-block').length == 0) {
                $group = $group.parent();
            }
            $group.addClass('has-error');
            $group.find('.help-block').html(error).removeClass('hide');
        }

        console.log(view, attr, error, selector);
    }
});

var defaultSaveActions = {
    success: (view, response) => {
        view.$('.alert-warning').remove();
        if(typeof this._success == 'function') {
            this._success(response);
        }
    },
    error: (view, xhr, status, text) => {
        if(xhr.hasOwnProperty('responseJSON')) {
            let data = xhr.responseJSON;
            for (let key in data)  {                                                 
              Backbone.Validation.callbacks.invalid(                                 
                view, key, data[key]
              );
            }
        }
        else if(xhr.hasOwnProperty('statusText')) {
            let s = '<strong>Errors:</strong> ';
            s += xhr.statusText;
            view.$.prepend("<div class='alert alert-warning' role='alert'>" + s + "<div>");
        }
        if(view.$el.find('.alert').length) {
            view.$el.find('.alert').scrollTo();
        }
        app.hideLoading();
      }
};


(function($) {
    $.fn.scrollTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}


/*
var csrfTocken = '';
function getCSRF() {
  if(csrfTocken == '') {
    csrfTocken = $('input[name="csrfmiddlewaretoken"]').val();
  }
  return csrfTocken;
}
*/

var oldSync = Backbone.sync;
Backbone.sync = function(method, model, options){
  options.beforeSend = function(xhr){
    //xhr.setRequestHeader('X-CSRFToken', getCSRF());
    let token = localStorage.getItem('token');
    if (token !== null && token !== "") {
        xhr.setRequestHeader('Authorization', 'Token ' + token);
    }
  };
  return oldSync(method, model, options);
};

// https://github.com/hongymagic/jQuery.serializeObject
$.fn.serializeObject = function () {
    "use strict";
    var a = {}, b = function (b, c) {
        var d = a[c.name];
        "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
    };
    return $.each(this.serializeArray(), b), a
};

// https://github.com/hongymagic/jQuery.serializeObject
$.fn.serializeRepeatableObject = function () {
    "use strict";
    var a = {}, b = function (b, c) {
        var d = '';
        if(c.name.indexOf('//') !== -1) {
            var n = c.name.split('//');
            if(a[n[0]] === undefined) {
                a[n[0]] = {};
            }
            if(typeof a[n[0]][n[1]] == 'string' || typeof a[n[0]][n[1]] == 'number') {
                a[n[0]][n[1]] = [a[n[0]][n[1]]];
            }
            if(a[n[0]][n[1]] === undefined) {
                a[n[0]][n[1]] = c.value;
            }
            c.name = n[1];
            d = a[n[0]][n[1]];
        }
        else {
            d = a[c.name];
        }
        "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
    };
    return $.each(this.serializeArray(), b), a
};

function repeatToJSonString(obj) {
    // Repeatable fields 
    // Should comes by 2 fields
    for(var k in obj) {
        if(k.indexOf('repeat:') !== -1) {
            var key = k.replace('repeat:', '');
            var n = {};
            var repeat_keys = Object.keys(obj[k]);

            for(var kk in obj[k]) {
                if(obj[k][kk][0]) {
                        n[kk] = obj[k][kk];
                }
            }

            /*
            var key_k = Object.keys(obj[k])[0];
            var key_v = Object.keys(obj[k])[1];
            for(var j in obj[k][key_k]) {
                if(obj[k][key_k][j] || obj[k][key_v][j]) {
                    var o = {};
                    o[obj[k][key_k][j]] = obj[k][key_v][j];
                    n.push(o);
                }
            }
            */
            console.log(n);
            obj[key] = n;
            delete obj[k];
        }
    }
    return obj;
};

var BaseView = Backbone.View.extend({
  el: '.bbSection',

  events: {
    'submit form': 'updateForm',
  },

  initialize: function () {
    //Backbone.Validation.bind(this);
  },

  updateForm: function(e) {
    e.preventDefault();
    var data = $(e.target).serializeObject();
    this.model.set(data);

    this.$el.find('.alert').remove();

    if(this.model.isValid(true)) {
      this.model.save(data, {
        success: (response) => {
          if(response.success == 1) {
            this.$el.prepend("<div class='alert alert-success' role='alert'>We saved your chanes<div>");
            if(typeof this.onSuccessSave == 'function') {
                this.onSuccessSave();
            }
          }
          else {
            var s = '<h2>Please fix that errors:</h2> ';
            for (var key in response)  {
              s += key + ': ' + response[key] + '<br />';
            }
            this.$el.prepend("<div class='alert alert-danger' role='alert'>" + s + "<div>");
          }
        },
        error: (response) => {
          var s = 'Errors: ';
          if(response.hasOwnProperty('statusText')) {
              s += response.statusText;
          } else {
              for (var key in data)  {                                           
                s += key + ': ' + data[key];
              }                                                                        
          }
          this.$el.prepend("<div class='alert alert-danger' role='alert'>" + s + "<div>");
        }
      });
    }
  },
});

function beautifullNumber(val) {

    if(val < 1000)
        return val;

    if(val % 1000 != 0) {
        val = ((val/1000) + '').replace('.',',') + '00';
    } else {
        val = (val/1000) + ',000';
    }

    return val;
}

function createFileDropzone(name, folderName, renameTo, onSuccess) {

  let params = {
    folder: folderName,
    file_name: name
  };

  if(typeof renameTo != 'undefined' && renameTo != '') {
    params['rename'] = renameTo;
  }
  console.log('params', params);

  let dropbox = new Dropzone(".dropzone__" + name, {
      url: Urls['file_uploader'](),
      paramName: name,
      params: params
  });

  $('.dropzone__' + name).addClass('dropzone').html('Drop file here');

  dropbox.on('sending', function(data) {
      data.xhr.setRequestHeader("X-CSRFToken", getCSRF());   
  });

  dropbox.on('addedfile', function(file) {
      _(this.files).each((f, i) => {
        if(f.lastModified != file.lastModified) {
            this.removeFile(f);
        }
      });
      //this.removeFile(true);
  });

  dropbox.on("success", (file, data) => {
      data = JSON.parse(data);
      if(typeof onSuccess != 'undefined') {
        onSuccess(data);
      }
  });

}
