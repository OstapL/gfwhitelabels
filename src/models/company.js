const File = require('./file.js');


class Company {
  constructor(url, data={}, schema={}) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data;
    this.schema = schema;
    this.url = url;
    this.data['campaign'] = new app.models.Campaign('', this.data['campaign']);

    this.data = Object.seal(this.data);
    for(let key in this.data) {
      Object.defineProperty(this, key, {
        get: function(value) { return this.data[key]; },
        set: function(value) { this.data[key] = value; },
      });
    }
  }

  toJSON() {
    let data = Object.assign({}, this.data);
    for(let key in this.schema) {
      if(this.data.hasOwnProperty(key)) {
        switch(this.schema[key].type) {
          case 'file':
          case 'image':
          case 'filefolder':
          case 'imagefolder':
            data[key] = this.data[key].id;
            break;
        }
      }
    }
    return data;
  }

}

module.exports = Company
