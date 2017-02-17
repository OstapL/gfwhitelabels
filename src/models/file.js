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
    this.mime = data.mime;
  }

  updateData(data) {
    this.id = data.id;
    this.name = data.name;
    this.urls = data.urls;
    this.mime = data.mime;
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
    debugger;
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

    if (text.length <= toLength) {
      return this.name;
    }

    let lastPart = text.substring(this.name.length - lastLength);
    let firstPart = text.substring(0, toLength - lastLength - 3);

    return `${firstPart}...${lastPart}`;

  }
}

module.exports = File
