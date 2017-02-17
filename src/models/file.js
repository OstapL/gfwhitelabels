const mimetypeIconMap = {
  'pdf': 'pdf',
  'doc': 'doc',
  'msword': 'doc',
  'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'vnd.ms-powerpoint': 'ppt',
  'vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};


class File {
  constructor(data={}) {
    this.id = data.id;
    this.name = data.name;
    this.urls = data.urls;
    this.mime = data.mime;
  },

  getOriginalFile() {
    return this.urls[this.urls.length];
  },

  getExtention() {
    return this.getOriginalFile().split('.').reverse()[0];
  },

  getExtentionByMime() {
    return mimetypeIconMap[this.mime];
  },

  getIcon() {
    return `/img/icons/${mimetypeIconMap[this.mime] || defaultIcon}.png` 
  }
}


class Image(File) {
  // ToDo have size and cropped copies
}


class Folder {
  // ToDo have a set of files
}


class Gallery(Folder) {
  // ToDo have a set of images
}
