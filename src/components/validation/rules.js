// Built in validators
// -------------------

module.exports = {
  patterns: {
    // Matches any digit(s) (i.e. 0-9)
    number: /^\d+$/,

    // Matches any number (e.g. 100.000)
    money: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,

    // Matches a valid email address (e.g. mail@example.com)
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

    // Mathes any valid url (e.g. http://www.xample.com)
    url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
  },

  messages: {
    required: '{0} is required',
    acceptance: '{0} must be accepted',
    min: '{0} must be greater than or equal to {1}',
    max: '{0} must be less than or equal to {1}',
    range: '{0} must be between {1} and {2}',
    length: '{0} must be {1} characters',
    minLength: '{0} must be at least {1} characters',
    maxLength: '{0} must be at most {1} characters',
    rangeLength: '{0} must be between {1} and {2} characters',
    oneOf: '{0} must be one of: {1}',
    equalTo: '{0} must be the same as {1}',
    digits: '{0} must only contain digits',
    number: '{0} must be a number',
    email: '{0} must be a valid email',
    url: '{0} must be a valid url',
    inlinePattern: '{0} is invalid',
  },

  format: function () {
    var args = Array.prototype.slice.call(arguments);
    var text = args.shift();

    return text.replace(/\{(\d+)\}/g, function (match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  },

  // Determines whether or not a value is a number
  isNumber: function (value) {
    return _.isNumber(value) || (_.isString(value) && value.match(defaultPatterns.number));
  },

  // Determines whether or not a value is empty
  hasValue: function (value) {
    return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) &&
          String.prototype.trim.call(value) === '') || (_.isArray(value) && _.isEmpty(value)));
  },

  // Function validator
  // Lets you implement a custom function used for validation
  fn: function (value, attr, fn, model, computed) {
    if (_.isString(fn)) {
      fn = model[fn];
    }

    return fn.call(model, value, attr, computed);
  },

  // Required validator
  // Validates if the attribute is required or not
  // This can be specified as either a boolean value or a function that returns a boolean value
  required: function (name, rule, attr, data) {
    if (rule && this.hasValue(data[name]) == false) {
      throw this.format(this.messages.required, attr.label);
    }
  },

  // Acceptance validator
  // Validates that something has to be accepted, e.g. terms of use
  // `true` or 'true' are valid
  // TODO FIX
  acceptance: function (name, rule, attr, data) {
    if (value !== 'true' && (!_.isBoolean(value) || value === false)) {
      throw this.format(this.messages.acceptance);
    }
  },

  // Min validator
  // Validates that the value has to be a number and equal to or greater than
  // the min value specified
  min: function (name, rule, attr, data) {
    let value = data[attr];
    if (!isNumber(value) || value < rule) {
      throw this.format(this.messages.min, attr.label, rule);
    }
  },

  min_value: function (name, rule, attr, data) {
    this.min(nam, rule, attr, data);
  },

  // Max validator
  // Validates that the value has to be a number and equal to or less than
  // the max value specified
  max: function (name, rule, attr, data) {
    let value = data[name];
    if (!isNumber(value) || value > rule) {
      throw this.format(this.messages.max, attr.label, rule);
    }
  },

  max_value: function (name, rule, attr, data) {
    this.max(nam, rule, attr, data);
  },

  // Range validator
  // Validates that the value has to be a number and equal to or between
  // the two numbers specified
  range: function (name, rule, attr, data) {
    let value = data[name];
    if (!isNumber(value) || value < rule[0] || value > rule[1]) {
      throw this.format(this.messages.range, attr.label, rule[0], rule[1]);
    }
  },

  // Length validator
  // Validates that the value has to be a string with length equal to
  // the length value specified
  length: function (name, rule, attr, data) {
    let value = data[name];
    if (!_.isString(value) || value.length !== rule) {
      throw this.format(this.messages.length, attr.label, rule);
    }
  },

  // Min length validator
  // Validates that the value has to be a string with length equal to or greater than
  // the min length value specified
  minLength: function (name, rule, attr, data) {
    let value = data[name];
    if (!_.isString(value) || value.length < rule) {
      throw this.format(this.messages.minLength, attr.label, rule);
    }
  },

  // Max length validator
  // Validates that the value has to be a string with length equal to or less than
  // the max length value specified
  maxLength: function (name, rule, attr, data) {
    if (!_.isString(value) || value.length > rule) {
      throw this.format(this.messages.maxLength, attr.label, rule);
    }
  },

  // Range length validator
  // Validates that the value has to be a string and equal to or between
  // the two numbers specified
  rangeLength: function (name, rule, attr, data) {
    let value = data[name];
    if (!_.isString(value) || value.length < rule[0] || value.length > rule[1]) {
      throw this.format(this.messages.rangeLength, attr.label, rule[0], rule[1]);
    }
  },

  // One of validator
  // Validates that the value has to be equal to one of the elements in
  // the specified array. Case sensitive matching
  oneOf: function (name, rule, attr, data) {
    let value = data[name];
    if (!_.include(rule, value)) {
      throw this.format(this.messages.oneOf,  attr.label, rule.join(', '));
    }
  },

  // Equal to validator
  // Validates that the value has to be equal to the value of the attribute
  // with the name specified
  equalTo: function (name, rule, attr, data, schema) {
    let value = data[name];
    let equalTo = data[schema[attr.equal].name];
    if (value !== equalTo) {
      throw this.format(this.messages.equalTo, attr.label, data[schema[attr.equal].name]);
    }
  },

  // regex validator
  // Validates that the value has to match the pattern specified.
  // Can be a regular expression or the name of one of the built in patterns
  // We are testing only regex for empty set use required rule
  regex: function (name, attr, data, pattern) {
    let value = data[name];
    if (this.hasValue(value) && !value.toString().match(this.patterns[pattern] || pattern)) {
      throw this.format(this.messages[pattern], attr.label, pattern);
    }
  },
};
