const File = require('./file.js');


class Investment {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data;
    this.schema = schema;
    this.url = url || app.config.investmentServer + '/' + data.id;

    if (this.data.campaign) {
      this.data.campaign = new app.models.Campaign(this.data.campaign);
    }

    if (this.data.formc) {
      this.data.formc = new app.models.Formc(this.data.formc);
    }

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
    return data;
  }
}

module.exports = Investment
