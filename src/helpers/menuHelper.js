module.exports = {
  events: {
    'hide.bs.collapse .panel': 'onCollapse',
    'show.bs.collapse .panel': 'onCollapse',
    // 'click .panel': 'onCollapse',
  },
  methods: {
      onCollapse (e) {
        // e.preventDefault();
        e.stopPropagation();
        let $elem = $(e.currentTarget);
        let $a = $elem.find('a.list-group-heading:first');
        let $icon = $a.find('.fa.arrow:first');
        if (e.type === 'show') {
          $a.addClass('active');
          $icon.removeClass('fa-angle-left').addClass('fa-angle-down');
        } else if (e.type === 'hide') {
          $a.removeClass('active');
          $icon.removeClass('fa-angle-down').addClass('fa-angle-left');
        }
      },
      stop (e) {
        e.stopPropagation();
      }
  },
};
