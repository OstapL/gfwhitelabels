class InfoProvider {
  constructor(model) {
    this.model = model;
    this.templates = {};
    this.data = {
      siteURL: window.location.origin.replace(/growthfountain/i, 'GrowthFountain'),
      siteName: window.location.host.replace(/growthfountain/i, 'GrowthFountain'),
    };
  }

  _stripHtml(html) {
    if (!_.isString(html))
      return html;

    return html.replace(/(<([^>]+)>)/ig,'');
  }

  _format(template, data) {
    return _.reduce(data, (tmpl, val, key) => {
      return tmpl.replace(':' + key, val);
    }, this.templates[template]);
  }

  twitter() {
    throw 'Not implemented';
  }

  linkedin() {
    throw 'Not implemented';
  }

  facebook() {
    throw 'Not implemented';
  }

  email() {
    throw 'Not implemented';
  }

  google_plus() {
    throw 'Not implemented';
  }

  confirmationMessage(network) {
    return '';
  }
}

module.exports = InfoProvider;