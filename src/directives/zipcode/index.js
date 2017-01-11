// require usa states.json
// include google if it is not included
// render two fields
// add events


// ToDo
// extend Backbone.Events ?
const mainElement = '#content';

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
    // fix me
    // as script loads async we can add multiple google api scripts
    if(!window.google || !window.google.maps) {
      let p = document.createElement("script");
      p.type = "text/javascript";
      p.src = window.location.protocol + "//maps.google.com/maps/api/js?language=en&key=" + global.googleMapKey;
      $("head").append(p);
    }

    return this;
  }

  attacheEvents() {
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
      googleMapKey: global.googleMapKey
    });
    this.$resultHtml = $(this.resultHtml);
    this.attacheEvents();

    if (this.values.zip_code)
      setTimeout(() => { $('#zip_code').trigger('change'); }, 50);

    return this;
  }

  onZipCodeChange(e) {
    const zip = e.target.value;

    if (!zip.match(/\d{5}/)) {
      return;
    }

    if(zip.length >= 5 && typeof google != 'undefined') {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': zip }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK){
          if (results.length >= 1) {
            let strs = results[0].formatted_address.split(", ");
            let city = strs[0];
            let state = strs[1].substr(0, 2);

            // Use overlord
            document.querySelector('.js-city-state').innerHTML = city + ', ' + state;
            this.view.model.city = city;
            this.view.model.state = state;
            document.querySelector('#city').value = city;
            document.querySelector('#state').value = state;
          } else {
            console.debug('error')
          }
        } else {
          console.debug('error')
        }
      });
    }
  }

  saveCityState(e) {
    this.view.model.city = document.querySelector('#city').value;
    this.view.model.state = document.querySelector('#state').value;

    const data = {
      'city': this.view.model.city,
      'state': this.view.model.state
    };

    document.querySelector('.js-city-state').innerHTML = 
      this.view.model.city + ', ' + this.view.model.state;

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
