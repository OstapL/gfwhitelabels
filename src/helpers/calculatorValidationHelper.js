const validation = require('components/validation/validation.js');

module.exports = {
  events: {
    'click a.next': 'validateForLinks',
  },
  methods: {
    validate(e, data) {
        data = data || $(e.target).serializeJSON({ useIntKeysAsArrayIndex: true });
        this.$('.help-block').remove();
        if(!validation.validate(this.fields, data, this)) {
            _(validation.errors).each((errors, key) => {
                validation.invalidMsg(this, key, errors);
            });
            this.$('.help-block').prev().scrollTo(5);
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