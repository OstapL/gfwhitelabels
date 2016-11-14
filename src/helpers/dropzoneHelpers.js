const Dropzone = require('dropzone');

const _dropzoneDefaults = {
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

const _dropzoneDefaultHandlers = {
  addedfile(file) {
    _(this.files).each((f, i) => {
      if (f.lastModified != file.lastModified) {
        this.removeFile(f);
      }
    });
  },
};

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

    _initializeDropzone(name, options, handlers, onSuccess) {

      let dropbox = new Dropzone('.dropzone__' + name, options);

      $('.dropzone__' + name).addClass('dropzone');

      _(handlers).each((handler, eventName) => {
        if (eventName === 'success') {
          dropbox.on(eventName, (file, data) => {
            handler.call(this, arguments);
            if (typeof(onSuccess) === 'function') {
              onSuccess(data);
            }
          });
        } else {
          dropbox.on(eventName, handler);
        }
      });
    },

    _file(name) {

      let dzParams = {
        file_name: name,
        // rename: '',
      };

      let dzOptions = _.extend({}, _dropzoneDefaults, {
        url: filerUrl + '/upload',
        paramName: 'file',
        params: dzParams,
        clickable: '.dropzone__' + name + ' span',
        acceptedFiles: 'application/pdf,.pptx,.ppt',
      });

      let dzHandlers = _.extend({}, _dropzoneDefaultHandlers, {
        success(data) {
          let mimetypeIcons = require('helpers/mimetypeIcons.js');
          let icon = mimetypeIcons[data[0].mime.split('/')[1]];
          $('.img-' + name).attr('src', '/img/icons/' + icon + '.png');
          $('.a-' + name).attr('href', data[0].urls[0]).html(data[0].name);
          $('#' + name).val(data[0].id);
          this.model[name.replace('_id', '_data')] = data;
        }
      });

      this._initializeDropzone(name, dzOptions, dzHandlers, (data) => {
        let params = {
          type: 'PATCH',
        };

        params[key] = data.file_id;

        app.makeRequest(
          this.urlRoot.replace(':id', this.model.id),
          params
        );
      });
    },

    _image(name) {
      let dzParams = {
        folder: name,
        file_name: name,
        // rename: ''
      };

      let dzOptions = _.extend({}, _dropzoneDefaults, {
        url: filerUrl + '/upload',
        paramName: name,
        params: dzParams,
        clickable: '.dropzone__' + name + ' span',
        acceptedFiles: 'image/*',
      });

      let dzHandlers = _.extend({}, _dropzoneDefaultHandlers, {
        success(data) {
          $('.img-' + name).attr('src', data.url);
          $('.a-' + name).attr('href', data.origin_url).html(data.name);
          $('#' + name).val(data.file_id);
        }
      });

      this._initializeDropzone(name, dzOptions, dzHandlers, (data) => {
        let params = {
          type: 'PATCH',
        };
        params[key] = data.file_id;

        app.makeRequest(
          this.urlRoot.replace(':id', this.model.id),
          params
        );
      });
    },

    _filefolder(name) {
      let dzParams = {
        folder: name,
        file_name: name,
        // rename: '',
      };

      let dzOptions = _.extend({}, _dropzoneDefaults, {
        url: filerUrl + '/upload',
        paramName: name,
        params: dzParams,
        clickable: '.dropzone__' + name + ' span',
        acceptedFiles: '*/*',
      });

      let dzHandlers = _.extend({}, _dropzoneDefaultHandlers, {
        success() {
          let mimetypeIcons = require('helpers/mimetypeIcons.js');
          let icon = mimetypeIcons[data[0].mime.split('/')[1]];
          $('.img-' + name).attr('src', '/img/icons/' + icon + '.png');
          $('.a-' + name).attr('href', data[0].urls[0]).html(data[0].name);
          this.model[name.replace('_id', '_data')] = data;
        }
      });

      this._initializeDropzone(name, dzOptions, dzHandlers, (data) => {
        let params = {
          type: 'PATCH',
        };
        params[key] = data.file_id;

        app.makeRequest(
          this.urlRoot.replace(':id', this.model.id),
          params
        );
      });
    },

  },

};
