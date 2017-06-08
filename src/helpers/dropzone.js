module.exports = {
  createImageDropzone(Dropzone, name, folderName, renameTo, onSuccess) {

    let params = {
      folder: folderName,
      file_name: name,
    };

    if (typeof renameTo != 'undefined' && renameTo != '') {
      params.rename = renameTo;
    }

    let dropbox = new Dropzone('.dropzone__' + name, {
      url: serverUrl + Urls['image2-list'](),
      paramName: name,
      params: params,
      createImageThumbnails: false,
      clickable: '.dropzone__' + name + ' span',
      thumbnail: function (file, dataUrl) {
          console.log('preview', file, file.xhr, file.xhr.response, file.xhr.responseText);
        },

      previewTemplate: `<div class="dz-details">
        </div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>`,
      headers: {
        Authorization:  'Token ' + localStorage.getItem('token'),
        'Cache-Control': null,
        'X-Requested-With': null,
      },
      uploadprogress: function (file, progress, bytesSend) {
        $(this.element).find('.uploading').show();
      },

      complete: function (file) {
        $(this.element).find('.uploading').hide();
      },

      dragover: function (e) {
        // $('.dropzone').css({ border: 'dashed 1px lightgray' });
        $('.border-dropzone').addClass('active-border');
        $(this.element).find('.border-dropzone').addClass('dragging-over');
      },

      dragleave: function (e) {
        // $('.dropzone').css({ border: 'none' });
        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      },

      dragend: function (e) {
        // $('.dropzone').css({ border: 'none' });
        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      },

      drop: function (e) {
        $(this.element).find('.uploading').show();

        // $('.dropzone').css({ border: 'none' });
        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      },

      acceptedFiles: 'image/*',
    });

    $('.dropzone__' + name).addClass('dropzone');//.html('Drop file here');


    dropbox.on('addedfile', function (file) {
      _(this.files).each((f, i) => {
        if (f.lastModified != file.lastModified) {
          this.removeFile(f);
        }
      });
    });

    dropbox.on('success', (file, data) => {
      $('.img-' + name).attr('src', data.url);
      $('.a-' + name).attr('href', data.origin_url).html(data.name);
      $('#' + name).val(data.file_id);
      if (typeof onSuccess != 'undefined') {
        onSuccess(data);
      }
    });

  },

  createFileDropzone(Dropzone, name, folderName, renameTo, onSuccess) {

    let params = {
      folder: folderName,
      file_name: name,
    };

    if (typeof renameTo != 'undefined' && renameTo != '') {
      params.rename = renameTo;
    }

    let dropbox = new Dropzone('.dropzone__' + name, {
      url: serverUrl + Urls['image2-list'](),
      paramName: name,
      params: params,
      createImageThumbnails: false,
      clickable: '.dropzone__' + name + ' span',
      thumbnail: function (file, dataUrl) {
        console.log('preview', file, file.xhr, file.xhr.response, file.xhr.responseText);
      },

      previewTemplate: `<div class="dz-details">
        </div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>`,
      headers: {
        Authorization:  'Token ' + localStorage.getItem('token'),
        'Cache-Control': null,
        'X-Requested-With': null,
      },
      uploadprogress: function (file, progress, bytesSend) {
        $(this.element).find('.uploading').show();
      },

      complete: function (file) {
        $(this.element).find('.uploading').hide();
      },

      dragover: function (e) {
        // $('.dropzone').css({ border: 'dashed 1px lightgray' });
        $('.border-dropzone').addClass('active-border');
        $(this.element).find('.border-dropzone').addClass('dragging-over');
      },

      dragleave: function (e) {
        // $('.dropzone').css({ border: 'none' });
        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      },

      dragend: function (e) {
        // $('.dropzone').css({ border: 'none' });
        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      },

      drop: function (e) {
        $(this.element).find('.uploading').show();

        // $('.dropzone').css({ border: 'none' });
        $('.border-dropzone').removeClass('active-border');
        $(this.element).find('.border-dropzone').removeClass('dragging-over');
      },

      acceptedFiles: 'application/pdf,.pptx,.ppt',
    });

    $('.dropzone__' + name).addClass('dropzone');//.html('Drop file here');

    /*
    dropbox.on('sending', function(data) {
        data.xhr.setRequestHeader("X-CSRFToken", getCSRF());
    });
    */

    dropbox.on('addedfile', function (file) {
      _(this.files).each((f, i) => {
        if (f.lastModified != file.lastModified) {
          this.removeFile(f);
        }
      });
    });

    dropbox.on('success', (file, data) => {
      $('.img-' + name).attr('src', data.url);
      $('.a-' + name).attr('href', data.origin_url).html(data.name);
      $('#' + name).val(data.file_id);
      if (typeof onSuccess != 'undefined') {
        onSuccess(data);
      }
    });

  },

  getDropzoneUrl(name, attr, values) {
    // If we have data attribute for a file  - we will
    // try to find url that match our size

    if (values[name + '_data'] && attr.thumbSize) {
      let thumbnails = values[name + '_data'].thumbnails;
      return app.getThumbnail(
        attr.thumbSize,
        thumbnails,
        attr.default || '/img/default/default.png'
      );
    } else {
      return attr.default || '/img/default/default.png';
    }
  },
};