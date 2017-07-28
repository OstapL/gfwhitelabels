const File = require('./file.js');
const defaultIcon = 'fileFolder.png';

class Folder {
  constructor(urlRoot, id, data=[]) {
    //
    // urlRoot - url for update model assosiated with that file
    // id - id of the group element in database
    // data - collection of models.Files
    //
    this.urlRoot = urlRoot;
    this.id = id;
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

    return require('images/icons/' + icon + '.png');
  }

  getUrl(name, fallback='folder.png') {

    if(this.urls.hasOwnProperty(name)) {
      if(this.urls[name].indexOf('http://') == -1 && this.urls[name].indexOf('https://') == -1) {
        return app.sites[this.site_id] + this.urls[name];
      } else {
        return this.urls[name];
      }
      return this.urls[name];
    }

    if(fallback) {
      return require('images/icons/' + fallback);
    }
    return require('images/icons/file.png');
  }

  save(dataId, dataName) {
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
