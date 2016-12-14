const deepDiff = require('deep-diff').diff;

module.exports = {
  events: {
      'click a.list-group-item-action': 'confirmLeaving',
  },
  
  methods: {
    confirmLeaving(e) {
      if (!this.isDifferent()) return;
      
      if (confirm("You have unsaved changes. Do you really want to leave?")) {
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    },

    isDifferent() {
      let newData = this.$('form').serializeJSON({ useIntKeysAsArrayIndex: true });
      api.deleteEmptyNested.call(this, this.fields, newData);
      api.fixDateFields.call(this, this.fields, newData);
      api.fixMoneyFields.call(this, this.fields, newData);
      let patchData = {};
      let d = deepDiff(newData, this.model);
      _(d).forEach((el, i) => {
        if(el.kind == 'E' || el.kind == 'A') {
          if (String(el.lhs) == String(el.rhs)) return;
          patchData[el.path[0]] = newData[el.path[0]];
        } else if(el.kind == 'N' && newData.hasOwnProperty(el.path[0])) {
          // In case if we delete data that was in the model
          var newArr = [];
          newData[el.path[0]].forEach((arr, i) => {
            newArr.push(arr);
          });
          patchData[el.path[0]] = newArr;
        }
      });
      return Object.keys(patchData).length !== 0;
    }
  },

};