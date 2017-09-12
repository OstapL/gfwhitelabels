
const formatValue = (type, value) => {
  if (type === 'money')
    return app.helpers.format.formatPrice(value);
  if (type === 'percent')
    return app.helpers.format.formatPercent(value);

  return value;
};

module.exports = {
  prepareNestedField(nestedName, name, value, index, myAttr, schema) {
    if(value == null) {
      console.log('value for ' + name + ' is null ')
      value = {}
    }
    Object.assign(myAttr, schema);
    myAttr.value = value.hasOwnProperty(name) ? value[name]: '';

    // Fix for nested fields not to be required in html
    // myAttr._required = myAttr.required;
    // myAttr.required = false;

    if(index != -1) {
      myAttr.id = nestedName + '__' + index + '__' + name + '';
    } else {
      myAttr.id = nestedName + '__' + name + '';
    }
  },

  nestedTextLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 || 'col-xl-12 text-xl-left';
    myAttr.class2 = myAttr.class2 || 'col-xl-12';
    if(index != -1) {
      return this.textLabel(
        nestedName + '[' + index + '][' + name + ']',
        myAttr
      )
    } else {
      return this.textLabel(
        nestedName + '[' + name + ']',
        myAttr
      )
    }
  },

  nestedTextareaLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'col-xl-12 text-xl-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-xl-12';
    if(index != -1) {
      return this.textareaLabel(
        nestedName + '[' + index + '][' + name + ']',
        myAttr
      )
    } else {
      return this.textareaLabel(
        nestedName + '[' + name + ']',
        myAttr
      )
    }
  },

  nestedChoiceLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'col-xl-12 text-xl-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-xl-12';
    if(index != -1) {
      return this.choiceLabel(
        nestedName + '[' + index + '][' + name + ']',
        myAttr
      )
    } else {
      return this.choiceLabel(
        nestedName + '[' + name + ']',
        myAttr
      )
    }
  },

  nestedRadioLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'col-xl-12 text-xl-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-xl-12';
    if(index != -1) {
      return this.radioLabel(
        nestedName + '[' + index + '][' + name + ']',
        myAttr
      )
    } else {
      return this.radioLabel(
        nestedName + '[' + name + ']',
        myAttr
      )
    }
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

  nestedText(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    if(index != -1) {
      return this.fieldText(
        nestedName + '[' + index + '][' + name + ']',
        myAttr
      );
    } else {
      return this.fieldText(
        nestedName + '[' + name + ']',
        myAttr
      );
    }
  },

  prepareField(name, attr) {
    if(attr.schema) {
      attr = Object.assign(attr, attr.schema)
      delete attr.schema;
    }
    if(attr.placeholder == null || attr.placeholder == "") {
      attr.placeholder = attr.label || '';
    }
    if (attr.required == true) {
      if (attr.label && attr.label[attr.label.length-8] != '*') {
        attr.label += '<span class="color-red">*</span>';
      }
    }
    attr.id = attr.id || name;
  },

  textLabel(name, attr) {
    attr.name = name;
    this.prepareField(name, attr);

    attr.type = attr.type || 'text';
    attr.value = formatValue(attr.type, attr.value);

    attr.class1 = attr.class1 || 'col-xl-12 text-xl-left';
    attr.class2 = attr.class2 || 'col-xl-12';
    const template = require('./templates/textLabel.pug');
    return template(attr);
  },

  textareaLabel(name, attr) {
    attr.name = name;
    this.prepareField(name, attr);
    attr.class1 = attr.class1 || 'col-xl-12 text-xl-left';
    attr.class2 = attr.class2 || 'col-xl-12 big-textarea';
    const template = require('./templates/textareaLabel.pug');
    return template(attr);
  },

  dateDay(name, attr) {
    attr.name = name;
    this.prepareField(name, attr);
    attr.value = attr.value && attr.value.indexOf('-') != -1 ? attr.value.split('-')[2] : '';
    attr.class1 = attr.class1 || 'col-xl-4 col-lg-4 col-xs-4 p-r-0 m-d-p-l-5';
    const template = require('./templates/dateDay.pug');
    return template(attr);
  },

  dateMonth(name, attr) {
    attr.name = name;
    this.prepareField(name, attr);
    attr.value = attr.value && attr.value.indexOf('-') != -1 ? attr.value.split('-')[1] : '';
    attr.class1 = attr.class1 || 'col-xl-4 col-lg-4 col-xs-4 p-l-0  m-d-p-r-5';
    const template = require('./templates/dateMonth.pug');
    return template(attr);
  },

  dateYear(name, attr) {
    attr.name = name;
    this.prepareField(name, attr);
    attr.value = attr.value && attr.value.indexOf('-') != -1 ? attr.value.split('-')[0] : '';
    attr.class1 = attr.class1 || 'col-xl-4 col-lg-4 col-xs-4 p-r-0 m-d-p-l-10';
    const template = require('./templates/dateYear.pug');
    return template(attr);
  },

  fieldText(name, attr) {
    const template = require('./templates/fieldText.pug');
    attr.value = attr.hasOwnProperty('value') ? attr.value : '';
    return template({
      name: name,
      attr: attr,
    });
  },
  // уже не нужен
  fieldTextLabel(name, attr) {
    this.prepareField(name, attr);
    attr.type = attr.type || 'text';
    attr.value = attr.type == 'money'
      ? app.helpers.format.formatPrice(attr.value)
      : attr.value

    const template = require('./templates/fieldTextLabel.pug');
    return template({
      name: name,
      attr: attr,
    })
  },

  fieldChoiceLabel(name, attr) {
    this.prepareField(name, attr);
    attr.type = attr.type || 'select';
    attr.class1 = attr.class1 || 'col-xl-12 text-xl-left';
    attr.class2 = attr.class2 || 'col-xl-12';
    const template = require('./templates/fieldChoiceLabel.pug');

    return template({
      name: name,
      attr: attr,
    });
  },

  radioLabel(name, attr) {
    this.prepareField(name, attr);
    attr.type = attr.type || 'radio';
    attr.class1 = attr.class1 || 'col-xl-12 text-xl-left';
    attr.class2 = attr.class2 || 'col-xl-12';
    const template = require('./templates/radioLabel.pug');

    return template({
      name: name,
      attr: attr,
    });
  },

};
