const file = require('./file.js');
const defaultImage = '/img/default/255x153.png'; 


class ImageElement extends file.FileElement {
  getTemplate() {
    return require('./templates/image.pug');
  }

  getDefaultImage() {
    return this.options.defaultImage || defaultImage;
  }

  attacheEvents() {
    super.attacheEvents();
    // ToDo
    // This should be in the image model
    this.element.querySelectorAll('.cropImage').forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        new CropperDropzone(
          this,
          this,
          this.options,
        ).render(this.element.parentElement.parentElement.parentElement.parentElement);
        return false;
      });
    });
  }
};


class ImageDropzone extends file.FileDropzone {

  constructor(view, fieldName, fieldDataName, imageOptions) {
    super(view, fieldName, fieldDataName, imageOptions);
    this.options.acceptedFiles = 'image/*,.jpg,.png,.jpeg';

    this.cropperOptions = imageOptions.crop;

    if(this.cropperOptions.hasOwnProperty('auto')) {
      /*
      this.options.params.crop = true;
      this.options.params.width = this.cropperOptions.auto.width;
      this.options.params.height = this.cropperOptions.auto.height;
      */
      this.options.params.initialResize = true;
      this.options.params.initialResizeWidth = this.cropperOptions.auto.width;
      this.options.params.initialResizeHeight = this.cropperOptions.auto.height;
    }

    if(this.cropperOptions.hasOwnProperty('resize')) {
      this.options.params.resize = true;
      this.options.params.resizeWidth = this.cropperOptions.resize.width;
      this.options.params.resizeHeight = this.cropperOptions.resize.height;
    }

    this.fileElement = new ImageElement(
      this.model[fieldName],
      fieldName,
      fieldDataName,
      this.cropperOptions
    );
  }

  getTemplate() {
    return require('./templates/imageDropzone.pug');
  }

  success(file, data) {
    const reorgData = {};
    reorgData.id = data[2].id;
    reorgData.name = data[2].name;
    reorgData.mime = data[2].mime;
    reorgData.site_id = app.sites.getId(),
    reorgData.urls = {};
    reorgData.urls.origin = this.fileElement.fixUrl(data[2].urls[0]);
    reorgData.urls.main = this.fileElement.fixUrl(data[1].urls[0]);

    if(this.cropperOptions.resize) {
      var cropName = this.cropperOptions.resize.width + 'x' + this.cropperOptions.resize.height;
      reorgData.urls[cropName] = this.fileElement.fixUrl(data[0].urls[0]);
    };

    this.fileElement.update(reorgData);
    // this.model[this.fileElement.fieldName] = reorgData.id;
    this.model[this.fileElement.fieldDataName] = reorgData;
    new CropperDropzone(
      this,
      this.fileElement,
      this.cropperOptions
    ).render(this.element);
  }
}


const CROP_IMG_CLASS = 'img-crop';
const CROP_IMG_PROFILE_CLASS = 'img-profile-crop';

require('cropperjs/dist/cropper.css');
const Cropper = require('cropperjs').default;


class CropperDropzone {
  constructor(dropzone, file, options={}) {
    this.dropzone = dropzone;
    this.file = file//dropzone.fileElement;
    this.options = options;

    this.options.control = Object.assign({}, {
      viewMode: 0,
      dragMode: 'crop',
      aspectRatio: 1,
      data: {}, //prev stored cropper data. We may need it when we allow user to change img cropping
      preview: '.img-preview',
      responsive: true, //re-render cropper on window resize
      checkCrossOrigin: false, //need for reloading cached images
      modal: true,
      guides: true,
      center: true,
      highligth: false, //????
      autocrop: true,
      autocropArea: 0.8,
      movable: false,//move the image
      rotatable: false,
      scalable: true, //scale an image
      zoomable: false,
      minContainerWidth: 100,
      minContainerHeight: 100,
      zoomOnTouch: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      // ready: function() {//fires when image is loaded
      //   cropper.enable();
      // }
    }, this.options.control);
  }

  render(attacheTo) {
    // const template = require('./templates/cropperPopup.pug');

    $('.popover').popover('hide');
    const templates = {
      'withpreview': '<div class="row">' +
        '<div class="col-xl-7 col-lg-7 col-md-7 col-sm-7">' +
          '<div class="crop-image-container "></div>' +
        '</div>' +
        '<div class="preview-container col-xl-5 col-lg-5 col-md-5 col-sm-5 hidden-xs-down text-xs-center p-r-0">' +
          '<div class="row">' +
            '<div class="img-preview" style="width: 150px; height: 150px; overflow: hidden; margin: auto;"></div>' +
          '</div>' +
          '<div class="row">' +
            '<div class="img-preview mini" style="width: 50px; height: 50px; overflow: hidden; margin: auto;"></div>' +
          '</div>' +
        '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-xl-12 m-t-3 m-b-2 text-xs-center">' +
            '<button type="button" class="btn btn-secondary m-r-2 cropper-cancel" data-dismiss="modal">' +
              'Cancel' +
            '</button>' +
            '<button type="button" class="btn btn-primary cropper-ok" data-dissmiss="modal">' +
              'Save' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>',

      'regular': '<div class="form-group">' +
        '<div class="row">' +
          '<div class="col-xl-10 offset-xl-1">' +
            '<div class="crop-image-container"></div>' +
            '<input type="text" name="name" class="m-t-1" value="{name}" />' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-xl-12 m-t-3 m-b-0 text-xs-center">' +
            '<button type="button" class="btn btn-secondary m-r-2 cropper-cancel" data-dismiss="modal">' +
              'Cancel' +
            '</button>' +
            '<button type="button" class="btn btn-primary cropper-ok" data-dissmiss="modal">' +
              'Save' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>',
    };

    if(this.options.template === null) {
      console.debug('Cropper template, cssClass, not set, dont know how to render cropper');
      return false;
    }
    //todo
    this.element = 
      '<div class="modal fade cropModal modal-dropzone ' + this.options.cssClass + '"' +
          'tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog" role="document">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span> ' +
              '</button>' +
              '<h4 class="modal-title" id="exampleModalLabel"></h4>' +
            '</div>' +
          '<div class="modal-body">' +
            templates[this.options.template].replace('{name}', this.file.file.name)  +
          '</div>' +
          '<div class="modal-footer "></div>' +
        '</div>' +
      '</div>' +
    '</div>';

    document.querySelectorAll('.cropModal').forEach((el, i) => {
      el.remove();
    });
    /*
    if(attacheTo.querySelector('.cropModal') !== null) {
      attacheTo.querySelector('.cropModal').remove();
    }
    */
    attacheTo.insertAdjacentHTML('beforeend', this.element)

    let img = new Image();
    var self = this;
    this.$modal = $('.cropModal');

    img.addEventListener("load", function() {
      self.$modal.on('shown.bs.modal', () => {
        self.cropper = new Cropper(this, self.options.control);
        const cropData = self.options.auto ? _.extend({x: 0, y: 0}, self.options.auto) : null;
        self.$modal.modal('show');
        if (cropData) {
          self.cropper.setData(cropData);
        }
        self.attacheEvents();
      });
      self.$modal.modal('show');
    }, false);

    img.src = this.file.file.getOriginal();
    $('.crop-image-container').append(img)
  }

  attacheEvents() {
    this.$modal.find('.cropper-ok').on('click', (e) => {
      e.preventDefault();

      const imageData = this.cropper.getImageData();
      const maxWidth = imageData.naturalWidth,
            maxHeight = imageData.naturalHeight;

      const data = {};
      const cropData = _.pick(this.cropper.getData(true), ['x', 'y', 'width', 'height']);

      cropData.x = cropData.x < 0 ? 0 : cropData.x;
      cropData.y = cropData.y < 0 ? 0 : cropData.y;

      cropData.width = cropData.width > maxWidth ? maxWidth : cropData.width;
      cropData.height = cropData.height > maxHeight ? maxHeight : cropData.height;
      cropData.name = this.options.auto.width + 'x' + this.options.auto.height + '.' + this.file.file.getExtention(),

      data.file_name = cropData.width + 'x' + cropData.height + '.' + this.file.file.getExtention();
      data.id = this.file.file.id;
      data.crop = cropData;
      data.resize = {
        name: this.options.resize.width + 'x' + this.options.resize.height + '.' + this.file.file.getExtention(),
        width: this.options.resize.width,
        height: this.options.resize.height,
      };

      api.makeRequest(
        app.config.filerServer + '/transform_image',
        'PUT',
        data
      ).done((responseData) => {

        let thumbSize = '';
        this.file.file.urls.main = this.file.fixUrl(responseData[0].urls[0]);
        if(this.options.resize) {
          thumbSize = this.options.resize.width + 'x' + this.options.resize.height;
          this.file.file.urls[thumbSize] = this.file.fixUrl(responseData[1].urls[0]);
        }

        this.file.save().done(() => {
          if(this.options.resize) { 
            this.file.element.querySelector('img').src = this.file.file.getUrl(thumbSize);
          } else {
            this.file.element.querySelector('img').src = this.file.file.getUrl('main');
          }
          this.$modal.modal('hide');
        });
      });

      return false;
    });
  }
}

module.exports = {
  ImageElement: ImageElement,
  ImageDropzone: ImageDropzone,
  CropperDropzone: CropperDropzone
};
