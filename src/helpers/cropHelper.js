module.exports = {

  showCropper(imageUrl, options, callback) {
    let defaultOptions = _.extend({
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
      //   cropper.enable();
      // }

    }, options);

    let modalTemplate =
      '<div class="modal fade bd-example-modal-lg modal-dropzone" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg">' +
          '<div class="modal-content">' +
            '<div class="modal-header">' +
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span> </button>' +
              '<h4 class="modal-title" id="exampleModalLabel"></h4>' +
            '</div>' +
            '<div class="modal-body">' +
              '<div class="form-group">' +
                '<div class="row">' +
                  '<div class="crop-image-container col-xl-7 col-lg-7">' +
                    '<img src="' + imageUrl + '" id="cropSrcImage">' +
                  '</div>' +
                  '<div class="preview-container col-xl-5 col-lg-5 text-xs-center">' +
                    '<div class="img-preview" style="width: 150px; height: 150px; float: left; overflow: hidden; margin: 8px;"></div>' +
                    '<div class="img-preview mini" style="width: 50px; height: 50px; float: left; overflow: hidden; margin: 8px;"></div>' +
                  '</div>' +
                '</div>' +
                '<div class="row">' +
                  '<div class="col-xl-12 m-t-3 m-b-2 text-xs-center">' + 
                    '<button type="button" class="btn btn-secondary m-r-2" data-dismiss="modal">Cancel</button>' +
                    '<button type="button" class="btn btn-primary cropper-ok" data-dissmiss="modal">Save</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="modal-footer ">' +
              
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';



    $(document.body).append(modalTemplate);
    const $modal = $('.bd-example-modal-lg');
    $modal.modal();
    $modal.on('hidden.bs.modal', (e) => {
      $modal.remove();
    });

    let $cropperOk = $('.cropper-ok');
    $cropperOk.on('click', function(e) {
      e.preventDefault();

      $modal.modal('hide');

      if (typeof(callback) === 'function') callback(cropper.getData(true));

      // console.log(cropper.getData(true));

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
