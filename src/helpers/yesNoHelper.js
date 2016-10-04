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
            this.$(targetElem).hide();
        } else if (val == 'true') {
            this.$(targetElem).show();
        }
    },
  },
};