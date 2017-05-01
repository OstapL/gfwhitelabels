const container = '#content';

const __showModal = (options) => {
  return new Promise((resolve, reject) => {
    const template = require('./templates/modal.pug');
    $(container).append(template(options));

    let $modal = $('#generic-modal');
    $modal.modal('show');

    let __closeModal = false;
    let __modalResult = void (0);

    $modal.on('click', '.modal-btn-ok', (e) => {
      __modalResult = true;
      __closeModal = true;
      $modal.modal('hide');
    });

    $modal.on('click', '.modal-btn-cancel', (e) => {
      __closeModal = true;
      $modal.modal('hide');
    });

    $modal.on('show.bs.modal', (e) => {

    });

    $modal.on('shown.bs.modal', (e) => {

    });

    $modal.on('hide.bs.modal', (e) => {
      if (!__closeModal) {
        e.preventDefault();
        return false;
      }

    });

    $modal.on('hidden.bs.modal', (e) => {
      $modal.off('show.bs.modal');
      $modal.off('shown.bs.modal');
      $modal.off('hide.bs.modal');
      $modal.off('hidden.bs.modal');
      $modal.remove();

      resolve(__modalResult);
    });
  });
};

module.exports = {
  info(options={}) {
    if (_.isString(options))
      options = { message: options };

    options.type = 'info';
    return __showModal(options);
  },

  warning(options={}) {
    if (_.isString(options))
      options = { message: options };

    options.type = 'warning';
    return __showModal(options);
  },

  error(options={}) {
    options.type = 'error';
    return __showModal(options);
  },

  confirm(options={}) {
    options.type = 'confirm';
    return __showModal(options);
  },

};