const File = require('models/file.js');
const Dropzone = require('dropzone');


class FileElement {
  constructor(file, fieldName, fieldDataName, options={}) {
    this.file = file
    this.fieldName = fieldName;
    this.fieldDataName = fieldDataName;
    this.resultHTML = '';
    this.element = null;
    this.options = options;
    this.elementSelector = '.' + this.fieldName + ' .fileContainer';
    return this;
  }

  render(container=null) {

    // ToDo
    // Check if we already render html
    // just update link and image
    // this.element.querySelector(this.elContainer).src = this.file.getIconUrl();
    //

    /*
    if(this.element !== null) {
      this.element.remove();
    }
    */

    this.template = this.getTemplate(); 
    this.resultHTML = this.template({
      file: this
    });

    if(container !== null) {
      if(container == 'REPLACE' && this.element) {
        this.element.parentNode.replaceChild(
          document.createRange().createContextualFragment(this.resultHTML),
          this.element
        );
      } else if(container != 'REPLACE') {
        container.innerHTML = this.resultHTML;
      }
    }

    this.element = document.createRange().createContextualFragment(this.resultHTML);
    setTimeout(() => {
      // Fix
      // this.element = $(this.resultHTML)[0];
      this.element = document.querySelector(this.elementSelector);
      if(this.element) {
        this.attacheEvents();
      } else {
        console.debug('cannot find element ', this.elementSelector, this);
      }
    }, 300);

    return this;
  }

  attacheEvents() {
    this.element.querySelectorAll('.deleteFile').forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.delete();
      });
    });
    this.element.querySelectorAll('.link-file').forEach((item) => {
      item.addEventListener("click", (event) => {
        // event.preventDefault();
        event.stopPropagation();
        // return false;
      });
    });
  }

  getTemplate() {
    return require('./templates/file.pug');
  }

  delete(callback) {
    this.file.delete().done(() => {
      if(callback) {
        callback(this.file);
      } else {
        this.update({id: null, urls: {}});
      }
    });
  }

  update(data, callback) {
    this.file.updateData(data);
    return this.save().done(() => {
      if(callback) {
        callback(this)
      } else {
        // REPLACE
        this.render('REPLACE');
      }
    }).fail((xhr) => {
      $(this.element).find('.uploading').hide().addClass('collapse').css('z-index', '');
      // ToDo
      // fix if <field>_data urls error
      app.validation.invalidMsg(
        this.view,
        this.fileElement.fieldName,
        Object.values(xhr.responseJSON)
      ); 
    });
  }

  save() {
    return this.file.save(
      this.fieldName,
      this.fieldDataName
    ).then((response) => {
      if(this.options.onSaved) {
        this.options.onSaved(this);
      }
    });
  }

  fixUrl(url) {
    // Temp function for filer to strip domain from url
    return '/' + url.split('/').slice(3).join('/');
  }
}

class FileDropzone {

  constructor(view, fieldName, fieldDataName, fileOptions) {
    this.fileOptions = fileOptions;
    this.view = view;
    this.model = view.model;

    this.fileElement = new FileElement(
      this.model[fieldName],
      fieldName,
      fieldDataName
    );

    if(fileOptions.onSaved) {
      this.fileElement.options.onSaved = fileOptions.onSaved;
    }

    this.options = {
      url: app.config.filerServer + '/upload',
      clickable: '.dropzone__' + fieldName + ' .border-dropzone',
      createImageThumbnails: false,
      addRemoveLinks: false,
      params: {},

      previewTemplate: `<div class="dz-details"></div>
        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>`,
      headers: {
        Authorization:  'Bearer ' + localStorage.getItem('token'),
        'Cache-Control': null,
        'X-Requested-With': null,
      },

      uploadprogress: function (file, progress, bytesSend) {
        let errorMessages = this.element.querySelector('.help-block');

        if(errorMessages) {
          errorMessages.remove();
          $('.imageErrorMsg').remove();
          $('.has-error')[0].classList.remove('has-error')
        }

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

      /*
      paramName: 'file',
      params: {
        file_name: name,
      },                                                                      
      */
      acceptedFiles: 'application/pdf,.pptx,.ppt,.doc,.docx'
    };

    this.resultHtml = '';
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
    this.template = this.getTemplate();
    this.resultHTML = this.template({
      fileElement: this.fileElement,
      options: this.fileOptions,
      self: this
    });

    setTimeout(() => {
      // Don't know who recreate that html ... uhhh
      // this.element = $(this.resultHTML)[0];
      this.element = document.querySelector('.' + this.fileElement.fieldName);
      this.createDropzone();
      this.attacheEvents();
    }, 1200);

    return this;
  }

  getTemplate() {
    return require('./templates/fileDropzone.pug');
  }

  createDropzone() {
    const dropbox = new Dropzone(this.element, this.options);

    this.element.classList.add('dropzone');

    dropbox.on('addedfile', (file) => {
      (this.files || []).forEach((f) => {
        if (f.lastModified != file.lastModified) {
          this.removeFile(f);
        }
      });
    });

    dropbox.on('success', (file, data) => {
      this.success(file, data);
    });

    dropbox.on('error', (file, error, xhr) => {
      $(this.element).find('.uploading').hide().addClass('collapse').css('z-index', '');

      app.validation.invalidMsg(
        this.view,
        this.fileElement.fieldName,
        error
      ); 

      if (this.element.classList.contains('galleryDropzone') === true) {
        let errorMsg = document.createRange().createContextualFragment(
          require('./templates/snippets/image_errormsg.pug')()
        );
        this.element.querySelector('.dropzone__gallery_group_id').append(errorMsg);
      }
    });
    this.dropzone = dropbox;
  }

  success(file, data) {

    const reorgData = data[0];
    reorgData.site_id = app.sites.getId();
    reorgData.urls = {};
    reorgData.urls.origin = reorgData.url_filename;
    delete reorgData.url_filename;

    reorgData.site_id = app.sites.getId();

    this.model.data[this.fileElement.fieldName].id = reorgData.id;
    this.model.data[this.fileElement.fieldDataName] = reorgData;

    this.fileElement.update(reorgData);
  }

};


function getInstance(...options) {
    return new FileDropzone(...options);
}

module.exports = {
  getInstance,
  FileElement,
  FileDropzone,
};
