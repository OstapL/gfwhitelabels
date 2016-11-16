module.exports = {

  showCropper(imageUrl, options, callbacks) {
    let defaultOptions = {
      viewMode: 2,
      dragMode: 'crop',
      aspectRatio: 1,
      // data: {}, //prev stored cropper data. We may need it when we allow user to change img cropping
      preview: 'cropper-preview',
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
      //   cropper.enable();
      // }

    };

    let modalTemplate =
      '<div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span> </button>' +
              '<h4 class="modal-title" id="exampleModalLabel">Edit photo</h4>' +
            '</div>' +
            '<div class="modal-body">' +
              '<div class="form-group">' +
                '<img src="' + imageUrl + '" id="cropSrcImage">' +
              '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
              '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
              '<button type="button" class="btn btn-primary cropper-ok" data-dissmiss="modal">Save changes</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';



    $(document.body).append(modalTemplate);
    $('.bd-example-modal-lg').modal();

    let $cropperOk = $('.cropper-ok');
    $cropperOk.on('click', function(e) {
      e.preventDefault();
      console.log(cropper.getData(true));
      return false;
    });

    require('cropperjs/dist/cropper.css');
    const Cropper = require('cropperjs').default;
    let cropper = new Cropper($('#cropSrcImage')[0], defaultOptions);

    // let cropperData = cropper.getData(true);//rounded
    // let containerData = cropper.getContainerData();
    // let imageData = cropper.getImageData();
  },

};
