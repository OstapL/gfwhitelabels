import deepDiff from 'deep-diff';

module.exports = {
  events: {
      'click a.list-group-item-action': 'confirmLeaving',
  },
  
  methods: {
    confirmLeaving(e) {
      if (this.isDifferent() === false){
        return;
      }

      //TODO: investigate logic and refactor this code///!!!
      if (confirm("You have unsaved changes. Do you really want to leave?")) {
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    },

    isDifferent() {
      let method = this.el.querySelector('form').dataset.method || 'POST';
      const model = this.model && this.model.toJSON 
        ? this.model.toJSON()
        : (this.model || {});

      if (model.hasOwnProperty('id'))
        method = this.el.querySelector('form').dataset.method || 'PATCH';

      let newData = $(this.el.querySelector('form')).serializeJSON();
      api.deleteEmptyNested.call(this, this.fields, newData);
      api.fixDateFields.call(this, this.fields, newData);

      if(method == 'PATCH') {
        let patchData = {};
        let d = deepDiff(newData, model);
        (d || []).forEach((el, i) => {
          if(el.kind == 'E' || el.kind == 'A') {
            patchData[el.path[0]] = newData[el.path[0]];
            if(this.fields[el.path[0]] && this.fields[el.path[0]].hasOwnProperty('dependies')) {
              this.fields[el.path[0]].dependies.forEach((dep, index) => {
                patchData[dep] = newData[dep];
              });
            }
          } else if(el.kind == 'N' && newData.hasOwnProperty(el.path[0])) {
            // In case if we delete data that was in the model
            var newArr = [];
            newData[el.path[0]].forEach((arr, i) => {
              newArr.push(arr);
            });
            patchData[el.path[0]] = newArr;
            if(this.fields[el.path[0]] && this.fields[el.path[0]].hasOwnProperty('dependies')) {
              this.fields[el.path[0]].dependies.forEach((dep, index) => {
                patchData[dep] = newData[dep];
              });
            }
          }
        });
        newData = patchData;
      };
      return Object.keys(newData).length !== 0;
    }
  },
};
