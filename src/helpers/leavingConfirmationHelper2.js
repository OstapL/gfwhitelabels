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
      let newData;
      if (window.location.pathname.indexOf('risk-factors') !== -1){
        newData = {};
        newData[this.riskType] = this.model[this.riskType][99] ? {99: {title: '', risk: ''}} : {};
        let that = this;
        this.$('textarea.added, textarea.editing').each(function(){
          newData[that.riskType][$(this).data('index')] = {title: $(this).siblings('input[name=title]').val(), risk: $(this).val()};
        });
        let riskFormData = this.$('form.add-risk-form').serializeJSON();
        if (riskFormData.title || riskFormData.risk) {
          newData[this.riskType]['-1'] = riskFormData; 
        }
      } else {
        newData = this.$('form').serializeJSON({ useIntKeysAsArrayIndex: true });
      }
      api.deleteEmptyNested.call(this, this.fields, newData);
      api.fixDateFields.call(this, this.fields, newData);
      api.fixMoneyFields.call(this, this.fields, newData);
      let patchData = {};
      let d = deepDiff(this.model, newData);
      _(d).forEach((el, i) => {
        if(el.kind == 'E' || el.kind == 'A') {
          if (String(el.lhs) == String(el.rhs)) return;
          patchData[el.path[0]] = newData[el.path[0]];
        } else if(el.kind == 'N' && newData.hasOwnProperty(el.path[0])) {
          // In case if we delete data that was in the model
          if (el.path[0] instanceof Array) {
            var newArr = [];
            newData[el.path[0]].forEach((arr, i) => {
              newArr.push(arr);
            });
          } else {
            var newArr = {};
            for (let p in el.path[0]) {
              newArr[p] = el.path[0][p];
            }
          }
          patchData[el.path[0]] = newArr;
        }
      });
      return Object.keys(patchData).length !== 0;
    }
  },

};