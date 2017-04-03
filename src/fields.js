
let exports = {
  prepareNestedField(nestedName, name, value, index, myAttr, schema) {
    if(value == null) {
      console.log('value for ' + name + ' is null ')
      value = {}
    }
    _.extend(myAttr, schema);
    myAttr.value = value.hasOwnProperty(name) ? value[name]: '';
    if(index != -1) {
      myAttr.id = nestedName + '__' + index + '__' + name + '';
    } else {
      myAttr.id = nestedName + '__' + name + '';
    }
  },

  nestedTextLabel(nestedName, name, value, index, myAttr, schema) {
    this.prepareNestedField(nestedName, name, value, index, myAttr, schema);
    myAttr.class1 = myAttr.class1 || 'col-xl-3 col-lg-12 text-lg-left text-xl-right';
    myAttr.class2 = myAttr.class2 || 'col-xl-9 col-lg-12';
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
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'text-lg-right col-lg-3 col-md-12 text-md-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-lg-9 col-md-12';
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
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'text-lg-right col-lg-3 col-md-12 text-md-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-lg-9 col-md-12';
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
    myAttr.class1 = myAttr.class1 ? myAttr.class1 : 'text-lg-right col-lg-3 col-md-12 text-md-left';
    myAttr.class2 = myAttr.class2 ? myAttr.class2 : 'col-lg-9 col-md-12';
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

    attr.type = attr.type || 'text';
    attr.value = attr.type == 'money'
      ? app.helpers.format.formatPrice(attr.value)
      : attr.value

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

  userProfileDropzone(name, attr) {
    let noimg = require('images/default/Default_photo.png');
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

    attr.fileIcon = app.helpers.icons.resolveIconPath(attr.data.mime, 'file');

    attr.default = attr.default || require('images/icons/file.png');
    attr.text = attr.text || 'Drop your PDF or DOC here or click to upload';

    const template = require('./templates/fileDropzone.pug');
    return template({
      name: name,
      attr: attr,
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
      noimg: require('images/default/Default_photo.png'),
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
