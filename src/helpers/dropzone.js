module.exports = {
  createImageDropzone(Dropzone, name, folderName, renameTo, onSuccess) {

    let params = {
      folder: folderName,
      file_name: name,
    };

    if(typeof renameTo != 'undefined' && renameTo != '') {
      params['rename'] = renameTo;
    }

    let dropbox = new Dropzone(".dropzone__" + name, {
      url: serverUrl + Urls['image2-list'](),
      paramName: name,
      params: params,
      createImageThumbnails: false,
      clickable: '.dropzone__' + name + ' span',
      thumbnail: function(file, dataUrl) {
          console.log('preview', file, file.xhr, file.xhr.response, file.xhr.responseText);
      },
      previewTemplate: `<div class="dz-details">
        </div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>`,
      headers: {
        'Authorization':  'Token ' + localStorage.getItem('token'),
        'Cache-Control': null,
        'X-Requested-With': null,
      },
      uploadprogress: function(file, progress, bytesSend) {
        $(this.element).find('.uploading').show();
        // console.log('uploading...');
      },
      complete: function(file) {
        $(this.element).find('.uploading').hide();
        // hid the layer of the progress bar
      },
      dragover: function(e) {
        // this.trigger('dragover');
        $('.dropzone').css({ border: 'dashed 1px lightgray' });
      },
      dragleave: function(e) {
        // this.trigger('dragleave');
        $('.dropzone').css({ border: 'none' });
      },
      dragend: function(e) {
        // this.trigger('dragleave');
        $('.dropzone').css({ border: 'none' });
      },
      drop: function(e) {
        // this.trigger('dragleave');
        $(this.element).find('.uploading').show();
        $('.dropzone').css({ border: 'none' });
      },
    });

    $('.dropzone__' + name).addClass('dropzone')//.html('Drop file here');

    /*
    dropbox.on('sending', function(data) {
        data.xhr.setRequestHeader("X-CSRFToken", getCSRF());
    });
    */

    dropbox.on('addedfile', function(file) {
      _(this.files).each((f, i) => {
        if(f.lastModified != file.lastModified) {
          this.removeFile(f);
        }
      });
      //this.removeFile(true);
    });

    dropbox.on("success", (file, data) => {
      $('.img-' + name).attr('src', data.url);
      $('.a-' + name).attr('href', data.origin_url).html(data.name);
      console.log(data);
      if(typeof onSuccess != 'undefined') {
        onSuccess(data);
      }
    });

  },

  createFileDropzone(Dropzone, name, folderName, renameTo, onSuccess) {

    let params = {
      folder: folderName,
      file_name: name
    };

    if(typeof renameTo != 'undefined' && renameTo != '') {
      params['rename'] = renameTo;
    }

    let dropbox = new Dropzone(".dropzone__" + name, {
      url: serverUrl + Urls['image2-list'](),
      paramName: name,
      params: params,
      createImageThumbnails: false,
      clickable: '.dropzone__' + name + ' span',
      thumbnail: function(file, dataUrl) {
        console.log('preview', file, file.xhr, file.xhr.response, file.xhr.responseText);
      },
      previewTemplate: `<div class="dz-details">
        </div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>`,
      headers: {
        'Authorization':  'Token ' + localStorage.getItem('token'),
        'Cache-Control': null,
        'X-Requested-With': null,
      }
    });

    $('.dropzone__' + name).addClass('dropzone')//.html('Drop file here');

    /*
    dropbox.on('sending', function(data) {
        data.xhr.setRequestHeader("X-CSRFToken", getCSRF());
    });
    */

    dropbox.on('addedfile', function(file) {
      _(this.files).each((f, i) => {
        if(f.lastModified != file.lastModified) {
          this.removeFile(f);
        }
      });
    });

    dropbox.on("success", (file, data) => {
      $('.img-' + name).attr('src', data.url);
      $('.a-' + name).attr('href', data.origin_url).html(data.name);
      console.log(data);
      if(typeof onSuccess != 'undefined') {
        onSuccess(data);
      }
    });

  },

  getDropzoneUrl(name, attr, values) {
    // If we have data attribute for a file  - we will
    // try to find url that match our size
    if(values[name + '_data'] && attr.thumbSize) {
      let thumbnails = values[name + '_data'].thumbnails;
      console.log('v', thumbnails, );
      return app.getThumbnail(attr.thumbSize, thumbnails, attr.default || '/img/default/default.png');
    } else {
      return attr.default || '/img/default/default.png'
    }
  }
};
