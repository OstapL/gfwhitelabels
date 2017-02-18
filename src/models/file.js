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
    this.urls = data.urls || [];
    this.mime = data.mime || defaultIcon;
  }

  updateData(data) {
    this.id = data.id;
    this.name = data.name;
    this.urls = data.urls || [];
    this.mime = data.mime || defaultIcon;
  }

  getOriginalFile() {
    return this.urls[this.urls.length];
  }

  getExtention() {
    return this.getOriginalFile().split('.').reverse()[0];
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

  save(idName, dataName) {
    const type = 'PATCH';
    const data = {};

    data[idName] = this.id;

    // ToDo
    // Fix this
    data[dataName] = [{
      id: this.id,
      name: this.name,
      mime: this.mime,
      urls: this.urls
    }];

    return api.makeRequest(
      this.urlRoot,
      type,
      data
    ).fail((xhr, status) => {
      alert('show standart error message');
    });
  }
}

module.exports = File
