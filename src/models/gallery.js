const Image = require('./image.js');
const Folder = require('./folder.js');
const defaultIcon = 'gallery.png';

class Gallery extends Folder {
  constructor(urlRoot, id, data=[]) {
    //
    // urlRoot - url for update model assosiated with that file
    // id - id of the group element in database
    // data - collection of models.Files
    //
    super(urlRoot, id, []);

    data.forEach((el) => {
      if(el == null || el.urls == null) {
        el = {};
        el.urls = [];
      }
      if(Array.isArray(el.urls)) {
        let temp = Object.assign({}, el);
        el.urls = {};
        el.urls.origin = temp.urls[0];
      }
      let fileObj = new Image(
        this.urlRoot,
        el
      );
      this.data.push(fileObj);
    });
    //data = this.data;
    // this.file = file;
  }
};

module.exports = Gallery;
