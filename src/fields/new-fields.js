const FieldStaticProps = {
  extend(child) {
    const view = Backbone.View.extend.apply(this, arguments);
    view.prototype.events = _.extend({}, this.prototype.events, child.events);
    return view;
  }
};

const Field = Backbone.View.extend({
  tagName: 'div',
  events: {
    'change input': 'onChange',
  },

  initialize(options) {
    _.extend(this, _.pick(options, [
      'schema',
      'model',
      'name',
      'attr',
      // 'getValue',
      // 'setValue',
    ]));
  },

  // buildAttributes() {
  //   // (help_text ? 'showPopover' : '')
  //
  //   // (help_text ?help_text : '')
  //
  //   // //data-positive-only=(positiveOnly ? '1' :  false)
  //
  //   return {
  //     type: 'email',
  //     valueType: this.schema.type,
  //   };
  // },

  renderElement() {
    if (!this.elementID)
      this.elementID = `field_${this.cid}`;

    return `<div id="${this.elementID}"></div>`;
  },

  render() {
    this.setElement(`#${this.elementID}`);

    this.$el.html(
      this.template({
        value: this.getValue(),
        schema: this.schema,
        attr: {
          type: 'text',
          id: 'input-ID',
          placeholder: 'Placeholder text',
          helpText: 'Help text',
          readonly: false,
          disabled: false,
          fieldContainerClass: 'form-group row required',
          labelClass: 'col-xl-12 text-xl-left',
          inputContainerClass: 'col-xl-12',
          inputClass: 'form-control ',
        }
      })
    );
  },

  onChange(e) {
    // this.setValue(e.target.value);
  },

  getValue() {
    return '';
    //this.model.get(this.name);
  },

  setValue(value) {
    this.model.set(this.name, value);
  },

  getDisplayValue() {
    return this.getValue();
  },

  destroy() {
    this.undelegateEvents();
    this.$el.remove();
  },

}, FieldStaticProps);

const TextField = Field.extend({
  template: require('./templates/text.pug'),
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

const URLField = TextField.extend({

});

const SocialNetworkField = URLField.extend({

});

const PasswordField = TextField.extend({

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
  URLField,
  SocialNetworkField,
  PasswordField,
  SelectField,
  DateField,
  RadioGroupField,
  CheckboxField,
  MoneyField,
  PercentField,
  NestedField,
  FilesUploadField,
  ImageUploadField,
  ImageGalleryUploadField,
};