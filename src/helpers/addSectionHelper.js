module.exports = {
  events: {
    // 'click .add-section': 'addSection',
    'click .delete-section': 'deleteSection',
    'click .add-sectionnew': 'addSectionNew',
    'click .delete-sectionnew': 'deleteSectionNew',
  },

  methods: {
    // addSection(e) {
    //   e.preventDefault();
    //   let sectionName = e.target.dataset.section;
    //   let template = require('templates/section.pug');
    //   this[sectionName + 'Index']++;
    //   $('.' + sectionName).append(
    //       template({
    //         fields: this.fields,
    //         name: sectionName,
    //         attr: {
    //           class1: '',
    //           class2: '',
    //           app: app,
    //           type: this.fields[sectionName].type,
    //           index: this[sectionName + 'Index'],
    //         },
    //         // values: this.model.toJSON(),
    //         values: this.model,
    //       })
    //   );
    // },

    deleteSection(e) {
      e.preventDefault();

      const target = e.currentTarget;
      const sectionName = target.dataset.section;
      const index = target.dataset.index;

      app.dialogs.confirm('Are you sure?').then((confirmed) => {
        if (!confirmed)
          return;

        if($('.' + sectionName + ' .delete-section-container').length > 1) {
          $('.' + sectionName + ' .index_' + index).remove();
          target.offsetParent.remove();
        } else {
          $('.' + sectionName + ' .index_' + index + ' input').val('');
          $('.' + sectionName + ' .index_' + index + ' textarea').val('');
          this.el.querySelectorAll('.' + sectionName + '[data-index="' + index + '"] select').forEach((el) => {
            el.querySelector('option').selected = true;
          });
        }
        // ToDo
        // Fix index counter
        // this[sectionName + 'Index'] --;
      });
    },

    addSectionNew(e) {
      /** Create nested fields section 
       ** MUST HAVE: 
       **  - Target dataset comp - name of the component
       **  - Target dataset template  - name of the template to render
       ** Will look for the template in components/{{ component }}/templates/snippet/{{ template }}.pug
      */

      e.preventDefault();

      const sectionName = e.target.dataset.section;
      // const template = require('components/' + e.target.dataset.comp + '/templates/snippets/' + e.target.dataset.template + '.pug');
      const template = this.snippets[e.target.dataset.template];
      this[sectionName + 'Index']++;

      $('.' + sectionName + '_container').append(
        template({
          fields: this.fields[sectionName],
          name: e.target.dataset.section,
          attr: this.fields[sectionName],
          values: [],
          index: this[sectionName + 'Index']
        })
      );
    },

    deleteSectionNew(e) {
      /** Delete nested fields section 
       ** Looks for parent .addSectionBlock and delete hole block
       ** TODO
       ** Reorder blocks after deleting
      */

      e.preventDefault();
      const target = e.currentTarget;
      const sectionName = target.dataset.section;
      const index = target.dataset.index;

      app.dialogs.confirm('Are you sure?').then((confirmed) => {
        if (!confirmed)
          return;

        if(this.$el.find('.' + sectionName + '.addSectionBlock').length > 1) {
          $(target).parents('.addSectionBlock').remove();
        } else {
          this.$el.find('.' + sectionName + '[data-index=' + index + '] input').val('');
          this.$el.find('.' + sectionName + '[data-index=' + index + '] textarea').val('');
          this.el.querySelectorAll('.' + sectionName + '[data-index="' + index + '"] select').forEach((el) => {
            el.querySelector('option').selected = true;
          });
          if (sectionName == 'additional_video') {
            this.$el.find('.' + sectionName + '[data-index=' + index + '] input').trigger('change');
          }
        }
        this[sectionName + 'Index'] --;
        // TODO
        // Fix index of the next fields
      });
    },

    createIndexes() {
      /*
       * Will create indexes for nested fields 
       */

      this.jsonTemplates = {};
      Object.keys(this.fields).forEach((key) => {
        const el = this.fields[key];
        if(el.type == 'nested') {
          if(typeof this.model[key] != 'object') {
            this[key + 'Index'] =  0;
          }
          else {
            this[key + 'Index'] = Array.isArray(this.model[key]) ?
              this.model[key].length - 1: Object.keys(this.model[key]).length - 1;
            if(this[key + 'Index'] == -1) {
              this[key + 'Index'] = 0;
            }
          }
        }
      });
    },

    // buildJsonTemplates(component, context={}) {
    //   /*
    //    * Build html for nested fields
    //    * PARAMS:
    //    *    - component: name of the component
    //    * MUST RUN AFTER createIndex function
    //    */
    //
    //   _(this.fields).each((el, key) => {
    //     if (el.type !== 'nested' || el.schema.urls)
    //       return;
    //
    //     this.jsonTemplates[key] = require('components/' + component + '/templates/snippets/' + key + '.pug')(Object.assign({
    //       attr: Object.assign(
    //         {}, this.fields[key]
    //       ),
    //       name: key,
    //       values: this.model[key] || {},
    //       first_run: 1,
    //     }, context));
    //   });
    // },

    buildSnippets(snippets, context={}) {
      this.snippets = snippets;
      Object.keys(this.fields).forEach((key) => {
        const el = this.fields[key];
        if (el.type !== 'nested' || el.schema.urls)
          return;

        this.jsonTemplates[key] = snippets[key](Object.assign({
          attr: Object.assign(
            {}, this.fields[key]
          ),
          name: key,
          values: this.model[key] || {},
          first_run: 1,
        }, context));
      });
    },

    assignLabels() {
      /*
       * Assign labels for nested fields
       * PARAMS:
       *    - using this.labels dict
       */
      Object.keys(this.fields).forEach((key) => {
        const el = this.fields[key];
        if(el.type == 'nested') {
          Object.keys(el.schema).forEach((subkey) => {
            const subel = el.schema[subkey];
            if(this.labels[key])
              subel.label = this.labels[key][subkey];
          });
        } else {
          el.label = this.labels[key];
        }
      });
    },
  },
};
