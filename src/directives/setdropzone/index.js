const Dropzone = require('dropzone');

class FileDropZone {

  constructor(view, element, fieldName, fieldDataName, imgContainer) {
    this.element = document.querySelector(element);
    this.fieldName = fieldName;
    this.fieldDataName = fieldDataName;
    this.imgContainer = imgContainer;

    this.options = {
      url: filerServer + '/upload',
      clickable: element + ' .border-dropzone',
      createImageThumbnails: false,
      addRemoveLinks: false,

      previewTemplate: `<div class="dz-details"></div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>`,
      headers: {
        Authorization:  'Bearer ' + localStorage.getItem('token'),
        'Cache-Control': null,
        'X-Requested-With': null,
      },

      uploadprogress: function (file, progress, bytesSend) {
        $(this.element).find('.uploading').removeClass('collapse').show().css('z-index', 999);
      },

      complete: function (file) {
        $(this.element).find('.uploading').hide().addClass('collapse').css('z-index', '');
      },

      dragover: function (e) {
        $('.border-dropzone').addClass('active-border');
        $(this.element).find('.border-dropzone').addClass('dragging-over');
      },

      dragleave: function (e) {
        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      },

      dragend: function (e) {
        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      },

      drop: function (e) {
        $(this.element).find('.uploading').show();

        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      }
    };

    this.view = view;
    this.model = view.model;

    this.resultHtml = '';
    this.createDropZone();
    return this;
  }

  attacheEvents() {
    this.element.ondragover = () => {
      this.element.querySelector('.border-dropzone').classList.add('active-border');
    };
    this.element.ondragleave = () => {
      this.element.querySelector('.border-dropzone').classList.remove('active-border');
    };
  }

  render() {
    this.attacheEvents();
    return this;
  }

  createDropZone() {
    const dropbox = new Dropzone(this.element, this.options);

    this.element.classList.add('dropzone');

    dropbox.on('addedfile', (file) => {
      _(this.files).each((f, i) => {
        if (f.lastModified != file.lastModified) {
          this.removeFile(f);
        }
      });
    });

    dropbox.on('success', (file, data) => {
      this.success(file, data);
    });

    dropbox.on('error', (file, error, xhr) => {
      alert('show standart error message');
      this._errorAction(name, xhr, error);
    });
  }

  success(file, data) {
    const patchData = {};
    patchData[this.fieldName] = data[0].id;
    patchData[this.fieldDataName] = data[0];
    api.makeRequest(
        this.view.urlRoot,
        patchData,
        'PATCH'
    ).done(() => {
      debugger;
      this.element.querySelector(this.imgContainer).src = data[0].urls[0];
      if (typeof(this.onSuccess) === 'function') {
        this.onSuccess(data, file);
      }
    }).fail((xhr, status) => {
      alert('show standart error message');
    });
  }
};


module.exports = SetDropZone
