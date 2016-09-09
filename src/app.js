global.config = require('js/config');
global.jQuery = global.$ = require('jquery');
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.Validation = require('backbone-validation');
global.Tether = require('tether');
global.Bootstrap = require('bootstrap/dist/js/bootstrap.min.js');
global.userModel = require('./js/models/user.js');
global.Urls = require('./js/jsreverse.js');
require('jquery-serializejson/jquery.serializejson.min.js');

"use strict";

// require('sass/mixins_all.sass');

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
        $group = $el.parent();

        // if element not found - do nothing
        // we had clean alert-warning before submit
        if($el.length == 0) {
        }
        else {
            if($group.find('.help-block').length == 0) {
                $group = $group.parent();
            }
        }

        $group.removeClass('has-error');
        $group.find('.help-block').remove();
    },
    invalid: function (view, attr, error, selector) {
        let $el = view.$('#' + attr);
        var $group = null;

        if($el.length == 0) {
            $el = view.$('[name=' + attr + ']');
        }

        if(Array.isArray(error) !== true)
            error = [error]

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
                 $el.html() + '<p><b>' + view.fields[attr].label + ':</b> ' + error.join(',') + '</p>'
                );
            }
        }
        else {
            $group = $el.parent();
            $group.addClass('has-error');
            var $error_div = $group.find('.help-block');

            if($error_div.length != 0) {
                $error_div.html(error.join(','));
            }
            else {
                $group.append('<div class="help-block">' + error.join(',') + '</div>');
            }
        }

    }
});

$.fn.scrollTo = function(padding=0) {
    $('html, body').animate({
        scrollTop: $(this).offset().top - padding + 'px'
    }, 'fast');
    return this; // for chaining...
}

$.fn.equalHeights = function() {
    var maxHeight = 0,
        $this = $(this);

    $this.each( function() {
        var height = $(this).innerHeight();

        if ( height > maxHeight ) { maxHeight = height; }
    });

    return $this.css('height', maxHeight);
};

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


global.app = {
    $: jQuery,

    collections: {
    },

    models: {
        campaign: [],
        page: []
    },

    views: {
        campaign: [],
        page: []
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

    getModelInstance: function(model, name) {
        if (app.models[name]) return app.models[name];
        return app.models[name] = new model()
    },

    makeRequest: function(url, data, type) {

        let params = _.extend({
            url: serverUrl + url,
            data: data,
        }, app.defaultOptionsRequest);

        if(type) {
            params.type = type;
        } else {
            params.type = 'GET';
        }

        return $.ajax(params);
    },

    /*
     * Misc Display Functions
     *
     */
    showLoading: function() {
        $('.loader_overlay').show();
    },

    hideLoading: function(time) {
        time = time || 500;
        if(time > 0) {
            $('.loader_overlay').animate({
                opacity: 0
            }, time, function() {
                $(this).css('display', 'none');
                $(this).css('opacity', '1');
            });
        } else {
            $('.loader_overlay').css('display', 'block');
        }
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

    defaultSaveActions: {
        submit: function(e, data) {

            this.$el.find('.alert').remove();
            e.preventDefault();

            var data = data || $(e.target).serializeJSON();
            //var investment = new InvestmentModel(data);


            /*
            var newValidators = {};
            for(var k in this.fields) {
                if(k.required == true) {
                    newValidators[k] = baseModel.validation[k];
                }
            };
            this.model.validation = newValidators;
            */

            this.model.set(data);
            Backbone.Validation.bind(this, {model: this.model});

            if(this.model.isValid(true)) {
                var self = this;
                this.model.save().
                    then((data) => {
                        app.showLoading();
                        this.$el.find('.alert-warning').remove();
                        self.undelegateEvents();
                        $('.popover').popover('hide')
                        $('#content').scrollTo();

                        if(typeof this._success == 'function') {
                            this._success(data);
                        } else {
                            //window.location = '/api/campaign/' + this.model.get('id');
                            app.routers.navigate(
                                self.getSuccessUrl(data),
                                {trigger: true, replace: false}
                            );
                        }

                    }).
                    fail((xhr, status, text) => {
                        app.defaultSaveActions.error(this, xhr, status, text, this.fields);
                    });
            } else {
                if(this.$('.alert').length) {
                    $('#content').scrollTo();
                } else  {
                    this.$el.find('.has-error').scrollTo();
                }
            }
        },

        success: (view, response) => {
            view.$('.alert-warning').remove();
            if(typeof view._success == 'function') {
                view._success(response);
            }
        },

        error: (view, xhr, status, text, fields) => {
            if(view.hasOwnProperty('$el') == false) {
                view = {
                    '$el' : view
                };
            }
            view.$el.find('.alert-warning').remove();
            view.$el.find('.help-block').remove();

            if(xhr.hasOwnProperty('responseJSON')) {
                let data = xhr.responseJSON;

                data = data ? data : {'Server': status};
                for (let key in data)  {
                  Backbone.Validation.callbacks.invalid(
                    view, key, data[key]
                  );
                }
            }
            else if(xhr.hasOwnProperty('statusText')) {
                let s = '<strong>Errors:</strong> ';
                s += xhr.statusText;
                if(view.$el.find('form').length >= 1) {
                    view.$el.find('form').prepend("<div class='alert alert-warning' role='alert'>" + s + "<div>");
                } else {
                    view.$el.prepend("<div class='alert alert-warning' role='alert'>" + s + "<div>");
                }
            }
            if(view.$el.find('.alert').length) {
                view.$el.find('.alert').scrollTo();
            } else  {
                view.$el.find('.has-error').scrollTo();
            }
            app.hideLoading();
          }
    },

    defaultOptionsRequest: {
        type: 'OPTIONS',
        dataType: 'json',
        beforeSend: function(xhr) {
          // ToDo
          // Create that function as a default for beforeSend
          let token = localStorage.getItem('token');
          if (token !== null && token !== "") {
              xhr.setRequestHeader('Authorization', 'Token ' + token);
          }
        },
    },


    loadCss: function(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    },

    createFileDropzone: function(Dropzone, name, folderName, renameTo, onSuccess) {

      let params = {
        folder: folderName,
        file_name: name
      };

      if(typeof renameTo != 'undefined' && renameTo != '') {
        params['rename'] = renameTo;
      }

      let dropbox = new Dropzone(".dropzone__" + name, {
          url: serverUrl + Urls['image2-list'](),
          paramName: name,
          params: params,
          createImageThumbnails: false,
          clickable: '.dropzone__' + name + ' span',
          thumbnail: function(file, dataUrl) {
              console.log('preview', file, file.xhr, file.xhr.response, file.xhr.responseText);
          },
          previewTemplate: `<div class="dz-details">
            </div>
            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>`,
          headers: {
              'Authorization':  'Token ' + localStorage.getItem('token'),
              'Cache-Control': null,
              'X-Requested-With': null
          }
      });

      $('.dropzone__' + name).addClass('dropzone')//.html('Drop file here');

      /*
      dropbox.on('sending', function(data) {
          data.xhr.setRequestHeader("X-CSRFToken", getCSRF());
      });
      */

      dropbox.on('addedfile', function(file) {
          _(this.files).each((f, i) => {
            if(f.lastModified != file.lastModified) {
                this.removeFile(f);
            }
          });
          //this.removeFile(true);
      });

      dropbox.on("success", (file, data) => {
          $('.img-' + name).attr('src', data.url);
          $('.a-' + name).attr('href', data.origin_url).html(data.name);
          console.log(data);
          if(typeof onSuccess != 'undefined') {
            onSuccess(data);
          }
      });

    },

    getParams: function() {
          // gets url parameters and builds an object
          return _.chain(location.search.slice(1).split('&'))
          .map(function (item) { if (item) { return item.split('='); } })
          .compact()
          .object()
          .value();
    },

    getVideoId: function(url) {
        try {
            var provider = url.match(/https:\/\/(:?www.)?(\w*)/)[2],
            id;

            if(provider == "youtube") {
                id = url.match(/https:\/\/(?:www.)?(\w*).com\/.*v=(.*)/)[2];
            } else if (provider == "vimeo") {
                id = url.match(/https:\/\/(?:www.)?(\w*).com\/(\d*)/)[2];
            } else {
                console.log(url, "Takes a YouTube or Vimeo URL");
            }
            return id;
        } catch(err) {
                console.log(url, "Takes a YouTube or Vimeo URL");
        }
    },

    getThumbnail: function(size, thumbnails, _default) {
        let thumb = thumbnails.find(function(el) {
            console.log('v', el, size, el.size == size);
            return el.size == size
        });
        console.log('th', thumb);
        return (thumb ? thumb.url : _default || '/img/default/default.png')
    },
    getDropzoneUrl: function(name, attr, values) {
        // If we have data attribute for a file  - we will
        // try to find url that match our size
        if(values[name + '_data'] && attr.thumbSize) {
            let thumbnails = values[name + '_data'].thumbnails;
            console.log('v', thumbnails, );
            return app.getThumbnail(attr.thumbSize, thumbnails, attr.default || '/img/default/default.png');
        } else {
            return attr.default || '/img/default/default.png'
        }
    }
};

_.extend(app, Backbone.Events);
app.user = new userModel();

// app routers
require('routers');

app.user.load();
app.trigger('userReady');

global.app = app;

$('body').on('click', '.auth-pop', function() {
    $('#loginModal').modal();
});

const popoverTemplate = '<div class="popover divPopover" role="tooltip"><span class="popover-arrow"></span> <h3 class="popover-title"></h3> <span class="icon-popover"><i class="fa fa-info-circle" aria-hidden="true"></i></span> <span class="popover-content"> XXX </span></div>';


$('body').on('mouseover', 'div.showPopover', function() {
    var el = $(this);
    if(el.attr('aria-describedby') == null) {
        $(this).popover({
            html: true,
            template: popoverTemplate,
        });
        $(this).popover('show');
    }
});
$('body').on('focus', 'input.showPopover', function() {
    var el = $(this);
    if(el.attr('aria-describedby') == null) {
        $(this).popover({
            html: true,
            template: popoverTemplate.replace('divPopover', 'inputPopover'),
        });
        $(this).popover('show');
    }
});
$('body').on('focus', 'textarea.showPopover', function() {
    var el = $(this);
    if(el.attr('aria-describedby') == null) {
        $(this).popover({
            html: true,
            template: popoverTemplate.replace('divPopover', 'textareaPopover'),
        });
        $(this).popover('show');
    }
});

 // show bottom logo while scrolling page
$(window).scroll(function(){
    var $bottomLogo = $('#fade_in_logo'),
        offsetTopBottomLogo = $bottomLogo.offset().top;

    if (($(window).scrollTop() + $(window).height() >= offsetTopBottomLogo) && !$bottomLogo.hasClass('fade-in') ) {
        $bottomLogo.addClass('fade-in');
    }
});

// для показа биографии на стр. pg/team
$('body').on('click', '.team-member-list article', function(){
    var targetTextId = $(this).data('id-text');

    if ($(targetTextId).hasClass('open')) {
        $(targetTextId).removeClass('open').slideUp();
    } else {
        $(this).closest('.team-member-list').find('.biography-text.open').removeClass('open').hide();
        $(targetTextId).addClass('open').slideDown();
    }
});

// scripts for mobile menu
$('body').on('click', '#toggle_mobile_menu', function(){
    $('html').toggleClass('show-menu');

});

$('html').on('click', function(){
    if ($('header').hasClass('no-overflow')) {
        $('header').removeClass('no-overflow');
    }
});

$('body').on('click', '.user-info', function(){
    if ($('.navbar-toggler:visible').length !== 0) {
        $('html').removeClass('show-menu');
        $('header').toggleClass('no-overflow');
    }
    return false;
});


$('body').on('click', '#menuList .nav-item', function(event){
    var href = $(event.target).attr('href');

    if ($('.navbar-toggler:visible').length !== 0) {
        $(this).find('.list-container').slideToggle();

        if (href.indexOf('/') != -1) {
            $('html').toggleClass('show-menu');
        }
    }

});

$('body').on('click', 'a', function(event) {
    var href = event.currentTarget.getAttribute('href');
    if(href == window.location.pathname) {
        window.location.reload();
    } else if(href && href != '' && href.substr(0,1) != '#' &&
        href.substr(0, 4) != 'http' &&
        href.substr(0,3) != 'ftp' &&
        href != 'javascript:void(0);' &&
        href != 'javascript:void(0)' &&
        event.currentTarget.getAttribute('target') == null) {
        event.preventDefault();
        app.showLoading();

        // If we already have that url in cache - we will just update browser location
        // and set cache version of the page
        // overise we will trigger app router function
        var url = href;

        $('#content').undelegate();
        $('form').undelegate();
        $('.popover').popover('hide')
        if(app.cache.hasOwnProperty(url) == false) {
            app.routers.navigate(
                url,
                {trigger: true, replace: false}
            );
            app.trigger('userReady');
            app.trigger('menuReady');
        } else {
            app.hideLoading();
            $('#content').html(app.cache[url]);
            app.routers.navigate(
                url,
                {trigger: false, replace: false}
            );
            app.trigger('userReady');
            app.trigger('menuReady');
        }
    }
});
