class Field {
  //should be overriden in descendant
  get template() {};

  get events() {
    return {};
  };

  constructor(options) {
    _.extend(this, _.pick(options, [
      'schema',
      'attr',
    ]));

    this.buildAttributes();
  };

  buildAttributes() {
    this.attr = this.attr || {};
    if (!this.attr.elementID)
      this.attr.elementID = _.uniqueId('field_');

    this.attr = _.extend({
      type: 'text',
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
      valueType: this.schema.type,
    }, this.attr);

    if (!this.attr.id)
      this.attr.id = this.attr.name;

  };

  getValue() {

  };

  setValue() {

  };

  render() {
    if (this.$el)
      this.$el.empty();

    this.$el = null;

    return this.template({
      schema: this.schema,
      attr: this.attr,
    });
  };

  bindEvents() {
    if (this.$el)
      return;

    this.$el = $('#' + this.attr.elementID);

    _(this.events).each((method, eventParam) => {
      const [event, selector] = eventParam.split(' ');
      const handler = this[method];
      if (!_.isFunction(handler))
        return;

      this.$el.on(event, selector, handler.bind(this));
    });
  };

  unbindEvents() {
    if (!this.$el)
      return;

    _(this.events).each((method, eventParam) => {
      const [event] = eventParam.split(' ');
      this.$el.off(event)
    });
  };

  destroy() {
    this.unbindEvents();
    this.$el.remove();
  }

  validate() {
    return true;
  };

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
  };

  hideErrors() {
    const $group = this.$el.find('input').parent();
    $group.removeClass('has-error');
    const $helpBlock = $group.find('.help-block');
    $helpBlock.remove();
  };
}

class TextField extends Field {
  get template() {
    return require('./templates/textField.pug');
  }

  get events() {
    return _.extend(super.events, {
      'change input': 'onChange',
    });
  };

  onChange(e) {

  };
}

class EmailField extends TextField {

}

class TextFieldWithLabel  extends TextField {
  get template() {
    return require('./templates/textFieldWithLabel.pug');
  }

}

const SYSTEM_FIELDS = ['domain', 'checkbox1'];

const createField = (schema={}, attr={}) => {
  if (_.contains(SYSTEM_FIELDS, attr.name))
    return null;

  switch(schema.type) {
    case 'boolean':
      return null;

    case 'decimal':
    case 'percent':
    case 'money':
    case 'integer':
    case 'url':
    case 'password': {
      attr.type = 'password';
      if (attr.label)
        return new TextFieldWithLabel({ schema, attr });

      return new TextField({ schema, attr });
    }
    case 'email': {
      attr.type = 'email';
      if (attr.label)
        return new TextFieldWithLabel({ schema, attr });

      return new TextField({ schema, attr });
    }
  }

  /* default: 'text' */
  if (attr.label)
    return new TextFieldWithLabel({ schema, attr });

  return new TextField({ schema, attr });
};

export const createFields = (schemas, attrs) => {
  const fields = {};
  _(schemas).each((schema, name) => {
    const attr = attrs[name] || {};
    attr.name = name;
    const field = createField(schema, attr);
    if (field)
      fields[name] = field;
  });
  return fields;
};

