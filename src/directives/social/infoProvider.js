class InfoProvider {
  constructor(model) {
    this.model = model;
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