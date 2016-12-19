let exports = {
  prepareNestedField(nestedName, name, value, index, myAttr, schema) {
    if(value == null) {
      console.log('value for ' + name + ' is null ')
      value = {}
    }
    _.extend(myAttr, schema);
    myAttr.value = value[name] ? value[name]: '';
    myAttr.id = nestedName + '__' + index + '__' + name + '';
  },

  /* 
   * VLAD: я не знаю где это используется 
  nestedTextLabel(nestedName, name, myAttr, vals) {
    vals = vals || values;
    myAttr = _.extend(myAttr, fields[nestedName].schema[name]);
    myAttr.value = vals[name] ? vals[name] : '';

    return this.textLabel(
      nestedName + '[' + name + ']',
      myAttr
    )
  },

  nestedText(nestedName, name, myAttr, vals) {
    vals = vals || values;
    myAttr = _.extend(myAttr, fields[nestedName].schema[name]);
    myAttr.value = vals[name] ? vals[name] : '';

    return this.fieldText(
      nestedName + '[' + name + ']',
      myAttr
    )
  },
  */

  nestedTextLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'text-lg-right col-lg-3 col-md-12 text-md-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-lg-9 col-md-12';
    return this.textLabel(
      nestedName + '[' + index + '][' + name + ']',
      myAttr
    )
  },

  nestedTextareaLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'text-lg-right col-lg-3 col-md-12 text-md-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-lg-9 col-md-12';
    return this.textareaLabel(
      nestedName + '[' + index + '][' + name + ']',
      myAttr
    )
  },

  nestedChoiceLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'text-lg-right col-lg-3 col-md-12 text-md-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-lg-9 col-md-12';
    return this.choiceLabel(
      nestedName + '[' + index + '][' + name + ']',
      myAttr
    )
  },

  nestedRadioLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'text-lg-right col-lg-3 col-md-12 text-md-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-lg-9 col-md-12';
    return this.radioLabel(
      nestedName + '[' + index + '][' + name + ']',
      myAttr
    )
  },

  nestedDateDay(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class = myAttr.class ? myAttr.class : 'col-lg-6 p-r-0';
    myAttr.id = myAttr.id + '__day'
    return this.dateDay(
      nestedName + '[' + index + '][' + name + ']',
      myAttr
    )
  },

  nestedDateMonth(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class = myAttr.class ? myAttr.class : 'col-lg-6 p-r-0';
    myAttr.id = myAttr.id + '__month'
    return this.dateMonth(
      nestedName + '[' + index + '][' + name + ']',
      myAttr
    )
  },

  nestedDateYear(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class = myAttr.class ? myAttr.class : 'col-lg-6 p-r-0';
    myAttr.id = myAttr.id + '__year'
    return this.dateYear(
      nestedName + '[' + index + '][' + name + ']',
      myAttr
    )
  },

  prepareField(name, attr) {
    if(attr.schema) {
      attr = _.extend(attr, attr.schema)
      delete attr.schema;
    }
    if(attr.placeholder == null || attr.placeholder == "") {
      attr.placeholder = attr.label || '';
    }
    if(attr.required == true) {
      attr.label += '<span class="color-red">*</span>';
    }
  },

  textLabel(name, attr) {
    attr.name = name;
    this.prepareField(name, attr);
    const template = require('./templates/textLabel.pug');
    return template(attr);
  },

  dateDay(name, attr) {
    attr.name = name;
    prepareField(name, attr);
    attr.value = attr.value && attr.value.indexOf('-') != -1 ? attr.value.split('-')[2] : '';
    //const template = require('./templates/dateDay.pug');
    return template(attr);
  },

  dateMonth(name, attr) {
    attr.name = name;
    prepareField(name, attr);
    attr.value = attr.value && attr.value.indexOf('-') != -1 ? attr.value.split('-')[1] : '';
    //const template = require('./templates/dateMonth.pug');
    return template(attr);
  },

  dateYear(name, attr) {
    attr.name = name;
    prepareField(name, attr);
    attr.value = attr.value && attr.value.indexOf('-') != -1 ? attr.value.split('-')[0] : '';
    //const template = require('./templates/dateYear.pug');
    return template(attr);
  }
}

module.exports = exports; 
