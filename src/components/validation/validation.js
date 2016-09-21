// require('./rules.js')
let validator = {
  required (data, field, value, view) {
    // if (attr.required == true && value.hasValue() == false)
    // if (value.required == true) 
    if (!value) return true;

    let result = !!data[field];

    if (!result) {
      Backbone.Validation.callbacks.invalid(
        view, field, 'required'
      );
    }

    return result;
  },
};

let fixedFeatures = ['type', 'label', 'placeholder'];

module.exports = {
  validate(rules, data, view) {
    let finalResult = true
    let key = 'first_name';
    // lop through the rules
    for (let k in rules) {
      let field = rules[k];
      for (let k2 in field) {
        if (fixedFeatures.indexOf(k2) == -1 && typeof validator[k2] == 'function' ) {
          if (!validator[k2](data, k ,field[k2], view)) finalResult = false;
        }
      }
    }

    return finalResult;
  }
};
