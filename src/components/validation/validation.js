// require('./rules.js')
let validator = {
  required (data, attr, value) {
    // if (attr.required == true && value.hasValue() == false)
    // if (value.required == true) 
    if (!value) return true;

    return !!data[attr];
  },
};

let fixedFeatures = ['type', 'label', 'place'];

module.exports = {
  validate(rules, data, view) {
    let key = 'first_name';
    // lop through the rules
    for (let k in rules) {
      let field = rules[k];
      for (let k2 in field) {
        if (fixedFeatures.indexOf(k2) != -1) {
          debugger
          validator[k2](data, field ,field[k2])
          //require(data, 'first_name', true)
        }
      }
    }
    Backbone.Validation.callbacks.invalid(
          view, 'first_name', 'error message'
        );
    return false;
  }
};
