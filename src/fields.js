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

const helpers = {
  date: require('./helpers/dateHelper.js'),
  format: require('./helpers/formatHelper.js'),
};

module.exports = {
  textLabel(name, attr) {
    attr.name = name;
    prepareField(name, attr);
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
  },

  investment(i, attr) {
    attr = attr || {};
    const template =  require('./templates/dashboardInvestment.pug');
    return template({
      i: i,
      attr: attr,
      helpers: helpers
    });
  },
}
