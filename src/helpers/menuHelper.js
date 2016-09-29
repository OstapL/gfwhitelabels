module.exports = {
  events: {
    'hide.bs.collapse .panel': 'onCollapse',
    'show.bs.collapse .panel': 'onCollapse',
    // 'click .panel': 'onCollapse',
  },
  methods: {
      onCollapse (e) {
        // e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        let $elem = $(e.currentTarget);
        let $a = $elem.find('a.list-group-heading');
        let $icon = $a.find('.fa.arrow');
        if (e.type === 'show') {
          // if (!$elem.hasClass('sub-menu')) $a.addClass('active');
          $a.addClass('active');
          $icon.removeClass('fa-angle-left').addClass('fa-angle-down');
        } else if (e.type === 'hide') {
          // if (!$elem.hasClass('sub-menu')) $a.removeClass('active');
          $a.removeClass('active');
          $icon.removeClass('fa-angle-down').addClass('fa-angle-left');
        }
      },
      stop (e) {
        e.stopPropagation();
      }
  },
};
