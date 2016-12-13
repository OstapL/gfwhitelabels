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
    const template = require('./templates/textLabel.pug');
    prepareField(name, attr);
    return template(attr);
  }
}
