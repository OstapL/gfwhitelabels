module.exports = {
  comment(c, level, attr, helpers) {
    const template = require('./templates/comment.pug');
    attr = attr || {};

    return template({
      comment: c,
      level: level,
      attr: attr,
      helpers: helpers,
    });
  },
};