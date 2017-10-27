// Built in validators
// -------------------

module.exports = {
  patterns: {
    // Matches any digit(s) (i.e. 0-9)
    number: /^\d+(\.\d+)?$/,
    file: /^\d+(\.\d+)?$/,
    image: /^\d+(\.\d+)?$/,

    // Matches any number (e.g. 100.000)
    money: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,

    // Matches a valid email address (e.g. mail@example.com)
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

    // Mathes any valid url (e.g. http://www.xample.com)
    url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
  },

  messages: {
    required: 'Is required',
    acceptance: '{0} must be accepted',
    min: '{0} must be greater than or equal to {1}',
    max: '{0} must be less than or equal to {1}',
    range: '{0} must be between {1} and {2}',
    length: '{0} must be {1} characters',
    minLength: '{0} must be at least {1} characters',
    maxLength: '{0} must be at most {1} characters',
    rangeLength: '{0} must be between {1} and {2} characters',
    oneOf: 'Not a valid choice.',
    equalTo: '{0} must be the same as {1}',
    money: '{0} must only contain digits',
    digits: '{0} must only contain digits',
    number: '{0} must be a number',
    file: '{0} must be a file',
    image: '{0} must be an image',
    email: 'Invalid email', // email: '{0} must be a valid email',
    url: '{0} must be a valid url',
    inlinePattern: '{0} is invalid',
  },

  format: function () {
    var args = Array.prototype.slice.call(arguments);
    var text = args.shift();

    return text.replace(/\{(\d+)\}/g, function (match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : "";
    });
  },

  getData(data, name) {
    // Return data for json field and for regular field
    // Check if name have any . references - if yes it is json field
    // if not - it is regular field
    if(name.indexOf('.') == -1) {
      return data[name];
    } else {
      return name.split('.').reduce(function (o, i, currentIndex, array) {
        if (i.indexOf('[') != -1) {
          i = i.split('[');
          let k = i[0];
          i = i[1].replace(']', '');
          return o[k][i];
        }
        return o[i];
      }, data);
    }
  },

  // Determines whether or not a value is a number
  isNumber: function (value) {
    return app.utils.isNumber(value) || (app.utils.isString(value) && value.match(this.patterns.number));
  },

  // Determines whether or not a value is empty
  hasValue: function (value) {
    return !(app.utils.isNull(value) || app.utils.isUndefined(value) || (app.utils.isString(value) &&
          String.prototype.trim.call(value) === '') || (Array.isArray(value) && app.utils.isEmpty(value)));
  },

  // Function validator
  // Lets you implement a custom function used for validation
  fn: function (name, fn, attr, data, schema) {
    if (app.utils.isString(fn)) {
      fn = model[fn];
    }
    return fn.call(this, name, this.getData(data, name), attr, data, schema);
  },

  toNumber: function(value) {
    if (value && value.replace) value = value.replace(/\,/g, '');
    return (app.utils.isNumber(value) || (app.utils.isString(value) && value.match(this.patterns.number))) ? Number(value) : false;
  },

  // Required validator
  // Validates if the attribute is required or not
  // This can be specified as either a boolean value or a function that returns a boolean value
  required: function (name, rule, attr, data) {

    if (typeof(rule) == 'function') {
      rule = rule(name, attr, data);
    }

    if (rule && this.hasValue(this.getData(data, name)) == false) {
      throw this.format(
        attr.messageRequired || this.messages.required,
        attr.label
      );
    }
  },

  // Acceptance validator
  // Validates that something has to be accepted, e.g. terms of use
  // `true` or 'true' are valid
  // TODO FIX
  acceptance: function (name, rule, attr, data) {
    if (value !== 'true' && (!app.utils.isBoolean(value) || value === false)) {
      throw this.format(this.messages.acceptance);
    }
  },

  // Min validator
  // Validates that the value has to be a number and equal to or greater than
  // the min value specified
  min: function (name, rule, attr, data) {
    let value = this.toNumber(this.getData(data, name));
    if (value !== false && value < rule) {
      throw this.format(this.messages.min, attr.label, rule);
    }
  },

  min_value: function (name, rule, attr, data) {
    this.min(name, rule, attr, data);
  },

  // Max validator
  // Validates that the value has to be a number and equal to or less than
  // the max value specified
  max: function (name, rule, attr, data) {
    let value = this.toNumber(this.getData(data, name));
    if (value !== false && value > rule) {
      throw this.format(this.messages.max, attr.label, rule);
    }
  },

  max_value: function (name, rule, attr, data) {
    this.max(name, rule, attr, data);
  },

  // Range validator
  // Validates that the value has to be a number and equal to or between
  // the two numbers specified
  range: function (name, rule, attr, data) {
    let value = data[name];
    if (!this.isNumber(value) || value < rule[0] || value > rule[1]) {
      throw this.format(this.messages.range, attr.label, rule[0], rule[1]);
    }
  },

  // Length validator
  // Validates that the value has to be a string with length equal to
  // the length value specified
  length: function (name, rule, attr, data) {
    let value = this.getData(data, name);
    if (!app.utils.isString(value) || value.length !== rule) {
      throw this.format(this.messages.length, attr.label, rule);
    }
  },

  // Min length validator
  // Validates that the value has to be a string with length equal to or greater than
  // the min length value specified
  minLength: function (name, rule, attr, data) {
    let value = this.getData(data, name);
    if (!app.utils.isString(value) || value.length < rule) {
      throw this.format(this.messages.minLength, attr.label, rule);
    }
  },

  // Max length validator
  // Validates that the value has to be a string with length equal to or less than
  // the max length value specified
  maxLength: function (name, rule, attr, data) {
    let value = this.getData(data, name);
    if (!app.utils.isString(value) || value.length > rule) {
      throw this.format(this.messages.maxLength, attr.label, rule);
    }
  },

  // Range length validator
  // Validates that the value has to be a string and equal to or between
  // the two numbers specified
  rangeLength: function (name, rule, attr, data) {
    let value = this.getData(data, name);
    if (!app.utils.isString(value) || value.length < rule[0] || value.length+1 > rule[1]) {
      throw this.format(this.messages.rangeLength, attr.label, rule[0], rule[1]);
    }
  },

  // One of validator
  // Validates that the value has to be equal to one of the elements in
  // the specified array. Case sensitive matching
  oneOf: function (name, rule, attr, data) {
    let value = this.getData(data, name);
    if (Object.keys(rule).includes(value + "") === false) {
      throw this.format(this.messages.oneOf,  '');
    }
  },

  // Equal to validator
  // Validates that the value has to be equal to the value of the attribute
  // with the name specified
  equalTo: function (name, rule, attr, data, schema) {
    let value = this.getData(data, name);
    let equalTo =  this.getData(data, schema[attr.equal].name);
    if (value !== equalTo) {
      throw this.format(this.messages.equalTo, attr.label, data[schema[attr.equal].name]);
    }
  },

  // regex validator
  // Validates that the value has to match the pattern specified.
  // Can be a regular expression or the name of one of the built in patterns
  // We are testing only regex for empty set use required rule
  regex: function (name, attr, data, pattern) {
    let value = this.getData(data, name);

    // This is sucks ..
    // Quick fix for file, image and complex ojects
    // Fix this
    if(value && value.id) {
      value = value.id;
    }

    if (this.hasValue(value) && !value.toString().match(this.patterns[pattern] || pattern)) {
      throw this.format(this.messages[pattern], attr.label, pattern);
    }
  },
};
