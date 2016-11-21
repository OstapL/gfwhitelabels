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
        addRemoveLinks: false,
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
          onSuccess(data, file);
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
        let textHelper = require('helpers/textHelper.js');
        let mimetypeIcons = require('helpers/mimetypeIcons.js');
        let icon = mimetypeIcons[data[0].mime.split('/')[1]];

        let fileName = data[0].name;
        let url = data[0].urls[0];
        let id = data[0].id;

        $('.img-' + name).attr('src', '/img/icons/' + icon + '.png');
        $('.a-' + name).attr('href', url)
          .html(textHelper.shortenFileName(fileName))
          .attr('title', fileName);
        $('#' + name).val(id);

        this.model[name] = id;
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
        acceptedFiles: 'application/pdf,' +
          'application/msword,' + //.doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +//.docx
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',//.pptx
      };

      this._initializeDropzone(name, dzOptions, (data, file) => {
        let textHelper = require('helpers/textHelper.js');
        let mimetypeIcons = require('helpers/mimetypeIcons.js');
        let icon = mimetypeIcons[data[0].mime.split('/')[1]];

        let fieldDataName = name.replace('_id', '_data');
        let url = data[0].urls[0];

        let fileBlock = $('<div class="thumb-file-container">' +
          '<div class="delete-file-container" style="position: absolute;">' +
            '<a href="#" class="delete-file" data-fileid="' + data[0].id + '"><i class="fa fa-times"></i></a>' +
          '</div>' +
          '<img class="img-file img-' + name + '" src="/img/icons/' + icon + '.png" />' +
          '<a class="link-file a-' + name + '" target="_blank" href="' + url + '" title="' + data[0].name +'">' + textHelper.shortenFileName(data[0].name) + '</a>' +
        '</div>');

        let $link = fileBlock.find('a.delete-file');
        $link.on('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          let fileId = $link.data('fileid');

          $link.prop('enabled', false);
          $link.off('click');
          // api.makeRequest(filerUrl + '/' + fileId, 'DELETE').done(() => {
              //remove field from model
              let dataArr = this.model[name.replace('_id', '_data')];
              let dataIdx = _(dataArr).findIndex((elem) => { return elem.id == fileId});
              if (dataIdx >= 0) {
                dataArr.splice(dataIdx, 1);
                if (!dataArr.length) {
                  //add empty file
                  $link.closest('.file-scroll').append('<div class="thumb-file-container text-xl-center">' +
                    '<img src="/img/icons/nofile.png" alt="" class="img-file img-"' + name + '>' +
                    '<a class="a-' + name + '" href="#"></a>' +
                  '</div>');
                }
                $link.closest('.thumb-file-container').remove();
              }
          // });

          return false;
        });

        $('.dropzone__' + name + ' .thumb-file-container:last').after(fileBlock);



        if(this.model[fieldDataName].length == 0) {
          $('.dropzone__' + name + ' .thumb-file-container :first').remove();
        }

        this.model[name.replace('_id', '_data')].push(data[0]);
      });

      //attach remove event handlers to dropzone items
      $('.dropzone__' + name + ' .img-dropzone a.delete-file').each((idx, link) => {
        let $link = $(link);

        $link.on('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          let fileId = $link.data('fileid');

          $link.prop('enabled', false);
          $link.off('click');
          // api.makeRequest(filerUrl + '/' + fileId, 'DELETE').done(() => {
              //remove field from model
              let dataArr = this.model[name.replace('_id', '_data')];
              let dataIdx = _(dataArr).findIndex((elem) => { return elem.id == fileId});
              if (dataIdx >= 0) {
                dataArr.splice(dataIdx, 1);
                if (!dataArr.length) {
                  //add empty file
                  $link.closest('.file-scroll').append('<div class="thumb-file-container text-xl-center">' +
                    '<img src="/img/icons/nofile.png" alt="" class="img-file img-"' + name + '>' +
                    '<a class="a-' + name + '" href="#"></a>' +
                  '</div>');
                }
                $link.closest('.thumb-file-container').remove();
              }
          // });

          return false;
        });
      });
    },

  },

};
