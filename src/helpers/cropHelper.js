const CROP_IMG_CLASS = 'img-crop';
const CROP_IMG_PROFILE_CLASS = 'img-profile-crop';

const nonCropperProps = ['showPreview', 'cssClass'];

module.exports = {

  showCropper(imgUrl, options, cropData, callback) {
    require('cropperjs/dist/cropper.css');
    const Cropper = require('cropperjs').default;

    options = _.extend({
      viewMode: 1,
      dragMode: 'crop',
      aspectRatio: 1,
      // data: {}, //prev stored cropper data. We may need it when we allow user to change img cropping
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
      // zoomOnTouch: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      // ready: function() {//fires when image is loaded
      //
      // }

    }, options);

    //extract non cropper options
    let customOptions = {};
    _.each(nonCropperProps, (prop) => {
      customOptions[prop] = options[prop];
      delete options[prop];
    });

    let cropperTemplateWithPreview =
      '<div class="form-group">' +
        '<div class="row">' +
          '<div class="crop-image-container col-xl-7 col-lg-7 p-l-2">' +
            '<img src="' + imgUrl + '" id="cropSrcImage">' +
          '</div>' +
          '<div class="preview-container col-xl-5 col-lg-5 text-xs-center">' +
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
            '<button type="button" class="btn btn-secondary m-r-2" data-dismiss="modal">' +
              'Cancel' +
            '</button>' +
            '<button type="button" class="btn btn-primary cropper-ok" data-dissmiss="modal">' +
              'Save' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    let cropperTemplate =
      '<div class="form-group">' +
        '<div class="row">' +
          '<div class="crop-image-container col-xl-7 col-lg-7 p-l-2">' +
            '<img src="' + imgUrl + '" id="cropSrcImage">' +
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
      '</div>';

    //todo
    let modalTemplate =
      '<div class="modal fade bd-example-modal-lg modal-dropzone ' + (customOptions.cssClass || '') + '"' +
          'tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span> ' +
              '</button>' +
              '<h4 class="modal-title" id="exampleModalLabel"></h4>' +
            '</div>' +
          '<div class="modal-body">' +
            (customOptions.showPreview ? cropperTemplateWithPreview : cropperTemplate) +
          '</div>' +
          '<div class="modal-footer "></div>' +
        '</div>' +
      '</div>' +
    '</div>';

    let $modal = $(modalTemplate);
    let resultData = null;

    const clickButton = (e) => {
      e.preventDefault();

      $modal.modal('hide');

      return false;
    };

    $modal.on('hidden.bs.modal', (e) => {
      $modal.remove();

      if (_.isFunction(callback))
        callback(resultData);
    });

    $modal.find('.cropper-ok').on('click', (e) => {
      resultData = cropper.getData(true);
      return clickButton(e);
    });

    $modal.find('.cropper-cancel').on('click',clickButton);

    //show cropper when original image is loaded
    let $img = $modal.find('#cropSrcImage');
    $img.on('ready', (e) => {
      cropper.setData(cropData);
    });

    let cropper = new Cropper($img[0], options);

    $(document.body).append($modal);

    $modal.modal();
  },

};
