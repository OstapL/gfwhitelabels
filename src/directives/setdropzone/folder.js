const folder = require('models/folder.js');
const fileDropzone = require('./file.js');
const fileClass = require('models/file.js');
const defaultImage = '/img/default/255x153.png'; 


class folderElement extends fileDropzone.FileElement {
  constructor(file, fieldName, fieldDataName, options={}) {
    super(file, fieldName, fieldDataName, options);
    this.files = [];
    file.data.forEach((el) => {
      if(Array.isArray(el.urls)) {
        let temp = Object.assign({}, el);
        el.urls = {};
        el.urls.origin = temp.urls[0];
      }
      this.files.push(new fileDropzone.FileElement(
        new fileClass('', el)
      ));
    });
    this.file = file;
    this.fieldName = fieldName;
    this.fieldDataName = fieldDataName;
    this.resultHTML = '';
    this.element = null;
    this.options = options;
    return this;
  }

  getTemplate() {
    return require('./templates/image.pug');
  }

  getDefaultImage() {
    return this.options.defaultImage || defaultImage;
  }
};


class folderDropzone extends fileDropzone.FileDropzone {

  constructor(view, fieldName, fieldDataName, imageOptions) {
    super(view, fieldName, fieldDataName, imageOptions);

    this.folderElement = new folderElement(
      this.model[fieldName],
      fieldName,
      fieldDataName
    );
  }

  getTemplate() {
    return require('./templates/fileFolderDropzone.pug');
  }

  success(file, data) {

    const reorgData = Object.assign({}, data);
    reorgData.urls = {};
    reorgData.urls.origin = data.urls[0];

    this.fileElement.file.data.push(reorgData);
    this.fileElement.save().done(() => {
      this.fileElement.render(this.fileElement.element);
    });
  }
}

module.exports = {
  folderElement: folderElement,
  folderDropzone: folderDropzone
};
