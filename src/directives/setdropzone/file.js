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
      container.innerHTML = this.resultHTML;
    }

    setTimeout(() => {
      // Fix
      // this.element = $(this.resultHTML)[0];
      this.element = document.querySelector(this.elementSelector);
      if(this.element) {
        this.attacheEvents();
      } else {
        console.debug('cannot find element ', this.elementSelector, this);
      }
    }, 600);

    return this;
  }

  attacheEvents() {
    this.element.querySelectorAll('.deleteFile').forEach((item) => {
      item.addEventListener("click", (event) => {
        api.makeRequest(
            app.config.filerServer + '/' + this.file.id,
            'DELETE'
        ).done(() => {
          let data = {};
          data[this.fieldName] = null;
          api.makeRequest(
              this.file.urlRoot,
              'PATCH',
              data
          ).done(() => {
            this.file.updateData({});
            this.render();
          })
        });
      });
    });
    
    // ToDo
    // This should be in the image model
    this.element.querySelectorAll('.cropImage').forEach((item) => {
      console.log('cropper');
    });
  }

  getTemplate() {
    return require('./templates/file.pug');
  }

  update(data) {
    this.file.updateData(data);
    return this.save();
  }

  save() {
    return this.file.save(
      this.fieldName,
      this.fieldDataName
    );
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
      $(this.element).find('.uploading').hide().addClass('collapse').css('z-index', '');
      app.validation.invalidMsg(
        this.view,
        this.fileElement.fieldName,
        Object.values(error)[0]
      ); 
    });
  }

  success(file, data) {

    if(data[0]) {
      data = data[0];
    }
    const urls = data.urls;

    data.urls = {};
    data.urls.origin = urls[0];

    this.fileElement.update(data).done(() => {
      this.fileElement.render(this.element.querySelector('.fileContainer'));
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

};


function getInstance(...options) {
    return new FileDropzone(...options);
}

module.exports = {
  getInstance: getInstance,
  FileElement: FileElement,
  FileDropzone: FileDropzone
};
