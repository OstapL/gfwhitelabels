const File = require('./file.js');
const defaultImage = '/img/default/255x153.png';

class Image extends File {
  createCrop(idName, dataName, size) {

  }

  getDefaultImage() {
    return this.options.defaultImage || defaultImage;
  }
};

module.exports = Image;
