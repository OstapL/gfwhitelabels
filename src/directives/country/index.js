const mainElement = `#content`;

class CountryBlock {
  constructor(view, options={}) {
    this.view = view;

    this.template = require(options.template || `./templates/country.pug`);

    this.usBlock = require(`./templates/snippets/us.pug`);
    this.nonUsBlock = require(`./templates/snippets/nonUs.pug`);

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
      user: this.view.model,
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

    v.model.country = e.target.value;
    let $row = v.model.country == 'US'
      ? $(`.foreign-country-row`)
      : $(`.us-row`);

    if (!$row.length)
      return;

    let args = {
      fields: v.fields,
      user: v.model,
    };

    $row.first().after(v.model.country == 'US'
        ? this.usBlock(args)
        : this.nonUsBlock(args))

    $row.remove();
  }
}

module.exports = (...options) => {
  return new CountryBlock(...options)
};