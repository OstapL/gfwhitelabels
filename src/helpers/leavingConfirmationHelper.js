module.exports = {
  events: {
      'click a.list-group-item-action': 'confirmLeaving',
      'change input,textarea': 'onInputChanged',
  },
  
  methods: {
    onInputChanged(e) {
      this.modified = true;
    },

    confirmLeaving(e) {
      if (!this.modified) return;
      
      if (confirm("You have unsaved changes. Do you really want to leave?")) {
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  },

};