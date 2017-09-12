const folder = require('models/folder.js');
const fileDropzone = require('./file.js');
const fileClass = require('models/file.js');
const defaultImage = require('images/default/255x153.png');


class FolderElement extends fileDropzone.FileElement {
  constructor(file, fieldName, fieldDataName, options={}) {
    super(file, fieldName, fieldDataName, options);
    this.files = [];
    file.data.forEach((el) => {
      if(el == null || el.urls == null) {
        el = {};
        el.urls = [];
      }
      if(Array.isArray(el.urls)) {
        let temp = Object.assign({}, el);
        el.urls = {};
        el.urls.origin = temp.urls[0];
      }
      let fileObj = new fileDropzone.FileElement(
        new fileClass('', el),
        fieldName,
        fieldDataName,
        options
      );
      fileObj.delete = () => this.delete.call(this, fileObj.file.id);
      fileObj.getTemplate = this.getTemplate;
      fileObj.save = () => this.save.call(this);
      fileObj.elementSelector = '.' + fieldName + ' .fileContainer' + el.id;
      fileObj.options = this.options;
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

  save() {
    let patchData = {};
    patchData[this.fieldDataName] = this.file.data;
    return api.makeRequest(this.file.urlRoot, 'PATCH', patchData);
  }

  delete(fileId) {
    let imageRender = this.files.filter((el) => {return fileId == el.file.id})[0];
    let index = this.files.indexOf(imageRender);

    this.files[index].file.delete().done(() => {
      let indexFile = this.file.data.indexOf(this.file.data.filter((el) => {return fileId == el.id})[0]);
      this.file.data.splice(indexFile, 1);
      this.save().then(() => imageRender.element.remove());
    }).fail((xhr, error) => {
      // If file was already deleted in filer - just update model
      let indexFile = this.file.data.indexOf(this.file.data.filter((el) => {return fileId == el.id})[0]);
      this.file.data.splice(indexFile, 1);
      this.save().then(() => imageRender.element.remove());
    });
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
    return require('./templates/folderDropzone.pug');
  }

  success(file, data) {

    const reorgData = data[0];
    reorgData.site_id = app.sites.getId();
    reorgData.urls = {};
    reorgData.urls.origin = reorgData.url_filename;
    delete reorgData.url_filename;

    this.folderElement.file.data.push(reorgData);
    let fileObj = new fileDropzone.FileElement(
      new fileClass('', reorgData),
      this.folderElement.fieldName,
      this.folderElement.fieldDataName
    );
    //fileObj.file.data.site_id = app.sites.getId();
    fileObj.getTemplate = this.folderElement.getTemplate;
    fileObj.elementSelector = '.' + this.folderElement.fieldName + ' .fileContainer' + reorgData.id;
    fileObj.save = () => this.folderElement.save.call(this.galleryElement);
    fileObj.delete = () => this.folderElement.delete.call(this.folderElement, fileObj.file.id);
    fileObj.options = this.folderElement.options;
    this.folderElement.files.push(fileObj);

    this.folderElement.update(this.folderElement.file.data, () => {
      fileObj.render();

      if(this.folderElement.options.onSaved) {
        this.folderElement.options.onSaved(this.folderElement);
      }

      this.element.querySelector('.fileHolder').insertAdjacentHTML('beforeend', fileObj.resultHTML);
    });
  }
}

module.exports = {
  FolderElement: FolderElement,
  FolderDropzone: FolderDropzone
};
