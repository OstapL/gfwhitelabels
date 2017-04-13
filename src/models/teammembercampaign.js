const File = require('./file.js');
const Image = require('./image.js');
const Folder = require('./folder.js');
const Gallery = require('./gallery.js');

class TeamMemberCampaign {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data;
    this.schema = schema;
    this.url = url || app.config.raiseCapitalServer + '/team-members';

    for(let key in this.schema) {
      if(this.data.hasOwnProperty(key)) {
        switch(this.schema[key].type) {
          case 'file':
            this.data[key] = new File(urlRoot, this.data[key.replace('_file_id', '_data')]);
            break;
          case 'image':
            this.data[key] = new Image(urlRoot, this.data[key.replace('_image_id', '_data')]);
            break;
          case 'filefolder':
            this.data[key] = new Folder(urlRoot, this.data[key], this.data[key.replace('_id', '_data')]);
            break;
          case 'imagefolder':
            this.data[key] = new Gallery(urlRoot, this.data[key], this.data[key.replace('_id', '_data')]);
            break;
        }
      }
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
};

module.exports = TeamMemberCampaign;
