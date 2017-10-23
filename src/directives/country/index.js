const mainElement = `#content`;

class CountryBlock {
  constructor(view, options={}) {
    this.view = view;

    this.template = require('./templates/country.pug');
    this.usBlock = require('./templates/snippets/us.pug');
    this.nonUsBlock = require('./templates/snippets/nonUs.pug');
    let country = this.view.fields.country;
    country.validate.choices = require('consts/countries.json');
    return this;
  }

  attachEvents() {
    $(mainElement).on(`change`, `#country`, (e) => {
      this.onCountryChange.call(this, e);
    });
  }

  detachEvents() {
    $(mainElement).off(`change`, `#country`);
  }

  render() {
    this.detachEvents();

    let html = this.template({
      fields: this.view.fields,
      countries: this.countries,
      user: this.view.model,
      view: this.view,
      snippets: {
        us: this.usBlock,
        nonUs: this.nonUsBlock,
      }
    });

    this.attachEvents();

    return html;
  }

  onCountryChange(e) {
    const v = this.view;
    const isUS = e.target.value === 'US';

    let $row = isUS
      ? $(`.foreign-country-row`)
      : $(`.us-row`);

    if (!$row.length)
      return;

    if (isUS) {
      this.fields.zip_code.label = 'Postal Code';
    } else {
      this.fields.zip_code.label = 'Zip Code';
    }

    let args = {
      view: v,
      fields: v.fields,
      user: v.model,
    };

    $row.first().after(isUS ? this.usBlock(args) : this.nonUsBlock(args));

    $row.remove();
  }
}

module.exports = (...options) => {
  return new CountryBlock(...options)
};
