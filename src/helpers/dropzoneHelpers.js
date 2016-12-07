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
        this._updateModelData(name, data)
          .done(() => {
            if (typeof(onSuccess) === 'function') {
              onSuccess(data, file);
            }
          });
      });
    },

    _getDataFieldName(name) {
      return (this.fields[name].type === 'imagefolder' || this.fields[name].type === 'filefolder')
        ? name.replace('_id', '_data')
        : name.replace('_' + this.fields[name].type + '_id', '_data');
    },

    _updateModelData(name, data) {

      let f = this.fields[name];

      let dataFieldName = this._getDataFieldName(name);

      if (f.type === 'imagefolder' || f.type === 'filefolder') {
        this.model[dataFieldName].push(data[0]);
        // this.model[name] = data[0].id;
      } else {
        this.model[dataFieldName] = data;
        this.model[name] = data[0].id;
      }

      return this._notifyServer(name);
    },

    _notifyServer(name) {
      let dataFieldName = this._getDataFieldName(name);
      let data = _.pick(this.model, [name, dataFieldName]);

      // let method = this.submitMethod || 'PATCH';
      // return app.makeRequest(this.urlRoot.replace(':id', this.model.id), method, data);

      return app.makeRequest(this.urlRoot.replace(':id', this.model.id), 'PATCH', data);
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

        let fileId = $link.data('fileid');

        if (!fileId) {
          return false;
        }

        $link.prop('enabled', false);
        $link.off('click');

        let dataFieldName = this._getDataFieldName(name);

        // delete this.model[name];
        this.model[dataFieldName] = [];
        this._notifyServer(name).then((r) => {
          console.log(r);
          return api.makeRequest(filerServer + '/' + fileId, 'DELETE');
        }).then((r) => {
          console.log(r);
          $link.closest('.thumb-file-container')
            .empty()
            .append('<img src="/img/icons/file.png" alt="" class="img-file img-"' + name + '>' +
              '<a class="a-' + name + '" href="#"></a>');
        }).fail((err) => {
          console.log(err.responseJSON.error);
        });

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
            '<a href="#" class="delete-file" data-fileid="' + id + '">' +
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

        if (!fileId) {
          return;
        }

        $link.prop('enabled', false);
        $link.off('click');

        let dataFieldName = this._getDataFieldName(name);
        let dataArr = this.model[dataFieldName];
        let dataIdx = _(dataArr).findIndex((elem) => { return elem.id == fileId });
        if (dataIdx < 0) {
          return false;
        }

        dataArr.splice(dataIdx, 1);
        this._notifyServer(name).then((r) => {
          return api.makeRequest(filerServer + '/' + fileId, 'DELETE');
        }).then(() => {
          if (!dataArr.length) {
            //add empty file
            $link.closest('.file-scroll')
              .append('<div class="thumb-file-container text-xl-center">' +
                '<img src="/img/icons/file.png" alt="" class="img-file img-"' + name + '>' +
                '<a class="a-' + name + '" href="#"></a>' +
                '</div>');
          }
          $link.closest('.thumb-file-container').remove();
        }).fail((err) => {
          console.log(err.responseJSON.error)
        });

        return false;
      };

      this._initializeDropzone(name, dzOptions, (data, file) => {
        let textHelper = require('helpers/textHelper.js');
        let mimetypeIcons = require('helpers/mimetypeIcons.js');
        let icon = mimetypeIcons[data[0].mime.split('/')[1]];

        let fieldDataName = this._getDataFieldName(name);
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

        let files = $('.dropzone__' + name + ' .thumb-file-container');

        if(this.model[fieldDataName].length < files.length) {
          $('.dropzone__' + name + ' .thumb-file-container:first').remove();
        }

      });

      //attach remove event handlers to dropzone items
      $('.dropzone__' + name + ' .img-dropzone a.delete-file').each((idx, link) => {
        $(link).on('click', deleteFile);
      });
    },

    _image(name) {

      const onCrop = (imgData) => {
        const fieldDataName = this._getDataFieldName(name);
        let model = this.model[fieldDataName];
        if (!model[0].urls)
          model[0].urls = [];

        if (model[0].urls.length <= 1)
          model[0].urls.unshift(imgData.urls[0]);
        else
          model[0].urls[0] = imgData.urls[0];

        $('.img-' + name).attr('src', imgData.urls[0]);

        if (typeof(this.onImageCrop) === 'function') {
          this.onImageCrop(name);
        }

        this._notifyServer(name);
      };

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

        let dataContainer = $('.dropzone__' + name + ' .data-container');
        let noimageUrl = dataContainer.data('noimage') || '/img/default/255x153.png';

        let fieldDataName = this._getDataFieldName(name);

        //remove field from model
        // this.model[name] = null;
        this.model[fieldDataName] = [{ id: this.model[name].id, urls: [] }];

        this._notifyServer(name).then((r) => {
          return api.makeRequest(filerServer + '/' + imgId, 'DELETE');
        }).then((r) => {
          $link.closest('.one-photo').find('img.img-' + name).attr('src', noimageUrl || '/img/default/255x153.png');
          $link.closest('.delete-image-container').remove();
          if (typeof(this.onImageDelete) === 'function') {
            this.onImageDelete(name);
          }
        }).fail((error) => {
          console.log(error);
        });

        return false;
      };

      const cropImage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let imgId = $(e.target).closest('a.crop-image').data('imageid');
        if (!imgId) {
          return false;
        }

        imgId = parseInt(imgId, 10);

        this._cropImage(imgId, name, onCrop);

        return false;
      };

      let dzOptions = {
        paramName: name,
        params: {
          file_name: name,
          // rename: ''
        },
        acceptedFiles: 'image/*',
      };

      this._initializeDropzone(name, dzOptions, (data) => {
        //image actions
        let url = data[0].urls[0];
        let imgId = data[0].id;

        //update ui and bind events
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
          .on('click', cropImage);

        imgActionsBlock.find('a.delete-image')
          // .data('imageid', imgId)
          .on('click', deleteImage);

        let imgContainer = $('.dropzone__' + name + ' .one-photo');

        //remove buttons container if present
        imgContainer.find('.delete-image-container').remove();

        imgContainer.find('img.img-' + name).attr('src', url);

        imgContainer.prepend(imgActionsBlock);

        this._cropImage(imgId, name, onCrop);
      });

      $('.dropzone__' + name + ' a.delete-image').on('click', deleteImage);
      $('.dropzone__' + name + ' a.crop-image').on('click', cropImage);
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
        if (!imageId) {
          return;
        }

        $link.prop('enabled', false);
        $link.off('click');

        let dataFieldName = this._getDataFieldName(name);
        let dataArr = this.model[dataFieldName];
        let dataIdx = _(dataArr).findIndex((elem) => { return elem.id == imageId });
        if (dataIdx >= 0) {
          dataArr.splice(dataIdx, 1);
        }

        this._notifyServer(name).then((r) => {
          return api.makeRequest(filerServer + '/' + imageId, 'DELETE')
        }).then((r) => {
          if (dataIdx >= 0) {
            $link.closest('.one-photo').remove();
          }
        }).fail((err) => {
          alert(err.responseJSON.error);
        });

        return false;
      };

      const onCrop = (imgData) => {
        let dataFieldName = this._getDataFieldName(name);
        let model = this.model[dataFieldName];

        let img = _.find(model, (i) => {
          return this.originImageId == i.id;
        });

        if (img.urls.length <= 1) {
          img.urls.unshift(imgData.urls[0]);
        } else {
          img.urls[0] = imgData.urls[0];
        }

        $('a.crop-image[data-imageid=' + img.id + ']').closest('.one-photo').find('img').attr('src', imgData.urls[0]);

        this._notifyServer(name);
      };

      const cropImage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let imgId = $(e.target).closest('a.crop-image').data('imageid');

        this._cropImage(imgId, name, onCrop);

        return false;
      };

      this._initializeDropzone(name, dzOptions, (data, file) => {

        let fieldDataName = this._getDataFieldName(name);
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

      });

      //attach remove item handlers
      $('#' + name + ' a.delete-image').each((idx, link) => {
        $(link).on('click', deleteImage);
      });

      //attach crop image handlers
      $('#' + name + ' a.crop-image').each((idx, link) => {
        $(link).on('click', cropImage);
      });
    },

    _cropImage(imgId, name, callback) {

      let dataFieldName = this._getDataFieldName(name);
      let imgModel = this.model[dataFieldName];

      let img = _.find(imgModel, (i) => {
        return i.id == imgId;
      });

      this.originImageId = imgId;

      let url = _.last(img.urls);
      let fileName = img.name;

      const cropHelper = require('helpers/cropHelper.js');
      cropHelper.showCropper(url, this.fields[name].imgOptions, this._cropInfo, (imgData) => {

        let extPos = fileName.lastIndexOf('.');
        fileName = fileName.substring(0, extPos) +
            imgData.width + 'x' + imgData.height + fileName.substring(extPos);

        this._cropInfo = _.pick(imgData, ['x', 'y', 'width', 'height']);

        let reqData = _.extend({
          id: img.id,
          file_name: fileName,
        }, this._cropInfo);

        let reqOptions = {
          contentType: 'application/json; charset=utf-8',
        };

        api.makeRequest(filerServer + '/crop', 'PUT', reqData, reqOptions).done(callback);
      });
    },

  },

};
