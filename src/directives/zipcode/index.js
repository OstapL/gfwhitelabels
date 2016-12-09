// require usa states.json
// include google if it is not included
// render two fields
// add events


// ToDo
// extend Backbone.Events ?
const mainElement = '#content';

class GeoCoder {

  constructor(fields, values, template) { 
    this.overlord = document.querySelector(mainElement);

    this.fields = fields;
    this.values = values;
    this.template = require('./templates/teamMember.pug');
    this.resultHtml = '';
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
    $(mainElement).on('change', '#zip_code', this.onZipCodeChange);
  }

  render() { 
    this.resultHtml = this.template({
      fields: this.fields,
      values: this.values,
      googleMapKey: global.googleMapKey
    });
    this.$resultHtml = $(this.resultHtml);
    this.attacheEvents();
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
};


function getInstance(...options) {
  return new GeoCoder(...options);
}

module.exports = getInstance;
