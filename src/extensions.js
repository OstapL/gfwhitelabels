//Backbone.View extension methods
Object.assign(Backbone.View.prototype, {

  listenToNavigate() {
    app.routers.on('before-navigate', this.onBeforeNavigate, this);
  },

  assignLabels() {
    Object.keys(this.fields).forEach((key) => {
      const el = this.fields[key];
      if (el.type == 'nested') {
        Object.keys(el.schema || {}).forEach((subkey) => {
          const subel = el.schema[subkey];
          if (this.labels[key])
            subel.label = this.labels[key][subkey];
        });
      } else {
        el.label = this.labels[key];
      }
    });
  },

  checkForm() {
    if (app.getParams().check == '1') {
      if (!app.validation.validate(this.fields, this.model, this)) {
        Object.keys(app.validation.errors).forEach((key) => {
          let errors = app.validation.errors[key];
          if (this.el.querySelector('#' + key)) {
            app.validation.invalidMsg(this, key, errors);
          }
        });

        if(this.el.querySelector('.help-block') != null) {
          this.$('.help-block').prev().scrollTo(5);
        }
      }
    }
  },

  destroy(e) {
    if (this.fields) {
      Object.keys(this.fields).forEach((name) => {
        const field = this.fields[name];
        if (typeof(field.destroy) === 'function')
          field.destroy();
      });
    }

    this.undelegateEvents();

    if (this.onBeforeNavigate) {
      app.routers.off('before-navigate', this.onBeforeNavigate, this);
    }

    // ToDo
    // Refactor
    $('.popover').remove();
    $('.modal-backdrop').remove();
    $('.modal-open').removeClass('modal-open');
  },

});

//Backbone.Router extension methods
const navigate = Backbone.Router.prototype.navigate;

Object.assign(Backbone.Router.prototype, {

  navigate(fragment, options) {
    const outData = {
      preventNavigate: false,
    };

    this.trigger('before-navigate', outData);

    if (outData.preventNavigate)
      return false;

    return navigate.call(this, fragment, options);
  },

});

//jQuery extensions methods
Object.assign($.fn, {

  scrollTo(padding=0, duration='fast') {
    $('html, body').animate({
      scrollTop: $(this).offset().top - padding + 'px',
    }, duration);
    return this;
  },

  equalHeights() {
  var maxHeight = 0;
  var $this = $(this);

  $this.each(function () {
    var height = $(this).innerHeight();
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  return $this.css('height', maxHeight);
},

});

$.fn.animateCount = function(options={}) {
  const defaultOptions = {
    duration: 1000,
    easing: 'swing',
    step(now) {
      $(this).text(Math.ceil(now));
    }
  };

  options = Object.assign(defaultOptions, options);

  $(this).each(function() {
    const $this = $(this);
    $this.prop('Counter', 0).animate({
      Counter: $this.text(),
    }, options);
  });
};

$.serializeJSON.defaultOptions = Object.assign($.serializeJSON.defaultOptions, {
  customTypes: {
    decimal(val) {
      return app.helpers.format.unformatPrice(val);
    },
    percent(val) {
      return app.helpers.format.unformatPercent(val);
    },
    money(val) {
      return app.helpers.format.unformatMoney(val);
    },
    integer(val) {
      return parseInt(val);
    },
    url(val) {
      return String(val);
    },
    text(val) {
      return String(val);
    },
    email(val) {
      return String(val);
    },
    password(val) {
      return String(val);
    },
  },
  useIntKeysAsArrayIndex: true,
  parseNulls: true,
  parseNumbers: true
});
