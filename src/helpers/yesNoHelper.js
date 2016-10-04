module.exports = {
  events: {
    'click input:radio': 'onRadioButtonChange',
  },
  methods: {
    onRadioButtonChange(e) {
        let $target = $(e.target);
        let val = $target.val();
        let targetElem = $target.attr('target');
        if (val == 'no') {
            this.$(targetElem).hide();
        } else {
            this.$(targetElem).show();
        }
    },
  },
};