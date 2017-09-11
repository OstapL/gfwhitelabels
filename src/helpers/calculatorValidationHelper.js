module.exports = {
  events: {
    'click a.next': 'validateForLinks',
  },
  methods: {
    validate(e, data) {
        data = data || $(e.target).serializeJSON({ useIntKeysAsArrayIndex: true });
        this.$('.help-block').remove();
        if (!app.validation.validate(this.fields, data, this)) {
          Object.keys(app.validation.errors).forEach((key) => {
            const errors = app.validation.errors[key];
            app.validation.invalidMsg(this, key, errors);
          });

          const $el = this.$('.help-block').closest('.form-group').first();
          if (!app.isElementInView($el[0]))
            $el.scrollTo();
          return false;
        }
        return true;
    },

    validateForLinks(e) {
        const data = this.$('form').serializeJSON({ useIntKeysAsArrayIndex: true });
        if (!this.validate(e, data)) {
            e.preventDefault();
            e.stopPropagation();
        }
    },
  },
};
