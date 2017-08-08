Backbone.View.prototype.assignLabels = function () {
  _(this.fields).each((el, key) => {
    if (el.type == 'nested') {
      _(el.schema).each((subel, subkey) => {
        if (this.labels[key])
          subel.label = this.labels[key][subkey];
      });
    } else {
      el.label = this.labels[key];
    }
  });
};

Backbone.View.prototype.checkForm = function () {
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
};

$.fn.scrollTo = function (padding=0, duration='fast') {
  $('html, body').animate({
    scrollTop: $(this).offset().top - padding + 'px',
  }, duration);
  return this;
};

$.fn.equalHeights = function () {
  var maxHeight = 0;
  var $this = $(this);

  $this.each(function () {
    var height = $(this).innerHeight();
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  return $this.css('height', maxHeight);
};

$.fn.animateCount = function(options={}) {
  const defaultOptions = {
    duration: 1000,
    easing: 'swing',
    step(now) {
      $(this).text(Math.ceil(now));
    }
  };

  options = _.extend(defaultOptions, options);

  $(this).each(function() {
    const $this = $(this);
    $this.prop('Counter', 0).animate({
      Counter: $this.text(),
    }, options);
  });
};

$.serializeJSON.defaultOptions = _.extend($.serializeJSON.defaultOptions, {
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