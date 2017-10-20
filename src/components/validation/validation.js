const rules = require('./rules.js');
const fixedProps = ['type', 'label', 'placeholder'];
const fixedRegex = ['number', 'url', 'email', 'money', 'file', 'image'];

const escapeSelector = (selector) => {
  const rx = /\[\d*\]|\d/gi;

  if (rx.test(selector))
    selector = selector.replace(/\[/gi, '\\[').replace(/\]/gi, '\\]');

  return selector;
};


/*
function nestedFieldsRequired(name, attr, data) {
  // if one of the required field  not empty - all required field should be required
  const parentName = name.split('.')[0];
  Object.keys(attr[parentName]).forEach((el) => {
    if (attr[el].required && rules.getData(el, data)) {
      return true;
    }
  });
}


function nestedRequired(name, attr, data) {
  debugger;
  try {
    rules.required(name, attr.required_value, attr, data);
    if (Array.isArray(data) && data.length == 0) {
      return true;
    }
    if (Object.keys(data) == 0) {
      return true;
    }
  } catch(e) {
    return false;
  }
}
*/

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

        $el = $('<div class="alert alert-warning" role="alert"><p>' + msg + '</p></div><div class="help-block"></div>');

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
      if (rules.patterns[rule]) {
        rules.regex(name, attr, this.data, rule);
      }
    } catch (e) {
      this.finalResult = false;
      name = name.replace(/\[|\]\.|\./g, "__");
      Array.isArray(this.errors[name]) ? this.errors[name].push(e) : this.errors[name] = [e];
    }
  },

  runRules(attr, name) {
    this.runRule(attr.type, attr.type, name, attr);
    Object.keys(attr || {}).forEach((prop) => {
      const value = attr[prop];
      if (fixedProps.indexOf(prop) == -1) {
        this.runRule(prop, value, name, attr);
      }
    });

    if (attr.validate) {
      Object.keys(attr.validate).forEach((prop) => {
        if (prop == 'oneOf') {
          if (attr.validate[prop] == 'choices') {
            this.runRule(prop, attr.validate.choices, name, attr);
          } else {
            this.runRule(prop, attr.validate[prop].choices, name, attr);
          }
        } else {
          this.runRule(prop, attr.validate[prop], name, attr);
        }
      });
    }

  },

  validate(schema, data) {
    this.schema = schema;
    this.data = data;
    this.finalResult = true;
    this.errors = {};

    Object.keys(schema || {}).forEach((name) => {
      const attr = schema[name];
      if (attr.type == 'nested') {

        // attr.required_value = attr.required;
        // attr.required = nestedRequired;
        this.runRules(attr, name);

        Object.keys(attr.schema).forEach((subname) => {
          const subattr = attr.schema[subname];

          // Supress nested required, if parent is not required, non of the nested field can be required
          subattr.required = attr.required & subattr.required;
          // subattr.required = nestedRequired;

          if (attr.many === true) {
            for(let k = 0; k < data[name].length; k++) {
              this.runRules(subattr, name + '[' + k + '].' + subname);
            }
          } else {
            this.runRules(subattr, name + '.' + subname);
          }
        });
      } else {
        this.runRules(attr, name);
      }
    });
    return this.finalResult;
  },
};
