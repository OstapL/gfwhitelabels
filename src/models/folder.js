const File = require('./file.js');
const defaultIcon = 'fileFolder.png';

class Folder {
  constructor(urlRoot, data=[]) {
    //
    // urlRoot - url for update model assosiated with that file
    // id - id of the group element in database
    // data - collection of models.Files
    //
    this.urlRoot = urlRoot;
    this.data = data;
  }

  updateData(data) {
    this.data = data;
  }

  getIcon() {
    return defaultIcon
  }

  getIconUrl(icon) {

    if(icon == null) {
      icon = this.getIcon();
    }

    return `/img/icons/${icon}.png`;
  }

  getUrl(name, fallback='fileFolder.png') {
    if(this.urls.hasOwnProperty(name)) {
      return this.urls[name];
    }
    return '/img/icon/' + fallback;
  }

  save(dataName) {
    const type = 'PATCH';
    const data = {};

    data[dataName] = this.data; 
    return api.makeRequest(
      this.urlRoot,
      type,
      data
    )
  }
};

module.exports = Folder;
