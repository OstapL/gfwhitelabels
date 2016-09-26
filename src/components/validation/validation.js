const rules = require('./rules.js');
const fixedProps = ['type', 'label', 'placeholder'];
const fixedRegex = ['number', 'url', 'email', 'money'];

module.exports = {
  runRule(rule, value, name, attr) {
    try {
      if (rules[rule])
        rules[rule](name, value, attr, this.data, this.schema);
      //Backbone.Validation.callbacks.valid(this.view, name);
    } catch (e) {
      this.finalResult = false;
      Array.isArray(this.errors[name]) ? this.errors[name].push(e) : this.errors[name] = [e];
    }
  },

  runRules(attr, name) {
    _(attr).each((value, prop) => {
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

    _(schema).each((attr, name) => {
      if (fixedRegex.indexOf(attr.type) != -1) {
        try {
          rules.regex(name, attr, data, attr.type);
          this.runRules(attr, name);
        } catch (e) {
          this.finalResult = false;
          console.log(e);
          Array.isArray(this.errors[name]) ? this.errors[name].push(e) : this.errors[name] = [e];
          //Backbone.Validation.callbacks.invalid(view, name, e);
        }
      } else {
        this.runRules(attr, name);
      }
    });

    return this.finalResult;
  },
};
