const Image = require('./image.js');

class TeamMember {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data;
    this.schema = schema;
    this.url = url;

    this.data['photo_image_id'] = new Image(
      this.url,
      this.data.photo_data
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
    if (data.photo_image_id) {
      data['photo_image_id'] = this.data.photo_image_id.id;
    }
    return data;
  }
};


class TeamMemberFactory {
  constructor(data, schema={}, url=null) {
    this.members = [];

    if(Array.isArray(data)) {
      data.forEach((el, i) => {
        this.members.push(new TeamMember(el, schema, url + '/' + i));
      });
    } else if(data && data.members) {
      this.members = data.members;
    }
  }

  reorder() {
    function membersComparator(a, b) {
      if (a.order === b.order)
        return 0;

      if (a.order === null)
        return -1;

      if(b.order === null)
        return 1;

      return a.order - b.order;
    }

    let newMembers = this.members.slice();
    newMembers.forEach((el, i) => {
      el.index = i;
    });
    return newMembers.sort(membersComparator);
  }

  toJSON() {
    let data = [];
    this.members.forEach((el) => {
      data.push(el.toJSON());
    });
    return data;
  }
}

module.exports = {
  TeamMember: TeamMember,
  TeamMemberFactory: TeamMemberFactory,
};
