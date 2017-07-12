const defaultIcon = 'file'; 

const mimetypeIconMap = {
  'pdf': 'pdf',
  'doc': 'doc',
  'msword': 'doc',
  'application/xml': 'xml',
  'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'vnd.ms-powerpoint': 'ppt',
  'vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};


class File {
  constructor(urlRoot, data={}) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //
    this.urlRoot = urlRoot;
    this.updateData(data);
  }

  delete() {
    return api.makeRequest(
        app.config.filerServer + '/' + this.id,
        'DELETE'
    );
  }

  updateData(data) {
    this.id = data.id;
    this.name = data.name;
    this.site_id = data.site_id;
    this.urls = data.urls || {};
    this.mime = data.mime || defaultIcon;
  }

  getOriginal(fallback) {
    if(this.urls.hasOwnProperty('origin')) {
      if(this.urls.origin.indexOf('http://') == -1 && this.urls.origin.indexOf('https://') == -1) {
        return app.sites[this.site_id] + this.urls.origin;
      } else {
        return this.urls.origin;
      }
    }
    if(fallback) {
      return require('images/default/' + fallback);
    }
    return require('images/default/350x282.png');
  }

  getExtention() {
    if(this.urls.origin) {
      return this.urls.origin.split('.').reverse()[0];
    }
  }

  getExtentionByMime() {
    return mimetypeIconMap[this.mime.split('/').reverse()[0]];
  }

  getIcon() {
    return mimetypeIconMap[this.mime] ||
      mimetypeIconMap[this.mime.split('/').reverse()[0]] || 
      defaultIcon;
  }

  getIconUrl(icon) {

    if(icon == null) {
      icon = this.getIcon();
    }

    return require('images/icons/' + icon + '.png');
  }

  shortenFileName(toLength=20) {
    const lastLength = 8;

    if (this.name.length <= toLength) {
      return this.name;
    }

    let lastPart = this.name.substring(this.name.length - lastLength);
    let firstPart = this.name.substring(0, toLength - lastLength - 3);

    return `${firstPart}...${lastPart}`;

  }

  getUrl(name, fallback='') {
    if(this.urls.hasOwnProperty(name)) {
      if(this.urls[name].startsWith('http')) {
        return this.urls[name];
      } else {
        return app.sites[this.site_id] + this.urls[name];
      }
    }
    return fallback ? require('images/default/' + fallback) : '';
  }

  save(idName, dataName) {
    const type = 'PATCH';
    const data = {};

    data[idName] = this.id;

    // ToDo
    // Fix this
    data[dataName] = {
      id: this.id,
      name: this.name,
      mime: this.mime,
      site_id: this.site_id,
      urls: this.urls
    };

    return api.makeRequest(
      this.urlRoot,
      type,
      data
    )
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      mime: this.mime,
      site_id: this.site_id,
      urls: this.urls
    }
  }
}

module.exports = File
