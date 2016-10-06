module.exports = {
  events: {
    'change input[name=phone]': 'formatPhone',
  },
  methods: {
    formatPhone(e) {
      $(e.target).val(this.$('input[name=phone]').val().replace(/^\(?(\d{3})\)?-?(\d{3})-?(\d{4})$/, '$1-$2-$3'));
    },
  },
};