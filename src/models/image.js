const File = require('./file.js');
const defaultImage = '/img/default/255x153.png';

class Image extends File {
  createCrop(idName, dataName, size) {

  }

  getUrl(name, fallback='') {
    /*
     * Will return url for the name 
     * or will return smallest image from urls
     */
    let files = Object.assign({}, this.urls);
    let smallestSize = '';

    if (name && this.urls.hasOwnProperty(name)) {
      return app.sites[this.site_id] + this.urls[name];
    }

    if (Object.keys(files).length > 0) {
      smallestSize = Object.keys(files).sort((a, b) => {
        return a.split('x')[0] > b.split('x')[0];
      })[0];

      if (this.urls[smallestSize].startsWith('http')) {
        return this.urls[smallestSize];
      }

      return app.sites[this.site_id] + this.urls[smallestSize];
    } else {
      return '/img/default/' + fallback;
    };
  }

  getDefaultImage() {
    return this.options.defaultImage || defaultImage;
  }
};

module.exports = Image;
