'use strict';
let addSectionHelper = require('helpers/addSectionHelper.js');

import formatHelper from '../../helpers/formatHelper';
const appendHttpIfNecessary = formatHelper.appendHttpIfNecessary;

const dropzone = require('dropzone');
const dropzoneHelpers = require('helpers/dropzone.js');
const leavingConfirmationHelper = require('helpers/leavingConfirmationHelper.js');
const phoneHelper = require('helpers/phoneHelper.js');
const validation = require('components/validation/validation.js');
const menuHelper = require('helpers/menuHelper.js');

const jsonActions = {
  events: {
    'click .add-section': 'addSection',
    'click .delete-section': 'deleteSection',
  },

  addSection(e) {
    e.preventDefault();
    let sectionName = e.target.dataset.section;
    let template = require('templates/section.pug');
    this[sectionName + 'Index']++;
    $('.' + sectionName).append(
        template({
          fields: this.fields,
          name: sectionName,
          attr: {
            class1: '',
            class2: '',
            app: app,
            type: this.fields[sectionName].type,
            index: this[sectionName + 'Index'],
          },
          // values: this.model.toJSON(),
          values: this.model,
        })
    );
  },

  deleteSection(e) {
    e.preventDefault();
    if(confirm('Are you sure?')) {
      let sectionName = e.currentTarget.dataset.section;
      if($('.' + sectionName + ' .delete-section-container').length > 1) {
        $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index).remove();
        e.currentTarget.offsetParent.remove();
      } else {
        $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index + ' input').val('');
        $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index + ' textarea').val('');
      }
    }

    // ToDo
    // Fix index counter
    // this[sectionName + 'Index'] --;
  },
};

const submitCampaign = function submitCampaign(e) {
  e.preventDefault();
  let $form = this.$el.find('form');
  var data = $form.serializeJSON();

  _.extend(this.model, data);
  data = _.extend({}, this.model);

  // ToDo
  // Refactor code
  if(this.hasOwnProperty('index')) {
    data.index = this.index;
  };

  this.$('.help-block').remove();
  if (!validation.validate(this.fields, data, this)) {
    _(validation.errors).each((errors, key) => {
      validation.invalidMsg(this, key, errors);
    });
    this.$('.help-block').scrollTo(45);
    return;
  } else {
    // let url = this.urlRoot + '/' + data.id;
    let url = this.urlRoot.replace(/:id/, data.id);
    let type = 'PUT';
    delete data.id;

    api.makeRequest(url, type, data).
      then((data) => {

        if(this.hasOwnProperty('campaign')) {
          data.id = this.campaign.id;
        };

        // if we saved company information we will not have any progress data in
        // response
        if(data.hasOwnProperty('progress') == false) {
          data.progress = this.campaign.progress;
        }

        doCampaignValidation(e, data);
    });
  }
};

const doCampaignValidation = function doCampaignValidation(e, data) {

  if(data == null) {
    data = this.model;
  }

  if(
      data.progress.general_information == true &&
      data.progress.media == true &&
      data.progress.specifics == true &&
      data.progress['team-members'] == true
  ) {
    $('#company_publish_confirm').modal('show');
  } else {
    var errors = {};
    _(data.progress).each((d, k) => {
      if(k != 'perks') {
        if(d == false)  {
          $('#company_publish .'+k).removeClass('collapse');
        } else {
          $('#company_publish .'+k).addClass('collapse');
        }
      }
    });
    $('#company_publish').modal('toggle');
  }
};

const onPreviewAction = function(e) {
  e.preventDefault();
  let pathname = location.pathname;
  this.$el.find('form').submit()
  app.showLoading();
  let that = this;
  setTimeout(function() {
    // window.location = e.target.dataset.href + '?preview=1'
    window.location = '/api/campaign/' + (that.campaign ? that.campaign.id : that.model.id) + '?preview=1&previous=' + pathname;
  }, 100);
};


module.exports = {
  company: Backbone.View.extend(_.extend({
    // urlRoot: serverUrl + Urls['company-list'](),
    urlRoot: Urls.company_list(),
    template: require('./templates/company.pug'),
    events: _.extend({
      'submit form': 'submit',
      'keyup #zip_code': 'changeZipCode',
      'click .update-location': 'updateLocation',
      'click .onPreview': onPreviewAction,
      'click .submit_form': submitCampaign,
      'change #website,#twitter,#facebook,#instagram,#linkedin': 'appendHttpsIfNecessary',
    }, leavingConfirmationHelper.events, phoneHelper.events, menuHelper.events),

    appendHttpsIfNecessary(e) {
      appendHttpIfNecessary(e, true);
    },

    initialize(options) {
      this.fields = options.fields;
      this.campaign = options.campaign;
      this.$el.on('keypress', ':input:not(textarea)', function (event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          return false;
        }
      });
      this.labels = {
        name: 'Legal Name of Company',
        industry: 'Industry',
        founding_state: 'Jurisdiction of Incorporation / Organization',
        tagline: 'Tagline',
        description: 'About Us',
        corporate_structure: 'Corporate Structure',
        founding_date: 'Founding date',
        address_1: 'Street Address',
        address_2: 'Optional Address',
        zip_code: 'Zip code',
        phone: 'Phone',
        website: 'Website',
        twitter: 'Twitter',
        facebook: 'Facebook',
        instagram: 'Instagram',
        linkedin: 'Linkedin',
      };
      this.assignLabels();
    },

    submit(e) {
      var data = $(e.target).serializeJSON();

      data['founding_date'] = data.founding_date__year && data.founding_date__month && data.founding_date__day
        ? data.founding_date__year + '-' + data.founding_date__month + '-' + data.founding_date__day
        : '';
      delete data.founding_date__day;
      delete data.founding_date__month;
      delete data.founding_date__year;
      api.submitAction.call(this, e, data);
    },

    updateLocation(e) {
      this.$('.js-city-state').text(this.$('.js-city').val() + ', ' + this.$('.js-state').val());
      $('form input[name=city]').val(this.$('.js-city').val());
      $('form input[name=state]').val(this.$('.js-state').val());
    },

    changeZipCode(e) {
      // if not 5 digit, return
      if (e.target.value.length < 5) return;
      if (!e.target.value.match(/\d{5}/)) return;
      this.getCityStateByZipCode(e.target.value, ({ success=false, city='', state='' }) => {
        // this.zipCodeField.closest('div').find('.help-block').remove();
        if (success) {
          this.$('.js-city-state').text(`${city}, ${state}`);
          // this.$('#city').val(city);
          this.$('.js-city').val(city);
          $('form input[name=city]').val(city);
          // this.$('#state').val(city);
          this.$('.js-state').val(state);
          $('form input[name=state]').val(state);

        } else {
          console.log('error');
        }
      });
    },

    render() {
      this.getCityStateByZipCode = require('helpers/getSityStateByZipCode');
      this.usaStates = require('helpers/usa-states');
      this.$el.html(
        this.template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          user: app.user.toJSON(),
          campaign: this.campaign,
          states: this.usaStates,
        })
      );
      return this;
    },

    _success(data) {
      if (this.campaign.hasOwnProperty('id') == false) {
        // IF we dont have campaign data
        // Server should create it
        this.campaign = data.campaign;
      }

      app.routers.navigate(
        '/campaign/general_information/' + this.campaign.id,
        { trigger: true, replace: false }
      );
    },
  }, leavingConfirmationHelper.methods, phoneHelper.methods, menuHelper.methods)),

  generalInformation: Backbone.View.extend(_.extend({
      urlRoot: raiseCapitalUrl + '/campaign/:id/general_information',
      template: require('./templates/generalInformation.pug'),
      events: _.extend({
          'submit form': api.submitAction,
          'click .onPreview': onPreviewAction,
          'click .submit_form': submitCampaign,
        }, addSectionHelper.events, leavingConfirmationHelper.events, menuHelper.events),

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          console.log('#content ' + k.split(' ')[1]);
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      getSuccessUrl(data) {
        return '/campaign/media/' + data.id;
      },

      initialize(options) {
        this.fields = options.fields;
        this.faqIndex = 1;
        this.additional_infoIndex = 1;
        this.$el.on('keypress', ':input:not(textarea)', function (event) {
          if (event.keyCode == 13) {
            event.preventDefault();
            return false;
          }
        });
        this.labels = {
          pitch: 'Why Should People Invest?',
          business_model: 'Why We Are Raising Capital?',
          intended_use_of_proceeds: 'How We Intend To Make Money?',
          faq: {
            question: 'Question',
            answer: 'Answer',
          },
          additional_info: {
            title: 'Title',
            body: 'Description',
          },
        };
        this.fields.pitch.help_text = 'What is your edge? Do you have a competitive advantage? Why should investors want to invest in your company?';
        this.fields.intended_use_of_proceeds.help_text = 'How do you make money?';
        this.fields.business_model.help_text = 'Why are you raising capital, and what do you intend to do with it?';
        this.fields.additional_info.help_text = 'Is there anything else you want to tell your potential investors? Received any accolades? Patents? Major contracts? Distributors, etc?';
        this.fields.faq.help_text = 'We need help text here too';
        this.assignLabels();
        this.createIndexes();
        this.buildJsonTemplates('raiseFunds');
      },

      render() {
        this.$el.html(
            this.template({
              serverUrl: serverUrl,
              Urls: Urls,
              fields: this.fields,
              // values: this.model.toJSON(),
              values: this.model,
              templates: this.jsonTemplates,
            })
        );

        if(app.getParams().check == '1') {
          var data = this.$el.find('form').serializeJSON();
          if (!validation.validate(this.fields, data, this)) {
            _(validation.errors).each((errors, key) => {
              validation.invalidMsg(this, key, errors);
            });
            this.$('.help-block').prev().scrollTo(5);
          }
        }
        return this;
      },
    }, leavingConfirmationHelper.methods, menuHelper.methods, addSectionHelper.methods)),

  media: Backbone.View.extend(_.extend({
      events: _.extend({
        'submit form': api.submitAction,
        // 'click .delete-image': 'deleteImage',
        'change #video,.additional_video_link': 'updateVideo',
        dragover: 'globalDragover',
        dragleave: 'globalDragleave',
        // 'change #video,.additional_video_link': 'appendHttpsIfNecessary',
        'change .press_link': 'appendHttpIfNecessary',
        'click .submit_form': submitCampaign,
        'click .onPreview': onPreviewAction,
      }, jsonActions.events, leavingConfirmationHelper.events, menuHelper.events, addSectionHelper.events),
      urlRoot: Urls['campaign-list']() + '/media',

      appendHttpsIfNecessary(e) {
        appendHttpIfNecessary(e, true);
      },

      appendHttpIfNecessary: appendHttpIfNecessary,

      globalDragover() {
        this.$('.border-dropzone').addClass('active-border');
      },

      globalDragleave() {
        this.$('.border-dropzone').removeClass('active-border');
      },

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      // addSection: jsonActions.addSection,
      // deleteSection: jsonActions.deleteSection,
      getSuccessUrl(data) {
        return '/campaign/team-members/' + data.id;
      },

      initialize(options) {
        this.fields = options.fields;
        this.pressIndex = 1;
        this.additional_videoIndex = 1;
        this.$el.on('keypress', ':input:not(textarea)', function (event) {
          if (event.keyCode == 13) {
            event.preventDefault();
            return false;
          }
        });
        this.labels = {
          gallery_data: {
            url: 'Gallery',
          },
          press: {
            headline: 'Headline',
            link: 'Article Link',
          },
          additional_video: {
            link: 'Youtube or Vimeo Link',
            headline: 'Title',
          },
          list_image_data: {
            urls: 'Thumbnail Picture',
          },
          header_image_data: {
            urls: 'Header Image',
          },
          video: 'Main Video for Campaign'
        };
        this.assignLabels();
        this.createIndexes();
        this.buildJsonTemplates('raiseFunds');
      },

      render() {
        let template = require('./templates/media.pug');
        this.fields.press.type = 'json';
        this.fields.press.schema = {
          headline: {
            type: 'string',
            label: 'Headline',
            placeholder: 'Title',
            maxLength: 90,
          },
          link: {
            type: 'url',
            label: 'Article link',
            placeholder: 'http://www.',
          },
        };
        this.fields.additional_video.type = 'jsonVideo';
        this.fields.additional_video.schema = {
          headline: {
            type: 'string',
            label: 'Title',
            placeholder: 'Title',
          },
          link: {
            type: 'url',
            label: 'Youtube or vimeo link',
            placeholder: 'https://',
          },
        };

        if (this.model.additional_video) {
          this.additional_videoIndex = Object.keys(this.model.additional_video).length;
        } else {
          this.additional_videoIndex = 0;
        }

        this.$el.html(
            template({
              serverUrl: serverUrl,
              Urls: Urls,
              fields: this.fields,
              // values: this.model.toJSON(),
              values: this.model,
              dropzoneHelpers: dropzoneHelpers.methods,
              templates: this.jsonTemplates,
            })
        );

        const Model = require('components/campaign/models.js');

        this.createImageDropzone(
          // dropzone,
          'header_image',
          'campaign_headers', '',
          (data) => {
            // this.model.save({
            // (new Model.model(this.model)).save({
            //   header_image: data.file_id,
            // }, {
            //   patch: true,
            // app.makeRequest(this.urlRoot, {header_image: data.file_id, type: 'PATCH'})
            app.makeRequest(this.urlRoot +'/' + this.model.id, {header_image: data.file_id, type: 'PATCH'})
            // }).then((model) => {
            .then((model) => {
              console.log('image upload done', model);
            });
          }
        );
        this.createImageDropzone(
          // dropzone,
          'list_image',
          'campaign_lists', '',
          (data) => {
            app.makeRequest(this.urlRoot +'/' + this.model.id, {list_image: data.file_id, type: 'PATCH'})
          }
        );
        this.createImageDropzone(
          // dropzone,
          'gallery',
          'galleries/' + this.model.id, '',
          (data) => {
            let $el = $('<div class="thumb-image-container" style="float: left; overflow: hidden; position: relative;">' +
              '<div class="delete-image-container" style="position: absolute;">' +
              '<a class="delete-image" href="#" data-id="' + data.image_id + '">' +
              '<i class="fa fa-times"></i>' +
              '</a>' +
              '</div>' +
              '<img class="img-fluid pull-left" src="' + data.origin_url + '">' +
              '</div>'
              );
            $('.photo-scroll').append($el);
            $el.find('.delete-image').click(this.deleteImage.bind(this));
            $('#gallery').val(data.folder_id);
            app.makeRequest(this.urlRoot +'/' + this.model.id, {gallery: data.folder_id, type: 'PATCH'})
          },
          );
        $('.delete-image').click(this.deleteImage.bind(this));

        if(app.getParams().check == '1') {
          var data = this.$el.find('form').serializeJSON();
          if (!validation.validate(this.fields, data, this)) {
            _(validation.errors).each((errors, key) => {
              validation.invalidMsg(this, key, errors);
            });
            this.$('.help-block').prev().scrollTo(5);
          }
        }

        return this;
      },

      getVideoId(url) {
        try {
          var provider = url.match(/https:\/\/(:?www.)?(\w*)/)[2];
          provider = provider.toLowerCase();
          var id;

          if (provider == 'youtube') {
            // id = url.match(/https:\/\/(?:www.)?(\w*).com\/.*v=(\w*)/)[2];
            id = url.match(/https:\/\/(?:www.)?(\w*).com\/.*v=([A-Za-z0-9_-]*)/)[2];
          } else if (provider == 'vimeo') {
            id = url.match(/https:\/\/(?:www.)?(\w*).com\/(\d*)/)[2];
          } else {
            return '';
          }
        } catch (err) {
          return '';
        }

        return {id: id, provider: provider};
      },

      deleteImage(e) {
        e.preventDefault();
        e.stopPropagation();
        const imageId = e.currentTarget.dataset.id;

        $(e.currentTarget).parent().parent().remove();
        var params = _.extend({
                url: serverUrl + Urls['image2-list']() + '/' + imageId,
              }, app.defaultOptionsRequest);
        params.type = 'DELETE';

        $.ajax(params);

        return false;
      },

      updateVideo(e) {
        appendHttpIfNecessary(e, true);
        // var $form = $(e.target).parents('.row');
        let $videoContainer;
        if (e.target.id == 'video') $videoContainer = this.$('.main-video-block');
        else $videoContainer = this.$('.additional-video-block .index_' + $(e.target).data('index'));
        // var $form = $('.index_' + $(e.target).data('index'));
        var video = e.target.value;
        var res = this.getVideoId(video);

        // ToDo
        // FixME
        // Bad CHECK
        //
        if(res.id && res.provider) {
          if (res.provider == 'youtube')
            $videoContainer.find('iframe').attr(
              'src', '//youtube.com/embed/' +  res.id + '?rel=0'
            );
          else
            $videoContainer.find('iframe').attr(
              'src', '//player.vimeo.com/video/' +  res.id
            );
          //e.target.value = id;
        }
      }
  }, leavingConfirmationHelper.methods, menuHelper.methods, dropzoneHelpers.methods, addSectionHelper.methods)),

  teamMemberAdd: Backbone.View.extend(_.extend({
      events: _.extend({
        'submit form': 'submit',
        'click .delete-member': 'deleteMember',
        dragover: 'globalDragover',
        dragleave: 'globalDragleave',
        'click .submit_form': doCampaignValidation,
        'change #linkedin,#facebook': 'appendHttpsIfNecessary',
        'click .cancel': 'cancel',
        'click .onPreview': onPreviewAction,
      }, leavingConfirmationHelper.events, menuHelper.events),
      // urlRoot: serverUrl + Urls['campaign-list']() + '/team_members',
      urlRoot: Urls['campaign-list']() + '/team_members',

      cancel(e) {
        e.preventDefault();
        e.stopPropagation();
        this.undelegateEvents();
        if (confirm("Do you really want to leave?")) {
          app.routers.navigate(
            '/campaign/team-members/' + this.model.id,
            { trigger: true, replace: false }
          );
        }
      },

      appendHttpsIfNecessary(e) {
        appendHttpIfNecessary(e, true);
      },

      globalDragover() {
        this.$('.border-dropzone').addClass('active-border');
      },

      globalDragleave() {
        this.$('.border-dropzone').removeClass('active-border');
      },

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      initialize(options) {
        this.fields = options.fields;
        this.type = options.type;
        this.index = options.index;
        this.$el.on('keypress', ':input:not(textarea)', function (event) {
          if (event.keyCode == 13) {
            event.preventDefault();
            return false;
          }
        });
      },

      render() {
        let template = require('./templates/teamMemberAdd.pug');
        this.fields = {
          first_name: {
            type: 'string',
            label: 'First Name',
            placeholder: 'John',
            required: true,
          },
          last_name: {
            type: 'string',
            label: 'Last Name',
            placeholder: 'Jordon',
            required: true,
          },
          title: {
            type: 'string',
            label: 'Title',
            placeholder: 'CEO',
            required: true,
          },
          email: {
            type: 'email',
            label: 'Email',
            placeholder: 'imboss@comanpy.com',
            required: true,
          },
          bio: {
            type: 'text',
            label: 'Bio',
            placeholder: 'At least 150 characters and no more that 250 charactes',
            required: true,
          },
          growup: {
            type: 'string',
            label: 'Where did you grow up',
            placeholder: 'City',
            required: false,
          },
          state: {
            type: 'choice',
            label: '',
          },
          college: {
            type: 'string',
            label: 'Where did you attend college',
            placeholder: 'Collage/University',
          },
          linkedin: {
            type: 'url',
            label: 'LinkedIn',
            placeholder: 'https://linkedin.com/',
          },
          facebook: {
            type: 'url',
            label: 'Facebook',
            placeholder: 'https://facebook.com/',
          },
          photo: {
            type: 'dropbox',
            label: 'Profile Picture',
          },
        };

        if (this.index != 'new') {
          // this.values = this.model.toJSON().members[this.index];
          this.values = this.model.members[this.index];
        } else {
          
          this.values = {
            // id: this.model.get('id'),
            id: this.model.id,
          };
        }

        this.values.progress = this.model.progress;

        this.usaStates = require('helpers/usa-states');
        this.$el.html(
          template({
            serverUrl: serverUrl,
            Urls: Urls,
            fields: this.fields,
            campaign: this.model,
            member: this.values,
            values: this.model,
            type: this.type,
            index: this.index,
            states: this.usaStates,
          })
        );

        // dropzoneHelpers.createFileDropzone(
        dropzoneHelpers.createImageDropzone(
          dropzone,
          'photo',
          'members', '',
          (data) => {
            this.$el.find('#photo').val(data.url);
            this.$el.find('.img-photo').data('src', data.url);
          }
        );
        return this;
      },

      getSuccessUrl(data) {
        return '/campaign/team-members/' + data.id;
      },

      submit(e) {
        e.preventDefault();
        let json = $(e.target).serializeJSON();
        json.index = this.index;

        api.submitAction.call(this, e, json);
      },
  }, leavingConfirmationHelper.methods, menuHelper.methods)),

  teamMembers: Backbone.View.extend(_.extend({
    events: _.extend({
      'click .delete-member': 'deleteMember',
      'click .submit_form': doCampaignValidation,
      'click .onPreview': onPreviewAction,
      'submit form': 'submit',
    }, menuHelper.events),

    // this is for no navigating to new page in the onPreviewAction method
    submit(e) {
      e.preventDefault();
    },

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    render() {
      let template = require('./templates/teamMembers.pug');
      // let values = this.model.toJSON();
      let values = this.model;

      if (!Array.isArray(values.members)) {
        values.members = [];
      }

      this.$el.html(
        template({
            serverUrl: serverUrl,
            campaign: values,
            Urls: Urls,
            values: values,
          })
        );

      return this;
    },

    deleteMember: function (e) {
        let memberId = e.currentTarget.dataset.id;

        if (confirm('Are you sure you would like to delete this team member?')) {
          // app.makeRequest('/api/campaign/team_members/' + this.model.get('id') + '?index=' + memberId, 'DELETE').
          app.makeRequest('/api/campaign/team_members/' + this.model.id + '?index=' + memberId, 'DELETE').
              then((data) => {
                  this.model.members.splice(memberId, 1);
                  $(e.currentTarget).parent().remove();
                  if (this.model.members.length < 1) {
                    this.$el.find('.notification').show();
                    this.$el.find('.buttons-row').hide();
                  } else {
                    this.$el.find('.notification').hide();
                    this.$el.find('.buttons-row').show();
                  }
                });
        }
      },

  }, menuHelper.methods)),

  specifics: Backbone.View.extend(_.extend({
      urlRoot: Urls['campaign-list']() + '/specifics',
      events: _.extend({
        'submit form': api.submitAction,
        'change input[name="security_type"]': 'updateSecurityType',
        'focus #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation,#price_per_share': 'clearZeroAmount',
        'change #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation': 'formatNumber',
        'change #minimum_raise,#maximum_raise,#price_per_share,#premoney_valuation': 'calculateNumberOfShares',
        dragover: 'globalDragover',
        dragleave: 'globalDragleave',
        'click .onPreview': onPreviewAction,
        'click .submit_form': submitCampaign,
        'click .submit-specifics': 'checkMinMaxRaise',
      }, leavingConfirmationHelper.events, menuHelper.events, dropzoneHelpers.events),

      checkMinMaxRaise(e) {
        let min = this.$('input[name=minimum_raise]').val();
        let max = this.$('input[name=maximum_raise]').val();
        min = parseInt(min.replace(/,/g, ''));
        max = parseInt(max.replace(/,/g, ''));
        if ((min && max) && !(min < max)) {
          alert("Maximum Raise must be larger than Minimum Raise!");
          e.preventDefault();
        }
      },

      globalDragover() {
        // this.$('.dropzone').css({ border: 'dashed 1px lightgray' });
        this.$('.border-dropzone').addClass('active-border');
      },

      globalDragleave() {
        // this.$('.dropzone').css({ border: 'none' });
        this.$('.border-dropzone').removeClass('active-border');
      },

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          console.log('#content ' + k.split(' ')[1]);
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      formatNumber: function (e) {
        var valStr = $(e.target).val().replace(/,/g, '');
        var val = parseInt(valStr);
        if (val) {
          $(e.target).val(val.toLocaleString('en-US'));
        }
      },

      clearZeroAmount: function (e) {
        let val = parseInt(e.target.value);
        if(val == 0 || val == NaN) {
          e.target.value = '';
        }
      },

      calculateNumberOfShares: function (e) {
        var minRaise = parseInt(this.$('#minimum_raise').val().replace(/,/g, ''));
        var maxRaise = parseInt(this.$('#maximum_raise').val().replace(/,/g, ''));
        var pricePerShare = parseInt(this.$('#price_per_share').val().replace(/,/g, ''));
        var premoneyVal = parseInt(this.$('#premoney_valuation').val().replace(/,/g, ''));
        this.$('#min_number_of_shares').val((Math.round(minRaise / pricePerShare)).toLocaleString('en-US'));
        this.$('#max_number_of_shares').val((Math.round(maxRaise / pricePerShare)).toLocaleString('en-US'));
        this.$('#min_equity_offered').val(Math.round(100 * minRaise / (minRaise + premoneyVal)) + '%');
        this.$('#max_equity_offered').val(Math.round(100 * maxRaise / (maxRaise + premoneyVal)) + '%');
      },

      addSection: jsonActions.addSection,
      deleteSection: jsonActions.deleteSection,
      getSuccessUrl(data) {
        return '/campaign/perks/' + data.id;
      },

      initialize(options) {
        this.fields = options.fields;
        this.labels = {
          investor_presentation_data: '',
          minimum_raise: 'Our Minimum Total Raise is',
          maximum_raise: 'Our Maximum Total Raise is',
          minimum_increment: 'The Minimum investment is',
          length_days: 'Length of the Campaign',
          investor_presentation: 'Upload an Investor Presentation',
        };
        this.assignLabels();
        this.createIndexes();
        this.buildJsonTemplates('raiseFunds');

        this.$el.on('keypress', ':input:not(textarea)', function (event) {
          if (event.keyCode == 13) {
            event.preventDefault();
            return false;
          }
        });
      },

      updateSecurityType(e) {
        let val = e.currentTarget.value;
        $('.security_type_list').hide();
        $('.security_type_'  + val).show();
      },

      render() {
        const template = require('./templates/specifics.pug');
        this.$el.html(
            template({
                serverUrl: serverUrl,
                Urls: Urls,
                fields: this.fields,
                // values: this.model.toJSON(),
                values: this.model,
                dropzoneHelpers: dropzoneHelpers.methods,
              })
        );

        const Model = require('components/campaign/models.js');
        dropzoneHelpers.methods.createFileDropzone(
            'investor_presentation',
            'investor_presentation', '',
            (data) => {
                this.model.urlRoot = this.urlRoot;
                // this.model.save({
                  // (new Model.model(this.model)).save({
                  //   investor_presentation: data.file_id,
                  // }, {
                  //   patch: true,
                  app.makeRequest(this.urlRoot +'/' + this.model.id, {investor_presentation: data.file_id, type: 'PATCH'})
                  // }).then((data) => {
                  .then((data) => {
                    const extension = data.investor_presentation_data.name.split('.').pop();
                    const suffix = extension == 'pdf' ? '_pdf' : (['ppt', 'pptx'].indexOf(extension) != -1 ? '_pptx' : '_file');
                    $('.img-investor_presentation').attr('src', '/img/default' + suffix + '.png');
                    // $('.img-investor_presentation').after('<a class="link-3" href="' + data.url + '">' + data.name + '</a>');
                    // $('.a-investor_presentation').attr('href', data.url).text(data.name);
                  });
              }
        );

        $('.a-investor_presentation').click(function (e) {
          e.stopPropagation();
        });

        this.calculateNumberOfShares(null);

        if(app.getParams().check == '1') {
          var data = this.$el.find('form').serializeJSON();
          if (!validation.validate(this.fields, data, this)) {
            _(validation.errors).each((errors, key) => {
              validation.invalidMsg(this, key, errors);
            });
            this.$('.help-block').prev().scrollTo(5);
          }
        }

        if (this.model.company.corporate_structure == 2) {
          this.$('input[type=radio][name=security_type][value=0]').prop('disabled', true);
          this.$('input[type=radio][name=security_type][value=1]').attr('checked', true);
          $('.security_type_list').hide();
          $('.security_type_1').show();
        }        

        return this;
      },
    }, leavingConfirmationHelper.methods, menuHelper.methods, dropzoneHelpers.methods, addSectionHelper.methods)),

  perks: Backbone.View.extend(_.extend({
      events: _.extend({
          'submit form': 'onSubmit',
          'click .onPreview': onPreviewAction,
          'click .submit_form': submitCampaign,
        }, jsonActions.events, leavingConfirmationHelper.events, menuHelper.events, addSectionHelper.events),
      // urlRoot: serverUrl + Urls['campaign-list']() + '/perks',
      urlRoot: Urls['campaign-list']() + '/perks',

      onSubmit(e) {
        e.preventDefault();

        let data = $(e.target).serializeJSON({ useIntKeysAsArrayIndex: true });
        let url = this.urlRoot;
        
        if(this.hasOwnProperty('model')) {
          _.extend(this.model, data);
          data = _.extend({}, this.model)
        }
        let type = 'POST';
        if(data.hasOwnProperty('id')) {
          url += '/' + data.id;
          delete data.id;
          type = e.target.dataset.method;
        }

        app.showLoading();
        api.makeRequest(url, type, data).then((data) => {
          this.model = data;
          app.hideLoading();
          $('button.submit_form').click();
        }).
        fail((xhr, status, text) => {
          api.errorAction(this, xhr, status, text, this.fields);
          app.hideLoading();
        });
      },

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      addSection: jsonActions.addSection,
      deleteSection: jsonActions.deleteSection,

      initialize(options) {
        this.fields = options.fields;
        // this.perksIndex = 1;
        this.labels = {
          perks: {
            amount: 'If an Investor Invests Over',
            perk: 'Describe the Perk',
          },
        };
        this.assignLabels();
        this.createIndexes();
        this.buildJsonTemplates('raiseFunds');
        this.$el.on('keypress', ':input:not(textarea)', function (event) {
          if (event.keyCode == 13) {
            event.preventDefault();
            return false;
          }
        });
      },

      render() {
        let template = require('./templates/perks.pug');
        this.fields.perks.type = 'json';
        this.fields.perks.schema = {
            amount: {
                type: 'number',
                label: 'If an Investor Invests Over',
                placeholder: '$',
                values: [],
                inputType: 'number'
              },
            perk: {
                type: 'string',
                label: 'Describe the Perk',
                placholder: 'Description',
                values: [],
              },
          };
        this.$el.html(
            template({
                serverUrl: serverUrl,
                Urls: Urls,
                fields: this.fields,
                // values: this.model.toJSON(),
                values: this.model,
                templates: this.jsonTemplates,
              })
        );
        return this;
      },

    }, leavingConfirmationHelper.methods, menuHelper.methods, addSectionHelper.methods)),

  thankYou: Backbone.View.extend({
    el: '#content',
    template: require('./templates/thankyou.pug'),

    render() {
      this.$el.html(
        this.template({
          values: this.model,
        })
      );
      return this;
    },
  }),
};
