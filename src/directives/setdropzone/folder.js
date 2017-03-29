const folder = require('models/folder.js');
const fileDropzone = require('./file.js');
const fileClass = require('models/file.js');
const defaultImage = '/img/default/255x153.png'; 


class FolderElement extends fileDropzone.FileElement {
  constructor(file, fieldName, fieldDataName, options={}) {
    super(file, fieldName, fieldDataName, options);
    this.files = [];
    file.data.forEach((el) => {
      if(Array.isArray(el.urls)) {
        let temp = Object.assign({}, el);
        el.urls = {};
        el.urls.origin = temp.urls[0];
      }
      let fileObj = new fileDropzone.FileElement(
        new fileClass('', el),
        fieldName,
        fieldDataName
      );
      fileObj.getTemplate = this.getTemplate;
      fileObj.elementSelector = '.' + fieldName + ' .fileContainer' + el.id;
      this.files.push(fileObj);
    });
    // this.file = file;
    this.fieldName = fieldName;
    this.fieldDataName = fieldDataName;
    this.resultHTML = '';
    this.element = null;
    this.options = options;
    return this;
  }

  getTemplate() {
    return require('./templates/folderElement.pug');
  }

  getDefaultImage() {
    return this.options.defaultImage || defaultImage;
  }

};


class FolderDropzone extends fileDropzone.FileDropzone {

  constructor(view, fieldName, fieldDataName, imageOptions) {
    super(view, fieldName, fieldDataName, imageOptions);

    this.folderElement = new FolderElement(
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
  FolderElement: FolderElement,
  FolderDropzone: FolderDropzone
};
