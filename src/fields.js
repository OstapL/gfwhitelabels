function prepareField(name, attr) {
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
}


module.exports = {
  textLabel(name, attr) {
    attr.name = name;
    prepareField(name, attr);
    if(attr.hasOwnProperty('class1') == false) { attr.class1 = 'col-xl-3 col-lg-12 text-lg-left text-xl-right'};
    if(attr.hasOwnProperty('class2') == false) { attr.class2 = 'col-xl-9 col-lg-12' };
    const template = require('./templates/textLabel.pug');
    return template(attr);
  },
  textareaLabel(name, attr) {
    attr.name = name;
    prepareField(name, attr);
    if(attr.hasOwnProperty('class1') == false) { attr.class1 = 'col-xl-3 col-lg-12 text-lg-left text-xl-right'};
    if(attr.hasOwnProperty('class2') == false) { attr.class2 = 'col-xl-9 col-lg-12' };
    const template = require('./templates/textareaLabel.pug');
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
