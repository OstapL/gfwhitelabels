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
    this._data = Object.assign(this._data, newData);
  }

  _stripHtml(html) {
    if (!typeof(html) !== 'string')
      return html;

    return html.replace(/(<([^>]+)>)/ig,'');
  }

  _format(template, data) {
    if (!data)
      return this.templates[template];

    return Object.keys(data).reduce((tmpl, key) => {
      return tmpl.replace(':' + key, data[key]);
    }, this.templates[template]);
  }

  _buildMailToLink(email) {
    let emailString = `mailto:${email.to || ''}`;

    emailString += `?subject=${email.subject || ''}`;
    emailString += `&body=${email.body || ''}`;

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