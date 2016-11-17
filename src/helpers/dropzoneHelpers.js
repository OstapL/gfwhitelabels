const Dropzone = require('dropzone');

module.exports = {

  events: {
    dragover: 'globalDragover',
    dragleave: 'globalDragleave',
  },

  methods: {
    globalDragover() {
      this.$('.border-dropzone').addClass('active-border');
    },

    globalDragleave() {
      this.$('.border-dropzone').removeClass('active-border');
    },

    getDropzoneUrl(name, attr, values) {
      // If we have data attribute for a file  - we will
      // try to find url that match our size

      if (values[name + '_data'] && !$.isEmptyObject(values[name + '_data']) && attr.thumbSize) {
        let thumbnails = values[name + '_data'].thumbnails;
        return app.getThumbnail(
          attr.thumbSize,
          thumbnails,
          attr.default || '/img/icons/file.png'
        );
      } else {
        return attr.default || '/img/icons/file.png';
      }
    },

    createDropzones() {
      _(this.fields).each((field, name) => {
        if (!this['_' + field.type]) {
          return;
        }

        this['_' + field.type](name);
      });
    },

    _initializeDropzone(name, options, onSuccess) {

      let defaultOptions = {
        url: filerUrl + '/upload',
        clickable: '.dropzone__' + name + ' .border-dropzone',
        createImageThumbnails: false,
        thumbnail: function (file, dataUrl) {
          console.log('preview', file, file.xhr, file.xhr.response, file.xhr.responseText);
        },

        previewTemplate: `<div class="dz-details"></div>
          <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
          <div class="dz-error-message"><span data-dz-errormessage></span></div>`,
        headers: {
          Authorization:  'Bearer ' + localStorage.getItem('token'),
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
        },

      };

      let dropbox = new Dropzone('.dropzone__' + name, _.extend(defaultOptions, options));

      $('.dropzone__' + name).addClass('dropzone');

      dropbox.on('addedfile', (file) => {
        _(this.files).each((f, i) => {
          if (f.lastModified != file.lastModified) {
            this.removeFile(f);
          }
        });
      });

      dropbox.on('success', (file, data) => {
        this._notifyServerAboutChanges(name, data);
        if (typeof(onSuccess) === 'function') {
          onSuccess(data);
        }
      });

    },

    _notifyServerAboutChanges(name, data) {
      // let params = {
      //   type: 'PATCH',
      //   [name]: data[0].id,
      //   [name.replace('_id', '_data')]: data,
      // };
      //
      // app.makeRequest(
      //   this.urlRoot.replace(':id', this.model.id),
      //   params
      // );
    },

    _file(name) {

      let dzOptions = {
        paramName: 'file',
        params: {
          file_name: name,
        },
        acceptedFiles: 'application/pdf,.pptx,.ppt',
      };

      this._initializeDropzone(name, dzOptions, (data) => {
        let mimetypeIcons = require('helpers/mimetypeIcons.js');
        let icon = mimetypeIcons[data[0].mime.split('/')[1]];
        $('.img-' + name).attr('src', '/img/icons/' + icon + '.png');
        $('.a-' + name).attr('href', data[0].urls[0]).html(this._shortenFileName(data[0].name, 20).attr('title', data[0].name));
        $('#' + name).val(data[0].id);

        this.model[name] = data[0].id;
        this.model[name.replace('_id', '_data')] = data;
      });
    },

    _image(name) {
      let dzOptions = {
        paramName: name,
        params: {
          file_name: name,
          // rename: ''
        },
        acceptedFiles: 'image/*',
      };

      this._initializeDropzone(name, dzOptions, (data) => {
        $('.img-' + name).attr('src', data[0].urls[0]);
        $('.a-' + name).attr('href', data.origin_url).html(data.name);
        //$('#' + name).val(data.file_id);

        this.model[name] = data[0].id;
        this.model[name.replace('_id', '_data')] = data;

        const cropperHelper = require('helpers/cropHelper.js');
        cropperHelper.showCropper(data[0].urls[0]);
      });
    },

    _filefolder(name) {

      let dzOptions = {
        paramName: name,
        params: {
          //folder: name,
          file_name: name,
          group_id: this.model[name],
        },
        acceptedFiles: 'application/pdf',
      };

      this._initializeDropzone(name, dzOptions, (data) => {
        let mimetypeIcons = require('helpers/mimetypeIcons.js');
        let icon = mimetypeIcons[data[0].mime.split('/')[1]];
        if(this.model[name.replace('_id', '_data')].length == 0) {
          $('.img-' + name).attr('src', '/img/icons/' + icon + '.png');
          $('.a-' + name).attr('href', data[0].urls[0]).html(data[0].name);
        } else {
          $('.a-' + name + ':last').after(
            '<div class="col-xl-12"><img class="img-file img-' + name + '" src="/img/icons/' + icon + '.png" /></div>' +
            '<a class="a-' + name + '" href="' + data[0].urls[0] + '">' + data[0].name + '</a>'
          );
        }
        this.model[name.replace('_id', '_data')].push(data[0]);
      });
    },

  },

};
