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
        url: filerServer + '/upload',
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
        acceptedFiles: 'application/pdf,' +
          '.pptx,' +
          '.ppt,' +
          '.doc,' +
          '.docx'
      };

      const deleteFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let $link = $(e.target).closest('a.delete-file');

        // let fileId = $link.data('fileid');

        $link.prop('enabled', false);
        $link.off('click');
        // api.makeRequest(filerServer + '/' + fileId, 'DELETE').done(() => {
        //remove field from model

        delete this.model[name];
        delete this.model[name.replace('_id', '_data')];

        $link.closest('.thumb-file-container')
          .empty()
          .append('<img src="/img/icons/file.png" alt="" class="img-file img-"' + name + '>' +
            '<a class="a-' + name + '" href="#"></a>');
        // });

        return false;
      };

      this._initializeDropzone(name, dzOptions, (data) => {
        let textHelper = require('helpers/textHelper.js');
        let mimetypeIcons = require('helpers/mimetypeIcons.js');
        let icon = mimetypeIcons[data[0].mime.split('/')[1]];

        let fileName = data[0].name;
        let url = data[0].urls[0];
        let id = data[0].id;

        let fileBlock = $('<div class="delete-file-container" style="position: absolute;">' +
            '<a href="#" class="delete-file" data-fileid="' + data[0].id + '">' +
              '<i class="fa fa-times"></i>' +
            '</a>' +
          '</div>' +
          '<img class="img-file img-' + name + '" src="/img/icons/' + icon + '.png" />' +
          '<div class="row">' +
          '<a class="link-file a-' + name + '" target="_blank" ' +
            'href="' + url + '" title="' + fileName +'">' +
              textHelper.shortenFileName(fileName) + '</a>' +
          '</div>'
          );

        let $link = fileBlock.find('a.delete-file');
        $link.on('click', deleteFile);

        $('.dropzone__' + name + ' .thumb-file-container')
          .empty()
          .append(fileBlock);

        this.model[name] = id;
        this.model[name.replace('_id', '_data')] = data;
      });

      $('.dropzone__' + name + ' .img-dropzone a.delete-file').each((idx, link) => {
        $(link).on('click', deleteFile);
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
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +  //.docx
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',  //.pptx
      };

      const deleteFile = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let $link = $(e.target).closest('a.delete-file');
        let fileId = $link.data('fileid');

        $link.prop('enabled', false);
        $link.off('click');
        // api.makeRequest(filerServer + '/' + fileId, 'DELETE').done(() => {
        //remove field from model
        let dataArr = this.model[name.replace('_id', '_data')];
        let dataIdx = _(dataArr).findIndex((elem) => { return elem.id == fileId });
        if (dataIdx >= 0) {
          dataArr.splice(dataIdx, 1);
          if (!dataArr.length) {
            //add empty file
            $link.closest('.file-scroll')
              .append('<div class="thumb-file-container text-xl-center">' +
                '<img src="/img/icons/file.png" alt="" class="img-file img-"' + name + '>' +
                '<a class="a-' + name + '" href="#"></a>' +
                '</div>');
          }
          $link.closest('.thumb-file-container').remove();
        }
        // });

        return false;
      };

      this._initializeDropzone(name, dzOptions, (data, file) => {
        let textHelper = require('helpers/textHelper.js');
        let mimetypeIcons = require('helpers/mimetypeIcons.js');
        let icon = mimetypeIcons[data[0].mime.split('/')[1]];

        let fieldDataName = name.replace('_id', '_data');
        let url = data[0].urls[0];

        let fileBlock = $('<div class="thumb-file-container">' +
          '<div class="delete-file-container" style="position: absolute;">' +
          '<a href="#" class="delete-file" data-fileid="' + data[0].id + '">' +
          '<i class="fa fa-times"></i>' +
          '</a>' +
          '</div>' +
          '<img class="img-file img-' + name + '" src="/img/icons/' + icon + '.png" />' +
          '<a class="link-file a-' + name + '" target="_blank" ' +
          'href="' + url + '" title="' + data[0].name +'">' +
          textHelper.shortenFileName(data[0].name) + '</a>' +
          '</div>');

        let $link = fileBlock.find('a.delete-file');
        $link.on('click', deleteFile);

        $('.dropzone__' + name + ' .thumb-file-container:last').after(fileBlock);

        if(this.model[fieldDataName].length == 0) {
          $('.dropzone__' + name + ' .thumb-file-container:first').remove();
        }

        this.model[name.replace('_id', '_data')].push(data[0]);
      });

      //attach remove event handlers to dropzone items
      $('.dropzone__' + name + ' .img-dropzone a.delete-file').each((idx, link) => {
        $(link).on('click', deleteFile);
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
        let dataFieldName = name.replace('_id', '_data');
        let url = data[0].urls[0];
        let imgId = data[0].id;
        let fileName = data[0].name;
        // let originUrl = data[0].origin_url;

        let imgActionsBlock = $(
          '<div class="delete-image-container">' +
            '<a class="crop-image" data-imageid="' + imgId + '">' +
              '<i class="fa fa-crop"></i>' +
            '</a>' +
            '<a class="delete-image" data-imageid="' + imgId + '">' +
              '<i class="fa fa-times"></i>' +
            '</a>' +
          '</div>');

        imgActionsBlock.find('a.crop-image')
          // .data('imageid', imgId)
          .on('click', this._cropImage.bind(this));

        imgActionsBlock.find('a.delete-image')
          // .data('imageid', imgId)
          .on('click', deleteImage);

        let imgContainer = $('.dropzone__' + name + ' .one-photo');
        imgContainer.find('img.img-' + name).attr('src', url);
        // imgContainer.find('a.a-' + name).attr('href', originUrl).html(fileName);

        imgContainer.prepend(imgActionsBlock);


        this.model[name] = imgId;
        this.model[dataFieldName] = data;

        let img = {
          url: url,
          fileName: fileName,
          id: imgId,
        };

        //todo: set default cropping^ possibly on the server
        this._cropImage(img, this.fields[name].imgOptions, (imgData) => {
          $('.img-' + name).attr('src', imgData.urls[0]);
        });

      });

      $('.dropzone__' + name + ' .img-dropzone a.delete-image').on('click', deleteImage);
      $('.dropzone__' + name + ' .img-dropzone a.crop-image').on('click', this._cropImage.bind(this));

      const deleteImage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let $link = $(e.target).closest('a.delete-image');

        let imgId = $link.data('imageid');
        if (!imgId) {
          return;
        }

        $link.prop('enabled', false);
        $link.off('click');

        api.makeRequest(filerServer + '/' + imgId, 'DELETE').done(() => {

          //remove field from model
          delete this.model[name];
          delete this.model[name.replace('_id', '_data')];

          $link.closest('.one-photo').find('img.img-' + name).attr('src', '/img/default/255x153.png');
          $link.closest('.delete-image-container').remove();
        });

        return false;
      };

    },

    _imagefolder(name) {
      let dzOptions = {
        paramName: name,
        params: {
          //folder: name,
          file_name: name,
          group_id: this.model[name],
        },
        acceptedFiles: 'image/*',

      };

      const deleteImage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let $link = $(e.target).closest('a.delete-image');
        let imageId = $link.data('imageid');

        $link.prop('enabled', false);
        $link.off('click');
        // api.makeRequest(filerServer + '/' + fileId, 'DELETE').done(() => {
        //remove field from model
        let dataArr = this.model[name.replace('_id', '_data')];
        let dataIdx = _(dataArr).findIndex((elem) => { return elem.id == imageId });
        if (dataIdx >= 0) {
          dataArr.splice(dataIdx, 1);
          $link.closest('.one-photo').remove();
        }
        // });

        return false;
      };

      const cropImage = (e) => { console.log('NOT IMPLEMENTED')};

      this._initializeDropzone(name, dzOptions, (data, file) => {

        let fieldDataName = name.replace('_id', '_data');
        let url = data[0].urls[0];
        let imageId = data[0].id;

        let imageBlock = $('<div class="col-xl-4 one-photo">' +
          '<div class="delete-image-container">' +
            '<a class="crop-image" href="#" data-imageid="' + imageId + '">' +
              '<i class="fa fa-crop"></i>' +
            '</a>' +
            '<a class="delete-image" href="#" data-imageid="' + imageId + '">' +
              '<i class="fa fa-times"></i>' +
            '</a>' +
          '</div>' +
          '<img class="w-100 img-' + name + '" src="' + url + '">' +
        '</div>');

        imageBlock.find('a.delete-image').on('click', deleteImage);
        imageBlock.find('a.crop-image').on('click', cropImage);

        $('.dropzone__' + name + ' .all-gallery').append(imageBlock);

        this.model[fieldDataName].push(data[0]);
      });

      //attach remove item handlers
      $('.dropzone__' + name + ' .img-dropzone a.delete-image').each((idx, link) => {
        $(link).on('click', deleteImage);
      });

      //attach crop image handlers
      $('.dropzone__' + name + ' .img-dropzone a.crop-image').each((idx, link) => {
        $(link).on('click', cropImage);
      });
    },

    _cropImage(img, options, callback) {
      const cropperHelper = require('helpers/cropHelper.js');
      cropperHelper.showCropper(img.url, options, (imgData) => {

        let extPos = img.fileName.lastIndexOf('.');
        let fileName = img.fileName.substring(0, extPos) + imgData.width + 'x' + imgData.height + img.fileName.substring(extPos);

        let reqData = _.chain(imgData)
          .pick(['x', 'y', 'width', 'height'])
          .extend({
            id: img.id,
            file_name: fileName,
          }).value();

        api.makeRequest(filerServer + '/crop', 'PUT', reqData, { contentType: 'application/json; charset=utf-8' }).done(callback);
      });
    },

    _deleteImage(e) {

    }
  },

};
