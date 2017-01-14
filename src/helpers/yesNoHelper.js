module.exports = {
  events: {
    'click .yesno input:radio': 'onRadioButtonChange',
    'click .yesno input:checkbox': 'onCheckboxChange',
  },
  methods: {
    onRadioButtonChange(e) {
      const val = e.target.value;
      const name = e.target.name;
      
      if (val == 0 || val == 'false' || val == '0') {
        this.$('.' + name + '.shown-yes').hide();
        this.$('.' + name + '.shown-no').show();
      } else {
        this.$('.' + name + '.shown-yes').show();
        this.$('.' + name + '.shown-no').hide();
      }
    },

    onCheckboxChange(e) {
      let $cb = $(e.target);
      const name = $cb.data('name');

      if ($cb.is(':checked')) {
        this.$('.' + name + '.shown-yes').show();
        this.$('.' + name + '.shown-no').hide();
      } else {
        this.$('.' + name + '.shown-yes').hide();
        this.$('.' + name + '.shown-no').show();
      }
    },
  },
};
