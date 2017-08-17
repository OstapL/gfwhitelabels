module.exports = {
  WithLeftMenu: Backbone.View.extend({
    el: '#content',

    initialize(options) {
      this.template = options.template;
      this.eventsAttached = false;
    },

    render() {
      this.$el.html(
        this.template(
          this.model
        ),
      );

      if (!this.eventsAttached) {
        $(window).on('scroll', this.updateMenuOnScroll.bind(this));
        this.eventsAttached = true;
      }

      return this;
    },

    updateMenuOnScroll(e) {
      const leftMenu = this.el.querySelector('.pages-left-menu');
      if (!leftMenu)
        return;

      const menuItems = leftMenu.querySelectorAll('a');
      const visibleElements = _(menuItems).map((menuItem) => {
        const href = menuItem.getAttribute('href');
        return href && href.startsWith('#')
          ? document.getElementById(href.replace('#', ''))
          : null;
      }).filter(scrollElement => scrollElement && app.isElementInView(scrollElement, 0.9));

      const visibleTopmostElement = visibleElements ? visibleElements[0] : null;
      if (!visibleTopmostElement)
        return;

      _.each(menuItems, (menuItem) => {
        const href = menuItem.getAttribute('href').replace('#', '');
        const elementID = visibleTopmostElement.getAttribute('id');
        if (href=== elementID)
          menuItem.parentElement.classList.add('active');
        else
          menuItem.parentElement.classList.remove('active');
      });
    }
  }),
  subscriptionThanks: Backbone.View.extend({
    el: '#content',
    template: require('./templates/subscription-thanks.pug'),

    render() {
      this.$el.html(
        this.template()
      );
    },

  }),
};