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
      'attr',
      // 'getValue',
      // 'setValue',
    ]));

    this.buildAttributes();
  },

  buildAttributes() {
    this.attr = this.attr || {};

    this.attr = _.extend({
      type: 'text',
      valueType: 'text',
      id: '',
      placeholder: '',
      helpText: '',
      readonly: false,
      disabled: false,
      fieldContainerClass: 'form-group row ' + (this.schema.required ? 'required' : ''),
      labelClass: 'col-xl-12 text-xl-left',
      inputContainerClass: 'col-xl-12',
      inputClass: 'form-control ' + (this.attr.help_text ? 'showPopover' : ''),
      dataContent: this.attr.help_text || '',
      value: this.getValue(),
    }, this.attr);

    if (!this.attr.id)
      this.attr.id = this.attr.name;
  },

  renderPlaceholder() {
    return `<div id="${this.cid}"></div>`;
  },

  render() {
    this.$el.html(
      this.template({
        schema: this.schema,
        attr: this.attr,
      })
    );

    global.emailField = this;

    return this;
  },

  validate() {
    return true;
  },

  showErrors() {
    const $group = this.$el.find('input').parent();
    if (!$group.hasClass('has-error'))
      $group.addClass('has-error');

    const $helpBlock = $group.find('.help-block');
    if ($helpBlock.length) {
      $helpBlock.html('Error Message');
    } else {
      $group.append('<div class="help-block">' + 'Error Message' + '</div>');
    }
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
  template: require('./templates/textField.pug'),
});

const TextFieldWithLabel = TextField.extend({
  template: require('./templates/textFieldWithLabel.pug'),
});

const TextareaField = Field.extend({

});

const EmailField = TextField.extend({
  template: require('./templates/textField.pug'),
  buildAttributes() {
    TextField.prototype.buildAttributes.call(this);
    this.attr.type = 'email';
  },

  validate() {

  }

});

const PasswordField = TextField.extend({
  template: require('./templates/textField.pug'),

  buildAttributes() {
    TextField.prototype.buildAttributes.call(this);
    this.attr.type = 'password';
  },

  validate() {
    return true;
  }
});

const URLField = TextField.extend({

});

const SocialNetworkField = URLField.extend({

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
  TextField,
  TextFieldWithLabel,
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