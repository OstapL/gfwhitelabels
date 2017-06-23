class InfoProvider {
  constructor(model) {
    this.model = model;
    this.templates = {};
    this._data = {
      siteURL: window.location.origin.replace(/growthfountain/i, 'GrowthFountain'),
      siteName: window.location.host.replace(/growthfountain/i, 'GrowthFountain'),
    };
  }

  get data() {
    return this._data;
  }

  set data(newData) {
    this._data = _.extend(this._data, newData);
  }

  _stripHtml(html) {
    if (!_.isString(html))
      return html;

    return html.replace(/(<([^>]+)>)/ig,'');
  }

  _format(template, data) {
    if (!data)
      return this.templates[template];

    return _.reduce(data, (tmpl, val, key) => {
      return tmpl.replace(':' + key, val);
    }, this.templates[template]);
  }

  _buildMailToLink(email) {
    let emailString = `mailto:${email.to || ''}`;

    emailString += `?subject=${email.subject || ''}`;
    emailString += `&body='${email.body || ''}`;

    return emailString;
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