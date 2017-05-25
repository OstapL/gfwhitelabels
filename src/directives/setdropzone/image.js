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

  attachEvents() {
    super.attachEvents();
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

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
    $('.crop-image-container').append(img);
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

    this.snippets = {
      regular: require('./templates/snippets/cropperDefault.pug'),
      withpreview: require('./templates/snippets/cropperWithPreview.pug'),
    };
    this.template = require('./templates/cropperModal.pug');
  }

  render(attachTo) {
    $('.popover').popover('hide');

    if(this.options.template === null) {
      console.debug('Cropper template, cssClass, not set, dont know how to render cropper');
      return false;
    }

    const cropperModalHTML = this.template({
      cropperHTML: this.snippets[this.options.template]({
        name: this.file.file.name,
      }),
      cssClass: this.options.cssClass || '',
    });

    this.element = document.createRange().createContextualFragment(cropperModalHTML).firstChild;

    document.querySelectorAll('.cropModal').forEach((el, i) => {
      el.remove();
    });
    /*
    if(attachTo.querySelector('.cropModal') !== null) {
      attachTo.querySelector('.cropModal').remove();
    }
    */
    attachTo.appendChild(this.element);

    return this.showModalWithImage();
  }

  getCropperData() {
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

    return data;
  }

  showModalWithImage() {
    return new Promise((resolve, reject) => {
      this.$modal = $('.cropModal');

      this.$modal.on('hidden.bs.modal', (e) => {
        this.$modal.remove();
        resolve(this.cropperData);
      }).on('hide.bs.modal', (e) => {

      }).on('shown.bs.modal', (modalEvent) => {
        this.$modal.find('.cropper-ok').on('click', (okEvent) => {
          okEvent.preventDefault();
          this.cropperData = this.getCropperData();
          this.$modal.modal('hide');
          return false;
        });
      });

      Promise.all([loadImage(this.file.file.getOriginal()), getCropper()]).then((res) => {
        const [img, Cropper] = res;
        this.cropper = new Cropper(img, this.options.control);
        const cropData = this.options.auto ? _.extend({x: 0, y: 0}, this.options.auto) : null;
        this.$modal.modal('show');
        if (cropData) {
          this.cropper.setData(cropData);
        }
      });
    });
  }
}

module.exports = {
  ImageElement: ImageElement,
  ImageDropzone: ImageDropzone,
  CropperDropzone: CropperDropzone,
};
