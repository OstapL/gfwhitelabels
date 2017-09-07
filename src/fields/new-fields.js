class Field {
  //should be overriden in descendant
  get template() {
    throw 'Not implemented';
  };

  get events() {
    return {};
  };

  constructor(options) {
    Object.assign(this, app.utils.pick(options, [
      'schema',
      'attr',
    ]));

    this.buildAttributes();
    this.errors = [];
    Object.assign(this, Backbone.Events);
  };

  buildAttributes() {
    this.attr = this.attr || {};
    if (!this.attr.elementID)
      this.attr.elementID = app.utils.uniqueId('field_');

    this.attr = Object.assign({
      type: 'text',
      id: '',
      placeholder: '',
      readonly: false,
      disabled: false,
      fieldContainerClass: 'form-group row ',
      labelClass: 'col-xl-12 text-xl-left',
      inputContainerClass: 'col-xl-12',
      inputClass: 'form-control',
      dataContent: this.attr.help_text || '',
      value: this.getValue(),
      valueType: this.schema.type,
    }, this.attr);

    if (!this.attr.id)
      this.attr.id = this.attr.name;

    if (this.schema.required)
      this.attr.fieldContainerClass += ' required';

    if (this.attr.help_text)
      this.attr.inputClass += ' showPopover';

  };

  getValue() {
    if (this.$el && this.$el.length)
      return this.$el.val();

    return this.attr.value || '';
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
      tmp: {},
    });
  };

  postRender() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.$el)
      return;

    this.$el = $('#' + this.attr.elementID);

    Object.keys(this.events).forEach((eventParam) => {
      const method = this.events[eventParam];
      const [event, selector] = eventParam.split(' ');
      const handler = this[method];
      if (typeof(handler) !== 'function')
        return;

      this.$el.on(event, selector, handler.bind(this));
    });
  };

  unbindEvents() {
    if (!this.$el)
      return;

    Object.keys(this.events).forEach((eventParam) => {
      const [event] = eventParam.split(' ');
      this.$el.off(event)
    });
  };

  destroy() {
    this.off();
    this.unbindEvents();
    this.$el.remove();
  }

  validate() {
    this.errors = [];
    this.hideErrors();
    return true;
  };

  showErrors() {
    if (!this.errors.length)
      return;

    const errors = this.errors.join(', ') + '.';
    const $group = this.$el.find('input').parent();
    if (!$group.hasClass('has-error'))
      $group.addClass('has-error');

    const $helpBlock = $group.find('.help-block');
    if ($helpBlock.length) {
      $helpBlock.html(errors);
    } else {
      $group.append('<div class="help-block">' + errors + '</div>');
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
    return Object.assign(super.events, {
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

const URLPatternRx = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

class URLField extends TextFieldWithLabel {
  get events() {
    return Object.assign(super.events, {
      'change input': 'onChange',
    });
  }

  getValue() {
    return this.$el
      ? this.$el.find('input').val()
      : (this.attr.value || '');
  }

  onChange(e) {
    e.preventDefault();

    app.helpers.format.appendHttpIfNecessary(e);

    if (!this.validate()) {
      this.showErrors();
    }

    return false;
  }

  validate() {
    super.validate();

    const value = this.getValue();
    if (!value)
      return true;

    if (!value.match(URLPatternRx)) {
      this.errors.push('Please, enter valid URL');
    }

    return !this.errors.length;
  }
}

class VideoLinkField extends URLField {
  constructor(options) {
    super(options);
  }

  get template() {
    return require('./templates/videoLinkField.pug');
  }

  postRender() {
    super.postRender();
    this._initVimeoVideoThumbnails();
  }

  validate() {
    if (!super.validate()) {
      return false;
    }

    const url = this.getValue();
    if (!url)
      return true;

    const info = app.getVideoInfo(url);
    if (!info.provider) {
      this.errors.push('Youtube or Vimeo link only, please');
    }
  }

  onChange(e) {
    super.onChange(e);
    if (!this.errors.length)
      this.updateVideo();
  }

  updateVideo() {
    const url = this.getValue();
    const img = this.$el[0].querySelector('img');

    if (!url) {
      img.src = require('images/default/default-video.png');
      return;
    }

    const videoInfo = app.getVideoInfo(url);

    if (videoInfo.provider === 'youtube')
      this._updateYoutubeThumbnail(img, videoInfo.id);
    else if (videoInfo.provider === 'vimeo')
      this._updateVimeoThumbnail(img, videoInfo.id);
  }

  _updateYoutubeThumbnail(img, videoID) {
    img.src = videoID
      ? '//img.youtube.com/vi/' + videoID + '/mqdefault.jpg'
      : require('images/default/default-video.png');
  }

  _updateVimeoThumbnail(img, videoID) {
    if (!videoID) {
      img.src = require('images/default/default-video.png');
      return;
    }

    $.getJSON('//vimeo.com/api/v2/video/' + videoID + '.json').then((response) => {
      if (!response || !response[0] || !response[0].thumbnail_large) {
        console.error('Unexpected response format');
        console.log(response);
        return;
      }

      img.src = response[0].thumbnail_large;
    }).fail((err) => {
      console.error('Failed to load thumbnail from vimeo');
      img.src = require('images/default/default-video.png');
    });
  }

  _initVimeoVideoThumbnails() {
    const $images = this.$el.find('img[data-vimeo-id]');
    if (!$images.length)
      return;

    $images.each((idx, img) => {
      this._updateVimeoThumbnail(img, img.dataset.vimeoId);
    });
  }

}

class NestedField extends Field {
  get events() {
    return Object.assign(super.events, {
      'click .addField': 'addField',
      'click .removeField': 'removeField',
    });
  }

  constructor(options) {
    super(options);

  }

  render() {

  }

  addField() {

  }

  removeField() {

  }

  editField() {

  }
}

const SYSTEM_FIELDS = ['domain', 'checkbox1'];

const createField = (schema={}, attr={}) => {
  if (SYSTEM_FIELDS.includes(attr.name))
    return null;


  switch(schema.type) {
    case 'boolean':
      return null;

    case 'decimal':
    case 'percent':
    case 'money':
    case 'integer':
    case 'url': {
      //temporary
      return new VideoLinkField({ schema, attr });
    }
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
  Object.keys(schemas).forEach((name) => {
    const schema = schemas[name];
    const attr = attrs[name] || {};
    attr.name = name;
    const field = createField(schema, attr);
    if (field)
      fields[name] = field;
  });
  return fields;
};

