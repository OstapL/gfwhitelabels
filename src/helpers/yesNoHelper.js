module.exports = {
  events: {
    'click input:radio': 'onRadioButtonChange',
  },
  methods: {
    onRadioButtonChange(e) {
        let $target = $(e.target);
        let val = $target.val();
        let targetElem = $target.attr('target');
        if (val == 'false') {
            this.$(targetElem + '.shown-yes').hide();
            this.$(targetElem + '.shown-no').show();
        } else if (val == 'true') {
            this.$(targetElem + '.shown-yes').show();
            this.$(targetElem + '.shown-no').hide();
        }
    },
  },
};