const rules = require('./rules.js');
const fixedProps = ['type', 'label', 'placeholder'];
const fixedRegex = ['number', 'url', 'email', 'money', 'file', 'image'];

const escapeSelector = (selector) => {
  const rx = /\[\d*\]|\d/gi;

  if (rx.test(selector))
    selector = selector.replace(/\[/gi, '\\[').replace(/\]/gi, '\\]');

  return selector;
};

module.exports = {
  clearMsg(view, attr, selector) {
    attr = escapeSelector(attr);

    var $el = view.$('[name=' + attr + ']');
    var $group = $el.parent();

    // if element not found - do nothing
    // we had clean alert-warning before submit
    if ($el.length != 0) {
      if ($group.find('.help-block').length == 0) {
        $group = $group.parent();
      }
    }

    $group.removeClass('has-error');
    $group.find('.help-block').remove();
  },

  invalidMsg: function (view, attr, error, selector) {
    // If we have error for json/nested fieds
    // we need get all keys and show error for each key
    // individually
    if (Array.isArray(error) !== true && typeof error == 'object') {
      Object.keys(error).forEach((k) => {
        const el = error[k];
        Object.keys(el).forEach((key) => {
          const errors = el[key];
          this.invalidMsg(view, attr + '__' + k + '__' + key, errors, selector);
        });
      });
      return false;
    }

    // Temp hack for nested fields
    if (attr.indexOf('__') !== -1) {
      let t = $('#' + attr).parents('.shown-yes');
      if (t.length != 0 && t.css('display') == 'none') {
        t.show();
      }
    }

    let $el = null;
    try {
      $el = view.$('#' + attr);
    } catch(e){}


    if (!$el || !$el.length) {
      attr = escapeSelector(attr);
      $el = view.$('[name=' + attr + ']');
    }

    if (Array.isArray(error) !== true) {
      error = [error];
    }

    error = error.map(err => err.endsWith('.') ? err.substring(0, err.length - 1) : err);
    let errorMsg = error.join(', ') + '.';

    // if element not found - we will show error just in alert-warning div
    if ($el.length == 0) {
      $el = view.$('form > .alert-warning');

      // If we don't have alert-warning - we should create it as
      // first element in form
      if ($el.length == 0) {
        let msg = attr == 'non_field_errors' ? '' : ('<b>' + attr + ':</b> ');
        msg += errorMsg;

        $el = $('<div class="alert alert-warning" role="alert"><p>' + msg + '</p></div>');

        if (view.$el.find('form').length == 0) {
          view.$el.prepend($el);
        } else {
          view.$el.find('form').prepend($el);
        }
      } else {
        $el.html(
          $el.html() + '<p><b>' + attr + ':</b> ' +
          errorMsg + '</p>'
        );
      }
    } else {
      let $group = $el.parent();
      $group.addClass('has-error');
      let $errorDiv = $group.find('.help-block');
      if ($errorDiv.length)
        $errorDiv.html(errorMsg);
      else
        $group.append('<div class="help-block">' + errorMsg + '</div>');
    }
  },

  runRule(rule, value, name, attr) {
    try {
      if (rules[rule]) {
        rules[rule](name, value, attr, this.data, this.schema);
      }
    } catch (e) {
      this.finalResult = false;
      name = name.replace(/\./g, '__');
      Array.isArray(this.errors[name]) ? this.errors[name].push(e) : this.errors[name] = [e];
    }
  },

  runRules(attr, name) {
    Object.keys(attr || {}).forEach((prop) => {
      const value = attr[prop];
      if (fixedProps.indexOf(prop) == -1) {
        this.runRule(prop, value, name, attr);
      }
    });
  },

  validate(schema, data) {
    this.schema = schema;
    this.data = data;
    this.finalResult = true;
    this.errors = {};

    Object.keys(schema || {}).forEach((name) => {
      const attr = schema[name];
      // TODO
      // How to check nested one element if that can be blank ?
      // requiredTemp - temp fix to validate fields on investment page only
      if (attr.type == 'nested' && attr.requiredTemp == true) {
        Object.keys(attr.schema).forEach((subname) => {
          const subattr = attr.schema[subname];
          if (fixedRegex.indexOf(subattr.type) != -1) {
            if (Array.isArray(subattr.validate)) {
              subattr.validate.forEach((jsonFields, index) => {
                try {
                  rules.regex(name, subattr, data, subattr.type);
                  this.runRules(subattr, name);
                } catch (e) {
                  this.finalResult = false;
                  Array.isArray(this.errors[name])
                    ? this.errors[name].push(e)
                    : this.errors[name] = [e];
                }
              });
            } else if (typeof(subattr.validate) === 'object') {
              Object.keys(subattr.validate).forEach((key) => {
                try {
                  rules.regex(name, subattr, data, subattr.type);
                  this.runRules(subattr, name);
                } catch (e) {
                  this.finalResult = false;
                  Array.isArray(this.errors[name])
                    ? this.errors[name].push(e)
                    : this.errors[name] = [e];
                }
              });
            }
          } else {
            this.runRules(subattr, name + '.' + subname);
          }
        });
        if (attr.fn) {
          this.runRule('fn', attr.fn, name, attr);
        }
      } else if (fixedRegex.indexOf(attr.type) != -1) {
        try {
          rules.regex(name, attr, data, attr.type);
          this.runRules(attr, name);
        } catch (e) {
          this.finalResult = false;
          Array.isArray(this.errors[name]) ? this.errors[name].push(e) : this.errors[name] = [e];
        }
      } else {
        this.runRules(attr, name);
      }
    });
    return this.finalResult;
  },
};
