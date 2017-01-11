module.exports = {
  investment(i, attr, helpers) {
    attr = attr || {};
    const template =  require('./templates/investment.pug');
    return template({
      i: i,
      attr: attr,
      helpers: helpers
    });
  },
};