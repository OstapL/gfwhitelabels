const template = require('templates/downloadables.pug');

module.exports = {
  show(data) {
    //clear existing modal
    let $modal = $('#files-modal');
    if ($modal.length) {
      $modal.modal('hide');
      $modal.remove();
    }

    $(document.body).append(template(data));

    $('#files-modal').modal('show');
  },

};