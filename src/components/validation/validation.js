const rules = require('./rules.js');
const fixedProps = ['type', 'label', 'placeholder'];
const fixedRegex = ['number', 'url', 'email', 'money', ];

module.exports = {
  runRule(rule, value, name, attr) {
    try {
      rules[rule](name, value, attr, this.data, this.schema);
      Backbone.Validation.callbacks.valid(this.view, name);
    } catch(e) {
      this.finalResult = false;
      Backbone.Validation.callbacks.invalid(this.view, name, e);
    } 
  },

  runRules(attr, name) {
    _(attr).each((value, prop) => {
      if(fixedProps.indexOf(prop) == -1) {
        this.runRule(prop, value, name, attr);
      }
    });
  },

  validate(schema, data, view) {
    this.schema = schema;
    this.data = data;
    this.view = view;
    this.finalResult = true

    _(schema).each((attr, name) => {
      if(fixedRegex.indexOf(attr.type) != -1) {
        try {
          data[name] = rules.regex(name, attr, data);
          this.runRules(attr, name);
        } catch(e) {
          finalResult = false;
          Backbone.Validation.callbacks.invalid(view, name, e);
        } 
      } else {
        this.runRules(attr, name);
      }
    });

    return this.finalResult;
  }
};
