// require usa states.json
// include google if it is not included
// render two fields
// add events


// ToDo
// extend Backbone.Events ?
const mainElement = '#content';
const usaStates = require('consts/usaStates.json').USA_STATES;
const countries = require('consts/countries.json');

class GeoCoder {

  constructor(view, forUSA) {
    this.overlord = document.querySelector(mainElement);

    this.view = view;
    this.fields = view.fields;
    this.values = view.model;
    // if(forUSA == 1) {
      this.template = require('./templates/usa.pug');
    // } else {
    //   this.template = require('./templates/non_usa.pug');
    // }
    this.resultHtml = '';
    app.helpers.scripts.loadGoogleMapsAPI().then(() => {

    });
    return this;
  }

  attachEvents() {
    // ToDo
    // Get Rid of jquery 
    // use overlord
    $(mainElement).on('change', '#zip_code', (e) => this.onZipCodeChange.call(this, e));
    $(mainElement).on('click', '#saveCityState', (e) => this.saveCityState.call(this, e));
  }

  render() { 
    this.resultHtml = this.template({
      fields: this.fields,
      values: this.values,
    });
    this.$resultHtml = $(this.resultHtml);
    this.attachEvents();

    if (this.values.zip_code && !this.values.city && !this.values.state)
      setTimeout(() => { $('#zip_code').trigger('change'); }, 50);

    return this;
  }

  __getCountry(e) {
    return '';
    //this code should be refactored
    let $form = $(e.target).closest('form');
    let $country = $form.find('[name=country]');
    let countryCode  = $country && $country.length ? $country.val() : '';
    return countries[countryCode] || '';
  }

  onZipCodeChange(e) {
    const zip = e.target.value;

    if (!zip.match(/\d{5}/)) {
      return;
    }

    app.helpers.scripts.loadGoogleMapsAPI().then(() => {
      let geocoder = new google.maps.Geocoder();

      let country = this.__getCountry(e);
      let address = zip + (country ? (', ' + country) : '');

      geocoder.geocode({ 'address': address }, (results, status) => {
        if (status != google.maps.GeocoderStatus.OK) {
          console.debug('Failed to get state by zip code');
          return;
        }

        if (!results || results.length < 1) {
          console.log('Geocoder results shorter than expected');
          return;
        }

        let strs = results[0].formatted_address.split(", ");
        let city = strs[0];
        let state = strs[1].substr(0, 2);

        // Use overlord
        let cityStateElem = document.querySelector('.js-city-state');
        if (cityStateElem)
          cityStateElem.innerHTML = city + ', ' + state;

        // this.view.model.city = city;
        // this.view.model.state = state;
        document.querySelector('#city').value = city;
        document.querySelector('#state').value = state;
      });
    });
  }

  saveCityState(e) {
    this.view.model.city = document.querySelector('#city').value;
    this.view.model.state = document.querySelector('#state').value;

    const data = {
      'city': this.view.model.city,
      'state': this.view.model.state
    };

    document.querySelector('.js-city-state').innerHTML = 
      (this.view.model.city || '(City)') + ', ' + (usaStates[this.view.model.state] || '(State)');

    api.makeRequest(this.view.urlRoot.replace(':id', this.view.model.id), 'PATCH', data)
      .fail((response) => {
        console.debug(response);
      });
  }
};


function getInstance(...options) {
  return new GeoCoder(...options);
}

module.exports = getInstance;
