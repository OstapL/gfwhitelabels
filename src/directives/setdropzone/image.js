const file = require('./file.js');
const imageTypes = require('consts/imageTypes.json');
const defaultImage = require('images/default/255x153.png');


class ImageElement extends file.FileElement {
  getTemplate() {
    if(this.options.templateImage) {
      return require('./templates/' + this.options.templateImage);
    } else {
      return require('./templates/image.pug');
    }
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
        ).render($(this.element).closest('.dropzone')[0]);
        return false;
      });
    });
  }
};


class ImageDropzone extends file.FileDropzone {

  constructor(view, fieldName, fieldDataName, imageOptions) {
    super(view, fieldName, fieldDataName, imageOptions);
    this.options.url = app.config.filerServer + '/image/upload'
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

    if(imageOptions.onSaved) {
      this.fileElement.options.onSaved = imageOptions.onSaved;
    }
    if(imageOptions.defaultImage) {
      this.fileElement.options.defaultImage = imageOptions.defaultImage;
    }

    this.cropperQuery = [];
  }

  getTemplate() {
    if(this.fileOptions.templateDropzone) {
      return require('./templates/' + this.fileOptions.templateDropzone);
    } else {
      return require('./templates/imageDropzone.pug');
    }
  }

  success(file, data) {
    const reorgData = {
      urls: {}
    };
    data.forEach((image) => {
      if(image.type === imageTypes.CROPRESIZE) {
        var cropName = this.cropperOptions.resize.width + 'x' + this.cropperOptions.resize.height;
        reorgData.urls[cropName] = image.url_filename;
      } else if (image.type === imageTypes.CROP) {
        reorgData.urls.main = image.url_filename;
      } else {
        reorgData.id = image.id;
        reorgData.name = image.name;
        reorgData.mime = image.mime;
        reorgData.urls.origin = image.url_filename;
      }
    });

    reorgData.site_id = app.sites.getId(),
    reorgData.name = '';
    this.fileElement.update(reorgData);
    // this.model[this.fileElement.fieldName] = reorgData.id;
    this.model[this.fileElement.fieldDataName] = reorgData;
    new CropperDropzone(
      this,
      this.fileElement,
      this.cropperOptions
    ).render($(this.element).closest('.dropzone')[0]);
  }
}


const CROP_IMG_CLASS = 'img-crop';
const CROP_IMG_PROFILE_CLASS = 'img-profile-crop';

require('cropperjs/dist/cropper.css');
const Cropper = require('cropperjs').default;


class CropperDropzone {
  constructor(dropzone, file, options={}) {
    this.dropzone = dropzone;
    this.file = file; //dropzone.fileElement;
    this.options = options;

    this.options.control = Object.assign({}, {
      viewMode: 2,
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
            '<button type="button" class="btn btn-secondary m-r-2 cropper-cancel cropperCancel" data-dismiss="modal">' +
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
          '<div class="col-xl-12 image-crop-padding">' +
            '<div class="crop-image-container"></div>' +
            '<input type="text" placeholder="Add image’s title here..." name="name" id="name" class="m-t-0 w-100 form-control" value="{name}" />' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-xl-12 m-t-3 m-b-0 text-xs-right image-crop-padding">' +
            '<button type="button" class="btn btn-secondary m-r-2 cropper-cancel cropperCancel" data-dismiss="modal">' +
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
              '<button type="button" class="close cropperCancel" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true"><i class="fa fa-times"> </i></span> ' +
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
    this.element = document.createRange().createContextualFragment(this.element);
    this.element.querySelectorAll('.cropperCancel').forEach((el) => {
      el.addEventListener(
        'click',
        (ev) => {
          this.dropzone.cropperQuery.shift();

          if (this.dropzone.cropperQuery.length !== 0) {
            this.dropzone.cropperQuery[0].render(
              this.dropzone.element.closest('.dropzone')
            );
          }
        },
        {once: true}
      );
    });

    document.querySelectorAll('.cropModal').forEach((el, i) => {
      el.remove();
    });
    /*
    if(attacheTo.querySelector('.cropModal') !== null) {
      attacheTo.querySelector('.cropModal').remove();
    }
    */
    attacheTo.appendChild(this.element)

    let img = new Image();
    var self = this;
    this.$modal = $('.cropModal');
    
    self.$modal.modal({
      backdrop: 'static',
      keyboard: false
    });

    self.$modal.on('hidden.bs.modal', function (e) {
      return false;
    });

    img.addEventListener("load", function() {
      setTimeout(() => {
      // self.$modal.on('shown.bs.modal', () => {

        self.cropper = new Cropper(this, self.options.control);
        const cropData = self.options.auto ? Object.assign({x: 0, y: 0}, self.options.auto) : null;
        self.$modal.modal('show');
        if (cropData) {
          self.cropper.setData(cropData);
        }

        self.attacheEvents();
      // });
      }, 400);
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
      const cropData = app.utils.pick(this.cropper.getData(true), ['x', 'y', 'width', 'height']);

      const cropTransformation = {
        type: "crop",
        cropWidth: cropData.width + cropData.x > maxWidth ? maxWidth - cropData.x : cropData.width,
        cropHeight: cropData.height + cropData.y > maxHeight ? maxHeight - cropData.y : cropData.height,
        cropOffsetX: cropData.x < 0 ? 0 : cropData.x,
        cropOffsetY: cropData.y < 0 ? 0 : cropData.y,
      };

      data.id = this.file.file.id;
      data.actions = [
        {
          filename: this.options.auto.width + 'x' + this.options.auto.height + '.' + this.file.file.getExtention(),
          type: imageTypes.CROP,
          transformations: [ 
            cropTransformation,
            { type: "fit", fitWidth: this.options.auto.width, fitHeight: this.options.auto.height },
          ],
        },
        {
          filename: this.options.resize.width + 'x' + this.options.resize.height + '.' + this.file.file.getExtention(),
          type: imageTypes.CROPRESIZE,
          transformations: [
            cropTransformation,
            { type: "fill", fillWidth: this.options.resize.width, fillHeight: this.options.resize.height },
          ]
        }
      ]

      api.makeRequest(
        app.config.filerServer + '/image/transform',
        'PUT',
        data
      ).done((responseData) => {

        let thumbSize = '';
        responseData.forEach((image) => {
          if(image.type === imageTypes.CROP) {
            this.file.file.urls.main = image.url_filename;
          }
          if(image.type === imageTypes.CROPRESIZE) {
            thumbSize = this.options.resize.width + 'x' + this.options.resize.height;
            this.file.file.urls[thumbSize] = image.url_filename;
          }
        });

        if (this.$modal.find('#name').length) {
          if (this.dropzone.galleryElement) {
            this.dropzone.galleryElement.file.data.find((el) => { 
              return el.id == this.file.file.id;
            }).name = this.$modal.find('#name').val();
          }
          if (this.dropzone.file) {
            this.dropzone.file.name = this.$modal.find('#name').val();
          }
          this.file.file.name = this.$modal.find('#name').val();
        }

        this.file.update(this.file.file).done(() => {
          this.$modal.modal('hide');
          setTimeout(() => {
            this.$modal.remove();
            if (this.dropzone.cropperQuery) {
              this.dropzone.cropperQuery.shift();

              if (this.dropzone.cropperQuery.length !== 0) {
                this.dropzone.cropperQuery[0].render(
                  this.dropzone.element.closest('.dropzone')
                );
              }
            }
          }, 400);
        });
      });

      return false;
    });
  }
}

module.exports = {
  ImageElement,
  ImageDropzone,
  CropperDropzone,
};
