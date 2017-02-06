const mimetypeIconMap = {
  'pdf': 'pdf',
  'doc': 'doc',
  'msword': 'doc',
  'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'vnd.ms-powerpoint': 'ppt',
  'vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};

module.exports = {
  resolveIcon(mime, defaultIcon='file') {
    let type = _.isString(mime) ? mime.split('/')[1] : null;
    return mimetypeIconMap[type] || defaultIcon;
  },

  resolveIconPath(mime, defaultIcon) {
    return `/img/icons/${this.resolveIcon(mime, defaultIcon)}.png`;
  },

};
