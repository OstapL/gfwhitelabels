const file = require('./file.js');
const defaultImage = '/img/default/255x153.png'; 


class ImageElement extends file.FileElement {
  getTemplate() {
    return require('./templates/image.pug');
  }

  getDefaultImage() {
    return this.options.defaultImage || defaultImage;
  }
};


class ImageDropzone extends file.FileDropzone {

  constructor(view, fieldName, fieldDataName, imageOptions) {
    super(view, fieldName, fieldDataName, imageOptions);
    this.options.acceptedFiles = 'image/*,.jpg,.png,.jpeg';

    this.cropperOptions = imageOptions.crop;

    if(this.cropperOptions.hasOwnProperty('auto')) {
      this.options.params.crop = true;
      this.options.params.width = this.cropperOptions.auto.width;
      this.options.params.height = this.cropperOptions.auto.height;
    }

    this.fileElement = new ImageElement(
      this.model[fieldName],
      fieldName,
      fieldDataName
    );
  }

  getTemplate() {
    return require('./templates/imageDropzone.pug');
  }

  success(file, data) {
    const reorgData = data[1];
    reorgData.urls = {
      origin: data[1].urls[0]
    };
    reorgData.urls[data[0].name.split('_')[1].split('.')[0]] = data[0].urls[0];

    this.fileElement.update(reorgData).done(() => {
      debugger;
      this.fileElement.render(this.fileElement.element);
      new CropperDropzone(
        this.fileElement,
        this.cropperOptions
      ).render('#content');
    });
  }
}


const CROP_IMG_CLASS = 'img-crop';
const CROP_IMG_PROFILE_CLASS = 'img-profile-crop';

require('cropperjs/dist/cropper.css');
const Cropper = require('cropperjs').default;


class CropperDropzone {
  constructor(file, options={}) {
    this.file = file;
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

    const templates = {
      'withpreview':
      '<div class="row">' +
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
      'regular':
      '<div class="form-group">' +
        '<div class="row">' +
          '<div class="col-xl-10 offset-xl-1">' +
            '<div class="crop-image-container"></div>' +
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
            templates[this.options.template]  +
          '</div>' +
          '<div class="modal-footer "></div>' +
        '</div>' +
      '</div>' +
    '</div>';

    document.querySelector(attacheTo).innerHTML += this.element;

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

    img.src = this.file.file.urls.origin;
    $('.crop-image-container').append(img)
  }

  attacheEvents() {
    this.$modal.find('.cropper-ok').on('click', (e) => {
      e.preventDefault();

      const imageData = this.cropper.getImageData();
      const maxWidth = imageData.naturalWidth,
            maxHeight = imageData.naturalHeight;

      const data = _.pick(this.cropper.getData(true), ['x', 'y', 'width', 'height']);

      data.x = data.x < 0 ? 0 : data.x;
      data.y = data.y < 0 ? 0 : data.y;

      data.width = data.width > maxWidth ? maxWidth : data.width;
      data.height = data.height > maxHeight ? maxHeight : data.height;
      data.file_name = data.width + 'x' + data.height + '.' + this.file.file.getExtention();
      data.id = this.file.file.id;

      api.makeRequest(
        filerServer + '/crop',
        'PUT',
        data
      ).done((responseData) => {
        this.file.file.urls[data.width + 'x' + data.height] = responseData.urls[0];
        debugger;
        this.file.save().done(() => {
          this.file.render(
              this.file.element
          )
          this.$modal.modal('hide');
        });
      });

      return false;
    });
  }
}

module.exports = {
  ImageElement: ImageElement,
  ImageDropzone: ImageDropzone
};
