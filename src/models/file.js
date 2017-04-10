const defaultIcon = 'file'; 

const mimetypeIconMap = {
  'pdf': 'pdf',
  'doc': 'doc',
  'msword': 'doc',
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
    this.id = data.id;
    this.name = data.name;
    this.urls = data.urls || {};
    this.mime = data.mime || defaultIcon;
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
    this.urls = data.urls || {};
    this.mime = data.mime || defaultIcon;
  }

  getOriginal(fallback) {
    if(this.urls.hasOwnProperty('origin')) {
      return this.urls.origin;
    }
    return '/img/default/' + fallback;
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
    return mimetypeIconMap[this.mime.split('/').reverse()[0]] || defaultIcon
  }

  getIconUrl(icon) {

    if(icon == null) {
      icon = this.getIcon();
    }

    return `/img/icons/${icon}.png` 
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
      return this.urls[name];
    }
    return '/img/default/' + fallback;
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
    };

    let newUrls = [];
    this.urls.forEach((url) => {
      if(url.name != 'origin') {
        newUrls.push(url.id);
      }
    });
    data.urls = newUrls;

    return api.makeRequest(
      this.urlRoot,
      type,
      data
    )
  }
}

module.exports = File
