const helpers = {
  date: require('./helpers/dateHelper.js'),
  format: require('./helpers/formatHelper.js'),
  text: require('helpers/textHelper.js'),
  mimetypeIcons: require('helpers/mimetypeIcons.js'),//TODO: add resolve method and make resolveIconHelper
};

let exports = {
  prepareNestedField(nestedName, name, value, index, myAttr, schema) {
    if(value == null) {
      console.log('value for ' + name + ' is null ')
      value = {}
    }
    _.extend(myAttr, schema);
    myAttr.value = value.hasOwnProperty(name) ? value[name]: '';
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
    myAttr.class1 = myAttr.class1 || 'col-xl-3 col-lg-12 text-lg-left text-xl-right';
    myAttr.class2 = myAttr.class2 || 'col-xl-9 col-lg-12';
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
    attr.class1 = attr.class1 || 'col-xl-3 col-lg-12 text-lg-left text-xl-right';
    attr.class2 = attr.class2 || 'col-xl-9 col-lg-12';
    const template = require('./templates/textLabel.pug');
    return template(attr);
  },

  textareaLabel(name, attr) {
    attr.name = name;
    this.prepareField(name, attr);
    attr.class1 = attr.class1 || 'col-xl-3 col-lg-12 text-lg-left text-xl-right';
    attr.class2 = attr.class2 || 'col-xl-9 col-lg-12 big-textarea';
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
    attr.class1 = attr.class1 || 'col-xl-4 col-lg-4 col-xs-4 p-r-0 p-r-lg-1 m-d-p-l-10';
    const template = require('./templates/dateYear.pug');
    return template(attr);
  },

  // Fixme 
  // Что это за название филда такое ? и шаблон с целым dashboard ?
  investment(i, attr) {
    attr = attr || {};
    const template =  require('./templates/dashboardInvestment.pug');
    return template({
      i: i,
      attr: attr,
      helpers: helpers
    });
  },

  comment(c, level, attr) {
    const template = require('./templates/comment.pug');
    attr = attr || {};
    if (!attr.helpers)
      attr.helpers = helpers;

    return template({
      comment: c,
      level: level,
      attr: attr,
    });
  },

  userProfileDropzone(name, attr) {
    let noimg = '/img/default/Default_photo.png';
    attr.data = attr.data || {};
    attr.data.urls = attr.data.urls || [noimg];

    const template = require('./templates/userProfileDropzone.pug');
    return template({
      name: name,
      attr: attr,
      noimg: noimg,
    });
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
      ? helpers.format.formatPrice(attr.value)
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
    attr.class1 = attr.class1 || 'col-xl-3 col-lg-12 text-lg-left text-xl-right';
    attr.class2 = attr.class2 || 'col-xl-9 col-lg-12';
    const template = require('./templates/fieldChoiceLabel.pug');

    return template({
      name: name,
      attr: attr,
    });
  },  

  radioLabel(name, attr) {
    this.prepareField(name, attr);
    attr.type = attr.type || 'radio';
    attr.class1 = attr.class1 || 'col-xl-3 text-xl-right text-lg-left';
    attr.class2 = attr.class2 || 'col-xl-9';
    const template = require('./templates/radioLabel.pug');

    return template({
      name: name,
      attr: attr,
    });
  },

  fileFolderDropzone(name, attr, schema) {
    attr.data = attr.data || {};
    attr.data.urls = attr.data.urls || [];

    _.extend(attr, schema);

    this.prepareField(name, attr);

    attr.class = attr.class || '';
    let nameClass = attr.id || name,
      requiredClass = attr.required ? 'required' : '',
      popoverClass = attr.help_text ? 'showPopover' : '';

    attr.class = `row media-item ${attr.class} ${nameClass} ${requiredClass} fileFolderDropzone ${popoverClass}`;

    attr.class1 = attr.class1 || 'col-xl-3 col-lg-12 text-xl-right text-lg-left';
    attr.class1 += ` ${requiredClass}`;

    attr.class2 = attr.class2 || 'col-xl-9 col-lg-12 p-l-1 p-r-1';
    attr.class2 += ` dropzone__${name}`;

    attr.icon = attr.icon || 'file';
    attr.text = attr.text || 'Drop your PDF or DOC here or click to upload';

    const template = require('./templates/fileFolderDropzone.pug');
    return template({
      name: name,
      attr: attr,
      helpers: helpers,
    });
  },

  fileDropzone(name, attr, schema) {
    attr.data = attr.data || {};
    attr.data.urls = attr.data.urls || [];

    _.extend(attr, schema);

    this.prepareField(name, attr);

    let nameClass = attr.id || name,
      requiredClass = attr.required ? 'required' : '',
      popoverClass = attr.help_text ? 'showPopover' : '';

    attr.class = attr.class || '';
    attr.class = `row media-item ${attr.class} ${nameClass} ${requiredClass} fileDropzone ${popoverClass}`;

    attr.class1 = attr.class1 || 'col-xl-3 col-lg-12 text-xl-right text-lg-left';
    attr.class1 += ` ${requiredClass}`;

    attr.class2 = attr.class2 || 'col-xl-9 col-lg-12 p-l-1 p-r-1';
    attr.class2 += ` dropzone__${name}`;

    attr.icon = attr.icon || 'file';

    attr.fileIcon = attr.data.mime
      ? helpers.mimetypeIcons[attr.data.mime.split('/')[1]]
      : attr.type;

    attr.default = attr.default || '/img/default/file.png';
    attr.text = attr.text || 'Drop your PDF or DOC here or click to upload';

    const template = require('./templates/fileDropzone.pug');
    return template({
      name: name,
      attr: attr,
      helpers: helpers,
    });

  },

  teamMemberDropzone(name, attr) {
    attr.data = attr.data || {};
    attr.data.urls = attr.data.urls || [];

    attr.class1 = attr.class1 || 'col-xl-3 col-lg-12 text-lg-left text-xl-right';
    attr.class2 = attr.class2 || 'col-xl-9 col-lg-12';
    attr.thumbSize = attr.thumbSize || '255x135';
    attr.icon = attr.icon || 'camera';
    attr.text = attr.text || 'Drop your photo here or click to upload';

    const template = require('./templates/teamMemberDropzone.pug');
    return template({
      name: name,
      attr: attr,
      noimg: '/img/default/Default_photo.png',
    });
  },

  imageDropzone(name, attr, schema) {
    attr.data = attr.data || {};
    attr.data.urls = attr.data.urls || [];

    _.extend(attr, schema);

    this.prepareField(name, attr);
    attr.class = attr.class || '';
    let nameClass = attr.id || name,
      requiredClass = attr.required ? 'required' : '',
      popoverClass = attr.help_text ? 'showPopover' : '';

    attr.class = `row media-item ${attr.class} ${nameClass} ${requiredClass} imageDropzone ${popoverClass}`;
    attr.class1 += attr.required ? ' required' : '';
    attr.class2 += ` dropzone__${name}`;
    attr.icon = attr.icon || 'file-image-o';
    attr.text = attr.text || 'Drop your photo here or click to upload';
    const template = require('./templates/imageDropzone.pug');
    return template({
      name: name,
      attr: attr,
    });
  },

  galleryDropzone(name, attr, schema) {
    attr.data = attr.data || {};
    attr.data.urls = attr.data.urls || [];

    _.extend(attr, schema);

    this.prepareField(name, attr)

    attr.class = attr.class || '';
    let nameClass = attr.id || name,
      requiredClass = attr.required ? 'required' : '',
      popoverClass = attr.help_text ? 'showPopover' : '';

    attr.class = `row media-item ${attr.class} ${nameClass} ${requiredClass} galleryDropzone ${popoverClass}`;
    attr.class1 += ` ${requiredClass}`;
    attr.class2 += ` dropzone__${name}`;
    attr.icon = attr.icon || 'file-image-o';
    attr.text = attr.text || 'Drop your photo(s) here or click to upload';

    const template = require('./templates/imagefolderDropzone.pug');
    return template({
      name: name,
      attr: attr,
    });
  },

};

module.exports = exports;
