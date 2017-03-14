const folder = require('models/folder.js');
const folderDropzone = require('./folder.js');
const imageDropzone = require('./image.js');
const ImageClass = require('models/image.js');
const defaultImage = '/img/default/255x153.png'; 


class GalleryElement extends imageDropzone.ImageElement {
  constructor(file, fieldName, fieldDataName, options={}) {
    super(file, fieldName, fieldDataName, options);
    this.files = [];
    file.data.forEach((el) => {
      if(Array.isArray(el.urls)) {
        let temp = Object.assign({}, el);
        el.urls = {};
        el.urls.origin = temp.urls[0];
      }
      let fileObj = new imageDropzone.ImageElement(
        new ImageClass('', el),
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
    return require('./templates/gallery.pug');
  }

  getDefaultImage() {
    return this.options.defaultImage || defaultImage;
  }
};


class GalleryDropzone extends imageDropzone.ImageDropzone {

  constructor(view, fieldName, fieldDataName, options={}) {
    super(view, fieldName, fieldDataName, options);
    this.options.acceptedFiles = 'image/*,.jpg,.png,.jpeg';

    this.galleryElement = new GalleryElement(
      this.model[fieldName],
      fieldName,
      fieldDataName
    );
  }

  getTemplate() {
    return require('./templates/galleryDropzone.pug');
  }

  success(file, data) {

    const reorgData = data[1];
    reorgData.urls = {
      origin: data[1].urls[0]
    };
    reorgData.urls.main = data[0].urls[0];
    if(this.cropperOptions.resize) {
      reorgData.urls[
        this.cropperOptions.resize.width + 'x' + this.cropperOptions.resize.height
      ] = data[0].urls[0];
    }

    this.fileElement.update(reorgData).done(() => {
      this.fileElement.render(this.fileElement.element);
      new CropperDropzone(
        this,
        this.cropperOptions
      ).render('#content');
    });
  }
}

module.exports = {
  GalleryElement: GalleryElement,
  GalleryDropzone: GalleryDropzone
};
