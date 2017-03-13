const folder = require('models/folder.js');
const folderDropzone = require('./folder.js');
const fileDropzone = require('./file.js');
const fileClass = require('models/file.js');
const defaultImage = '/img/default/255x153.png'; 


class galleryElement extends folderDropzone.folderElement {
  getTemplate() {
    return require('./templates/gallery.pug');
  }

  getDefaultImage() {
    return this.options.defaultImage || defaultImage;
  }
};


class galleryDropzone extends folderDropzone.FolderDropzone {

  constructor(view, fieldName, fieldDataName, imageOptions) {
    super(view, fieldName, fieldDataName, imageOptions);

    this.galleryElement = new galleryElement(
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
  galleryElement: galleryElement,
  galleryDropzone: galleryDropzone
};
