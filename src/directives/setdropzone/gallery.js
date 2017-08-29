const folder = require('models/folder.js');
const folderDropzone = require('./folder.js');
const imageDropzone = require('./image.js');
const ImageClass = require('models/image.js');
const defaultImage = require('images/default/255x153.png');


class GalleryElement extends imageDropzone.ImageElement {
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
      let fileObj = new imageDropzone.ImageElement(
        new ImageClass('', el),
        fieldName,
        fieldDataName,
        options
      );
      fileObj.delete = () => this.delete.call(this, fileObj.file.id);
      fileObj.getTemplate = this.getTemplate;
      fileObj.save = () => {
        let index = this.file.data.findIndex((el) => { 
          return el.id == fileObj.file.id;
        });
        this.file.data[index].name = fileObj.file.name;
        return this.save.call(this);
      };
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
    return require('./templates/gallery.pug');
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
      this.save().then(() => {
        imageRender.element.remove()
        delete this.file.data[index];
        if(imageRender.options.onSaved) {
          imageRender.options.onSaved(this);
        }
      });
    }).fail((xhr, error) => {
      // If file was already deleted in filer - just update model
      if(xhr.status == 503) {
        let indexFile = this.file.data.indexOf(this.file.data.filter((el) => {return fileId == el.id})[0]);
        this.file.data.splice(indexFile, 1);
        this.save().then(() => imageRender.element.remove());
      }
    });
  }
};


class GalleryDropzone extends imageDropzone.ImageDropzone {

  constructor(view, fieldName, fieldDataName, options={}) {
    super(view, fieldName, fieldDataName, options);
    this.options.acceptedFiles = 'image/*,.jpg,.png,.jpeg';

    this.galleryElement = new GalleryElement(
      this.model[fieldName],
      fieldName,
      fieldDataName,
      options.crop
    );

    if(options.onSaved) {
      this.galleryElement.options.onSaved = options.onSaved;
    };

    this.cropperQuery = [];
  }

  getTemplate() {
    return require('./templates/galleryDropzone.pug');
  }

  success(file, data) {
    const reorgData = {
      urls: {}
    };

    data.forEach((image) => {
      if(image.name.indexOf('_c_') != -1) {
        reorgData.urls.main = this.fileElement.fixUrl(image.urls[0]);
      } else if(image.name.indexOf('_r_') != -1) {
        var cropName = this.cropperOptions.resize.width + 'x' + this.cropperOptions.resize.height;
        reorgData.urls[cropName] = this.fileElement.fixUrl(image.urls[0]);
      } else {
        reorgData.id = image.id;
        reorgData.name = image.name;
        reorgData.mime = image.mime;
        reorgData.urls.origin = this.fileElement.fixUrl(image.urls[0]);
      }
    });

    reorgData.name = '';
    reorgData.site_id = app.sites.getId();
    this.galleryElement.file.data.push(reorgData);
    let fileObj = new imageDropzone.ImageElement(
      new ImageClass('', reorgData),
      this.galleryElement.fieldName,
      this.galleryElement.fieldDataName
    );
    fileObj.getTemplate = this.galleryElement.getTemplate;
    fileObj.elementSelector = '.' + this.galleryElement.fieldName + ' .fileContainer' + reorgData.id;
    fileObj.save = () => this.galleryElement.save.call(this.galleryElement);
    fileObj.delete = () => this.galleryElement.delete.call(this.galleryElement, fileObj.file.id);
    fileObj.options = this.galleryElement.options;
    this.galleryElement.files.push(fileObj);

    this.galleryElement.update(this.galleryElement.file.data, () => {
      fileObj.render();

      //this.model.data[this.galleryElement.fieldDataName].push(fileObj.file);
      if(this.galleryElement.options.onSaved) {
        this.galleryElement.options.onSaved(this.galleryElement);
      }

      this.element.querySelector('.fileHolder').insertAdjacentHTML('beforeend', fileObj.resultHTML);
      let cropEl = new imageDropzone.CropperDropzone(
        this,
        fileObj,
        this.cropperOptions
      );
      this.cropperQuery.push(cropEl);

      if(this.cropperQuery.length === 1) {
        cropEl.render($(this.element).closest('.dropzone')[0]);
      };
    });
  }
}

module.exports = {
  GalleryElement: GalleryElement,
  GalleryDropzone: GalleryDropzone
};
