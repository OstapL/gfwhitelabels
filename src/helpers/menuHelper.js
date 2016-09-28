module.exports = {
  events: {
    'hidden.bs.collapse .panel': 'onCollapse',
    'show.bs.collapse .panel': 'onCollapse',
  },
  methods: {
      onCollapse (e) {
        let $elem = $(e.currentTarget);
        let $a = $elem.find('a.list-group-heading');
        let $icon = $a.find('.fa.arrow');
        if (e.type === 'show') {
          $a.addClass('active');
          $icon.removeClass('fa-angle-left').addClass('fa-angle-down');
        } else if (e.type === 'hidden') {
          $a.removeClass('active');
          $icon.removeClass('fa-angle-down').addClass('fa-angle-left');
        }
      },
  },
};
