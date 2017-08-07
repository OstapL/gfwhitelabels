const extend = function(child) {
  const view = Backbone.prototype.View.extend.apply(this, arguments);
  view.prototype.events = _.extend({}, this.prototype.events, child.events);
  return view;
};

const Field = Backbone.View.extend({
  events: {

  },

  initialize(options) {
    this.schema = options.schema;
    this.model = options.model;
  },

  render() {

  },

  destroy() {

  }

});

Field.extend =  extend;

const TextField = Field.extend({
  template: require('./templates/'),
});

const TextareaField = Field.extend({

});

const EmailField = Field.extend({
  template: require('./templates/fieldText.pug'),

  events: {

  },

  initialize() {

  },

  render() {

  },

});

const SelectField = Field.extend({

});

const DateField = Field.extend({

});

const NestedField = Field.extend({

});

const MoneyField = Field.extend({

});

const PercentField = Field.extend({

});

const RadioGroupField = Field.extend({

});

const CheckboxField = Field.extend({

});

const FilesUploadField = Field.extend({

});

const ImageUploadField = FilesUploadField.extend({});

const ImageGalleryUploadField = {};

module.exports = {
  EmailField,
  TextField,
  TextareaField,
  SelectField,
  DateField,
  MoneyField,
  PercentField,
  NestedField,
  FilesUploadField,
  ImageUploadField,
  ImageGalleryUploadField,
};