const File = require('./file.js');

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
      if(this.urls[name].startsWith('http')) {
        return this.urls[name];
      } else {
        return app.sites[this.site_id] + this.urls[name];
      }
    }

    if (Object.keys(files).length > 0) {
      smallestSize = Object.keys(files).sort((a, b) => {
        return a.split('x')[0] > b.split('x')[0];
      })[0];

      if (this.urls[smallestSize] && this.urls[smallestSize].startsWith('http')) {
        return this.urls[smallestSize];
      }

      return app.sites[this.site_id] + this.urls[smallestSize];
    } else {
      let defaultImg = (fallback || name) + '.png';
      try {
        return require('images/default/' + defaultImg);
      } catch(e) {
      }
    };
  }

};

module.exports = Image;
