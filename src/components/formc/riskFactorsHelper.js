module.exports = {
  events: {
    'submit form': 'submitRisk',
    'click .delete': 'deleteRisk',
    'click .edit-risk': 'editRisk',
    'change #complete': 'completeChanged'
  },

  methods: {
    deleteRisk (e) {
      e.stopPropagation();
      e.preventDefault();

      const index = e.target.dataset.index;

      app.dialogs.confirm('Do you really want to delete this risk?').then((confirmed) => {
        if (!confirmed)
          return;

        let url = this.urlRoot.replace(':id', this.model.id).replace(':index', index);

        api.makeRequest(url, 'DELETE', {}).then((data) => {
          if (index < Object.keys(this.defaultRisks).length) {
            let $form = this.$('form[index=' + index + ']');
            $form.find('.risk-button').css({display: 'none'});
            $form.find('.unadded-state').css({display: 'inline-block'});
            let $textarea = $form.find('textarea');
            $textarea.val(this.defaultRisks[index].risk);
            let $panel = this.$('.risk-panel[index=' + index + ']');
            $panel.find('a').removeClass('added-risk-title');
            $textarea.prop('readonly', true).removeClass('added').addClass('borderless-textarea unadded').css({ height: $textarea.prop('scrollHeight')+'px' });
          } else {
            let $section = $('.risk-panel[index=' + index + ']');
            $section.remove();
          }

          delete this.model[this.riskType][index];
          this.updateComplete();
        }).fail((xhr, status, text) => {
          api.errorAction(this, xhr, status, text, this.fields);
        });
      });
    },

    editRisk (e) {
      e.preventDefault();
      let $target = $(e.target);
      let index = $target.data('index');
      let $form = $('form[index=' + index + ']');
      $form.find('.risk-button').css({display: 'none'});
      $form.find('.editing-state').css({display: 'inline-block'});
      $form.find('.added-span').text('');
      $('textarea[index=' + index + ']').attr('readonly', false).removeClass('borderless-textarea unadded added').addClass('editing').css({height: ''});
    },

    submitRisk(e) {
      e.preventDefault();
      let index = e.target.dataset.index;

      let newRisk = false;
      if (!index) {
        index = Object.keys(this.defaultRisks).length - 1;
        $('.risk-panel').each(function(idx, elem) {
          let $elem = $(this);
          let panelIdx = parseInt($elem.attr('index'))
          if (panelIdx > index) index = panelIdx;
        });
        index += 1;
        newRisk = true;
      }

      let url = this.urlRoot.replace(':id', this.model.id).replace(':index', index);
      let formData = $(e.target).serializeJSON({ useIntKeysAsArrayIndex: true });

      api.makeRequest(url, 'PATCH', formData).then((data) => {
        let $textarea = $(e.target).find('textarea');
        if (!newRisk)
          $textarea.prop('readonly', true).removeClass('editing').addClass('borderless-textarea added').css({ height: $textarea.prop('scrollHeight')+'px' });

        let $form = $('form[index=' + index + ']');
        if ($form.length > 0) { // find the form    
          $form.find('.risk-button').css({display: 'none'});
          $form.find('.added-state').css({display: 'inline-block'});
          $form.find('.added-span').text(' (added to Form C)');
          let $panel = this.$('.risk-panel[index=' + index + ']');
          $panel.find('a').addClass('added-risk-title');
        } else {
          // create and append panel
          let template = require('components/formc/templates/risk.pug');
          $('#accordion-risk').append(template({
            k: index,
            v: formData,
          }));

          $('.add-risk-form').find('input:text, textarea').val('');
          const $panel = $('.risk-panel:last');
          const $newRiskTextarea = $panel.find('[name=risk]');
          $newRiskTextarea.prop('readonly', true).removeClass('editing').addClass('borderless-textarea added').css({ height: $newRiskTextarea.prop('scrollHeight')+'px' });
          $panel.scrollTo();
        }
        this.model[this.riskType][index] = formData;
        this.updateComplete();
      }).
      fail((xhr, status, text) => {
        api.errorAction(this, xhr, status, text, this.fields);
      });
    },

    updateComplete() {
      if (Object.keys(this.model[this.riskType]).length > 0) {
        this.$('#complete').prop({ disabled: true, checked: false }).change();
      } else {
        this.$('#complete').prop('disabled', false);
      }
    },

    completeChanged(e) {
      let $target = $(e.target);
      if ($target.prop('checked') != $target.data('previous')) {
        $target.data('previous', $target.prop('checked'));
        let option, data;
        if ($target.is(':checked')) {
          option = 'PATCH';
          data = { risk: '', title: '' };
        } else {
          option = 'DELETE';
        }
        let url = this.urlRoot.replace(':id', this.model.id).replace(':index', 99);
        api.makeRequest(url, option, data || {}).then((responseData) => {
          if (option == 'DELETE') {
            delete this.model[this.riskType][99];
          } else if (option == 'PATCH') {
            this.model[this.riskType][99] = data;
          }
        }).fail((xhr, status, text) => {
          api.errorAction(this, xhr, status, text, this.fields);
        });
      }
    }
  },
};
