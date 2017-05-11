class View {
  constructor(template, urlRoot, el='#content', events={}, helpers=[], options) {
    this.template = template;
    this.$el = $(el);
    this.el = this.$el[0];

    // get methods and events from helpers, join to events
    this.preinitialize();

    // attach events
    this.initialize(options);
  }

  preinitialize() {}

  initialize(options) {
    // initialization
  }

  render() {
  }
}

