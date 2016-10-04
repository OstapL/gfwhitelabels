module.exports = {
  events: {
    'click .add-section': 'addSection',
    'click .delete-section': 'deleteSection',
  },

  methods: {
    addSection(e) {
      e.preventDefault();
      let sectionName = e.target.dataset.section;
      let template = require('templates/section.pug');
      this[sectionName + 'Index']++;
      $('.' + sectionName).append(
          template({
            fields: this.fields,
            name: sectionName,
            attr: {
              class1: '',
              class2: '',
              app: app,
              type: this.fields[sectionName].type,
              index: this[sectionName + 'Index'],
            },
            // values: this.model.toJSON(),
            values: this.model,
          })
      );
    },

    deleteSection(e) {
      e.preventDefault();
      if(confirm('Are you sure?')) {
        let sectionName = e.currentTarget.dataset.section;
        if($('.' + sectionName + ' .delete-section-container').length > 1) {
          $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index).remove();
          e.currentTarget.offsetParent.remove();
        } else {
          $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index + ' input').val('');
          $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index + ' textarea').val('');
        }
      }

      // ToDo
      // Fix index counter
      // this[sectionName + 'Index'] --;
    },
  },

  buildTemplate(name, schema, attr) {
    let template = attr.template;
    debugger;
    _(schema).each((name, val) => {
      let html = fieldBlock(name, '', schema[name]);
      template = template.replace('{{ ' + name + ' }}', html);
    });
    return template;
  }

};
