const file = require('./file.js');
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
      if(image.name.indexOf('_c_') != -1) {
        reorgData.urls.main = this.fileElement.fixUrl(image.urls[0]);
      } else if(image.name.indexOf('_r_') != -1) {
        var cropName = this.cropperOptions.resize.width + 'x' + this.cropperOptions.resize.height;
        reorgData.urls[cropName] = this.fileElement.fixUrl(image.urls[0]);
      } else {
        reorgData.id = image.id;
        reorgData.name = image.name;
        reorgData.mime = image.mime;
        reorgData.urls.origin = this.fileElement.fixUrl(image.urls[0]);
      }
    });

    reorgData.site_id = app.sites.getId(),
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

const getCropper = () => {
  return new Promise((resolve, reject) => {
    require.ensure([
      'cropperjs/dist/cropper.css',
      'cropperjs',
    ], () => {
      require('cropperjs/dist/cropper.css');
      const Cropper = require('cropperjs').default;
      resolve(Cropper);
    }, 'cropperjs_chunk');
  });
};



class CropperDropzone {
  constructor(dropzone, file, options={}) {
    this.dropzone = dropzone;
    this.file = file; //dropzone.fileElement;
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
            '<input type="text" placeholder="Add image’s title here..." name="name" id="name" class="m-t-0 w-100 form-control" value="{name}" />' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-xl-11 m-t-3 m-b-0 text-xs-right">' +
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
    this.element = document.createRange().createContextualFragment(this.element).firstChild;

    document.querySelectorAll('.cropModal').forEach((el, i) => {
      el.remove();
    });
    /*
    if(attacheTo.querySelector('.cropModal') !== null) {
      attacheTo.querySelector('.cropModal').remove();
    }
    */
    attacheTo.appendChild(this.element);

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
      // setTimeout(() => {
      // self.$modal.on('shown.bs.modal', () => {
        getCropper().then((Cropper) => {
          self.cropper = new Cropper(this, self.options.control);
          const cropData = self.options.auto ? _.extend({x: 0, y: 0}, self.options.auto) : null;
          self.$modal.modal('show');
          if (cropData) {
            self.cropper.setData(cropData);
          }

          self.attacheEvents();
        });
      // });
      // }, 400);
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

      cropData.width = cropData.width + cropData.x > maxWidth ? maxWidth-cropData.x : cropData.width;
      cropData.height = cropData.height + cropData.y > maxHeight ? maxHeight-cropData.y : cropData.height;
      cropData.name = this.options.auto.width + 'x' + this.options.auto.height + '.' + this.file.file.getExtention();

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
        responseData.forEach((image) => {
          if(image.name.indexOf(this.options.auto.width + 'x' + this.options.auto.height) != -1) {
            this.file.file.urls.main = this.file.fixUrl(image.urls[0]);
          } 
          if(this.options.resize && image.name.indexOf(this.options.resize.width + 'x' + this.options.resize.height) != -1) {
            thumbSize = this.options.resize.width + 'x' + this.options.resize.height;
            this.file.file.urls[thumbSize] = this.file.fixUrl(image.urls[0]);
          }
        });

        if (this.element.querySelector('#name')) {
          this.file.file.name = this.element.querySelector('#name').value;
        }

        this.file.update(this.file.file).done(() => {
          this.$modal.modal('hide');
          setTimeout(() => {
            this.$modal.remove();
          }, 400);
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
