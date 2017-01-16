const Dropzone = require('dropzone');

const helpers = {
  crop: require('./cropHelper.js'),
  icons: require('./iconsHelper.js'),
  text: require('./textHelper.js'),
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

    _initializeDropzone(name, options, onSuccess) {

      let defaultOptions = {
        url: filerServer + '/upload',
        clickable: '.dropzone__' + name + ' .border-dropzone',
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
        },

      };

      options = _.extend(defaultOptions, options);

      const f = this.fields[name];
      let autoCropParams = _.contains(['image', 'imagefolder'], f.type)
        ? f.crop && f.crop.auto
          ? _.extend({ crop: true }, f.crop.auto)
          : null
        : null;

      _.extend(options.params, autoCropParams);

      let dropbox = new Dropzone('.dropzone__' + name, options);

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
          }).fail((xhr, status) => {
            this._errorAction(name, xhr, status);
          });
      });
      dropbox.on('error', (file, error, xhr) => {
        this._errorAction(name, xhr, error);
      });
    },

    _getDataFieldName(name) {
      return (this.fields[name].type === 'imagefolder' || this.fields[name].type === 'filefolder')
        ? name.replace('_id', '_data')
        : name.replace('_' + this.fields[name].type + '_id', '_data');
    },

    //data[0] - cropped image
    //data[1] - original image;
    _updateModelData(name, data) {
      this._resetError(name);

      let f = this.fields[name];

      let dataFieldName = this._getDataFieldName(name);

      if (f.type === 'filefolder') {
        this.model[dataFieldName].push(data[0]);
        // this.model[name] = data[0].id;
      } else if (f.type === 'imagefolder') {
        let croppedImage = data[0];
        let originalImage = data[1] || data[0];

        this.model[dataFieldName].push(originalImage);

        if (croppedImage.id == originalImage.id) {
          this.model.push(originalImage)
        } else {
          originalImage.urls[1] = croppedImage.urls[0];//this is hack for gallery
        }
      } else {
        this.model[dataFieldName] = data;
        this.model[name] = data[0].id;
      }

      return this._notifyServer(name);
    },

    _notifyServer(name, extra) {
      let dataFieldName = this._getDataFieldName(name);
      let data = _.pick(this.model, [name, dataFieldName]);
      data = _.extend(data, extra);

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

        this.model[name] = null;
        this.model[dataFieldName] = [];

        this._notifyServer(name).then((r) => {
          return api.makeRequest(filerServer + '/' + fileId, 'DELETE');
        }).then((r) => {

          $link.closest('.thumb-file-container')
            .empty()
            .append('<img src="/img/icons/file.png" alt="" class="img-file img-"' + name + '>' +
              '<a class="a-' + name + '" href="#"></a>');
        }).fail((xhr, status) => {
          this._errorAction(name, xhr, status);
        });

        return false;
      };

      this._initializeDropzone(name, dzOptions, (data) => {
        let iconPath = helpers.icons.resolveIconPath(data[0].mime)

        let fileName = data[0].name;
        let url = app.getFilerUrl(data[0].urls[0]);
        let id = data[0].id;

        let fileBlock = $('<div class="delete-file-container" style="position: absolute;">' +
            '<a href="#" class="delete-file" data-fileid="' + id + '">' +
              '<i class="fa fa-times"></i>' +
            '</a>' +
          '</div>' +
          '<img class="img-file img-' + name + '" src="' + iconPath + '" />' +
          '<div class="row">' +
          '<a class="link-file a-' + name + '" target="_blank" ' +
            'href="' + url + '" title="' + fileName +'">' +
              helpers.text.shortenFileName(fileName) + '</a>' +
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
        }).fail((zhr, status) => {
          this._errorAction(name, xhr, status);
          console.log(err.responseJSON.error)
        });

        return false;
      };

      this._initializeDropzone(name, dzOptions, (data, file) => {
        let iconPath = helpers.icons.resolveIconPath(data[0].mime, 'file');

        let fieldDataName = this._getDataFieldName(name);
        let url = app.getFilerUrl(data[0].urls[0]);

        let fileBlock = $('<div class="thumb-file-container">' +
          '<div class="delete-file-container" style="position: absolute;">' +
          '<a href="#" class="delete-file" data-fileid="' + data[0].id + '">' +
          '<i class="fa fa-times"></i>' +
          '</a>' +
          '</div>' +
          '<img class="img-file img-' + name + '" src="' + iconPath + '" />' +
          '<a class="link-file a-' + name + '" target="_blank" ' +
          'href="' + url + '" title="' + data[0].name +'">' +
          helpers.text.shortenFileName(data[0].name) + '</a>' +
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
        if (!imgData) {
          if (_.isFunction(this.onImageCrop))
            this.onImageCrop(name);

          return;
        }

        const fieldDataName = this._getDataFieldName(name);
        let model = this.model[fieldDataName];

        if (model[1])
          model[0] = imgData;
        else
          model.unshift(imgData);

        $('.img-' + name).attr('src', app.getFilerUrl(imgData.urls[0]));

        if (_.isFunction(this.onImageCrop))
          this.onImageCrop(name);

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
        let data = this.model[fieldDataName];

        this.model[name] = null;
        this.model[fieldDataName] = [{ id: null, urls: [] }];

        this._notifyServer(name).then((r) => {

          let deleteRequests = [api.makeRequest(filerServer + '/' + data[0].id, 'DELETE')];

          if(data[1])
            deleteRequests.push(api.makeRequest(filerServer + '/' + data[1].id, 'DELETE'));

          return $.when.apply($, deleteRequests);
        }).then((r) => {
          $link.closest('.one-photo').find('img.img-' + name).attr('src', noimageUrl || '/img/default/255x153.png');
          $link.closest('.delete-image-container').remove();
          if (typeof(this.onImageDelete) === 'function') {
            this.onImageDelete(name);
          }
        }).fail((xhr) => {
          this._errorAction(name, xhr);
        });

        return false;
      };

      const cropImage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let imgId = $(e.target).closest('a.crop-image').data('imageid');
        if (imgId)
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
        let croppedImage = data[0],
            originalImage = data[1] || data[0];

        let url = app.getFilerUrl(croppedImage.urls[0]);

        //update ui and bind events
        let imgActionsBlock = $(
          '<div class="delete-image-container">' +
          '<a class="crop-image" data-imageid="' + originalImage.id + '">' +
          '<i class="fa fa-crop"></i>' +
          '</a>' +
          '<a class="delete-image" data-imageid="' + originalImage.id + '">' +
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

        //here we are cropping origin image, so we have to use imgId
        this._cropImage(originalImage.id, name, onCrop);
      });

      $('.dropzone__' + name + ' a.delete-image').on('click', deleteImage);
      $('.dropzone__' + name + ' a.crop-image').on('click', cropImage);
    },

    _imagefolder(name) {
      //logic for showing cropper in sequentially for each image in gallery
      let cropQueue = [];
      let cropping = false;

      const enqueueImage = (imgId) => {
        cropQueue.push(imgId);
        cropNext();
      };

      const cropNext = (resetCropping) => {
        cropping = resetCropping ? false : cropping;

        if (cropping)
          return;

        if (!cropQueue.length)
          return;

        let imgId = cropQueue.shift();
        this._cropImage(imgId, name, onCrop);
        cropping = true;
      };

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
        if (!imageId)
          return;

        $link.prop('enabled', false);
        $link.off('click');

        let dataFieldName = this._getDataFieldName(name);
        let dataArr = this.model[dataFieldName];
        let dataIdx = _(dataArr).findIndex((elem) => { return elem.id == imageId });
        if (dataIdx >= 0) {
          dataArr.splice(dataIdx, 1);
        }

        this._notifyServer(name).then((r) => {
          return api.makeRequest(filerServer + '/' + imageId, 'DELETE');
        }).then((r) => {
          if (dataIdx >= 0) {
            $link.closest('.one-photo').remove();
          }
        }).fail((xhr) => {
          this._errorAction(name, xhr);
        });

        return false;
      };

      const onCrop = (imgData) => {
        //cropping canceled by user
        if (!imgData)
          return cropNext(true);

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

        $('a.crop-image[data-imageid=' + img.id + ']').closest('.one-photo').find('img').attr('src', app.getFilerUrl(imgData.urls[0]));

        this._notifyServer(name);

        cropNext(true);
      };

      const cropImage = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let imgId = $(e.target).closest('a.crop-image').data('imageid');
        if (imgId)
          this._cropImage(imgId, name, onCrop);

        return false;
      };

      this._initializeDropzone(name, dzOptions, (data, file) => {
        let croppedImage = data[0];
        let originalImage = data[1] || data[0];

        let imageBlock = $(
          '<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12 one-photo">' +
            '<div class="delete-image-container">' +
              '<a class="crop-image" href="#" data-imageid="' + originalImage.id + '">' +
                '<i class="fa fa-crop"></i>' +
              '</a>' +
              '<a class="delete-image" href="#" data-imageid="' + originalImage.id+ '">' +
                '<i class="fa fa-times"></i>' +
              '</a>' +
            '</div>' +
            '<img class="w-100 img-' + name + '" src="' + croppedImage.urls[0] + '">' +
          '</div>');

        imageBlock.find('a.delete-image').on('click', deleteImage);
        imageBlock.find('a.crop-image').on('click', cropImage);

        $('.dropzone__' + name + ' .all-gallery').append(imageBlock);

        enqueueImage(originalImage.id);
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
      const f = this.fields[name];
      const m = this.model;

      let dataFieldName = this._getDataFieldName(name);
      let imgModel = m[dataFieldName];

      let img = _.find(imgModel, (i) => {
        return i.id == imgId;
      });

      this.originImageId = imgId;

      let url = img.urls[0];
      let fileName = img.name;

      let options = f.crop ? _.pick(f.crop, 'control', 'cropper', 'auto') : {};

      helpers.crop.showCropper(url, options, this._cropInfo, (imgData) => {
        if (!imgData)
          return callback(imgData);

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

    _errorAction(name, xhr={}, error) {
      error = error || xhr.responseJSON || xhr.statusText || 'An error occurred';

      let errMsg = '';
      if (_.isString(error)) {
        errMsg = error
      } else {
        let arr = [];
        _.each(error, (value, key) => {
          arr.push(value);
        });
        errMsg = arr.join(', ');
      }

      //show general error
      let group = $('.dropzone__' + name);
      group.addClass('has-error');

      let errorBlock = group.find('.help-block');
      if (errorBlock.length)
        errorBlock.html(errMsg);
      else
        group.append(`<div class="help-block">${errMsg}</div>`);

    },

    _resetError(name) {
      let group = $('.dropzone__' + name);
      group.removeClass('has-error');
      group.find('.help-block').remove();
    },

  },

};
