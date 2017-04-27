const File = require('./file.js');
const Image = require('./image.js');
const Folder = require('./folder.js');
const Gallery = require('./gallery.js');


class Formc {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data || {};
    this.schema = schema;
    if(data && data.id) {
      this.url = url || app.config.formcServer + '/' + data.id;
    } else {
      this.url = url || app.config.formcServer;
    }

    this.data.business_plan_file_id = new File(
      this.url,
      this.data.business_plan_data
    );

    this.data.fiscal_recent_group_id = new Folder(
      this.url,
      this.data.fiscal_recent_group_id,
      this.data.fiscal_recent_group_data
    );

    this.data.fiscal_prior_group_id = new Folder(
      this.url,
      this.data.fiscal_prior_group_id,
      this.data.fiscal_prior_group_data
    );

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
    data.business_plan_file_id = data.business_plan_file_id.id;
    data.fiscal_recent_group_id = data.fiscal_recent_group_id.id;
    data.fiscal_prior_group_id = data.fiscal_prior_group_id.id;
    return data;
  }
}

module.exports = Formc
