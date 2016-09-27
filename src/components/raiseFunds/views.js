'use strict';
let menuHelper = require('helpers/menuHelper.js');

import formatHelper from '../../helpers/formatHelper';
const appendHttpIfNecessary = formatHelper.appendHttpIfNecessary;

const dropzone = require('dropzone');
const dropzoneHelpers = require('helpers/dropzone.js');

const validation = require('components/validation/validation.js');

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
          values: this.model.toJSON(),
        })
    );
  },

  deleteSection(e) {
    e.preventDefault();
    let sectionName = e.currentTarget.dataset.section;
    $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index).remove();
    e.currentTarget.remove();

    // ToDo
    // Fix index counter
    // this[sectionName + 'Index'] --;
  },
};


const onPreviewAction = function(e) {
  e.preventDefault();
  this.$el.find('form').submit()
  app.showLoading();
  setTimeout(function() {
    window.location = e.target.dataset.href + '?preview=1'
  }, 100);
};

module.exports = {
  company: Backbone.View.extend(_.extend(menuHelper.methods, {
    urlRoot: serverUrl + Urls['company-list'](),
    template: require('./templates/company.pug'),
    events: _.extend({
      'submit form': 'submit',
      'keyup #zip_code': 'changeZipCode',
      'click .update-location': 'updateLocation',
      'click .onPreview': onPreviewAction,
      'change input[name=phone]': 'formatPhone',
      'change #website,#twitter,#facebook,#instagram,#linkedin': appendHttpIfNecessary,
    }, menuHelper.events),

    initialize(options) {
      this.fields = options.fields;
      this.campaign = options.campaign;
      this.$el.on('keypress', ':input:not(textarea)', function (event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          return false;
        }
      });
    },

    /*appendHttpIfNecessary(e) {
      var $el = $('#website');
      var url = $el.val();
      if (!(url.startsWith("http://") || url.startsWith("https://"))) {
        $el.val("http://" + url);
      }
    },*/

    submit(e) {
      var data = $(e.target).serializeJSON();
      data['founding_date'] = data['founding_date__year'] + '-' +
        data.founding_date__month + '-' + data.founding_date__day;
      delete data.founding_date__day;
      delete data.founding_date__month;
      delete data.founding_date__year;
      api.submitAction.call(this, e, data);
    },

    formatPhone(e) {
      this.$('input[name=phone]').val(this.$('input[name=phone]').val().replace(/^\(?(\d{3})\)?-?(\d{3})-?(\d{4})$/, '$1-$2-$3'));
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
            values: this.model.toJSON(),
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
  })),

  generalInformation: Backbone.View.extend(_.extend(menuHelper.methods, {
      urlRoot: serverUrl + Urls['campaign-list']() + '/general_information',
      template: require('./templates/generalInformation.pug'),
      events: _.extend({
          'submit form': api.submitAction,
          'click .onPreview': onPreviewAction,
        }, jsonActions.events, menuHelper.events),

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          console.log('#content ' + k.split(' ')[1]);
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      addSection: jsonActions.addSection,
      deleteSection: jsonActions.deleteSection,
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
      },

      render() {
        this.fields.faq.type = 'json';
        this.fields.faq.schema = {
          question: {
                      type: 'string',
                      label: 'Question',
                    },
          answer: {
                    type: 'text',
                    label: 'Answer',
                  },
        };
        this.fields.additional_info.type = 'json';
        this.fields.additional_info.schema = {
          title: {
                  type: 'string',
                  label: 'Optional Additional Section',
                  placeholder: 'Section Title',
                },
          body: {
                  type: 'text',
                  label: '',
                  placeholder: 'Description',
                },
        };

        if (this.model.get('faq')) {
          this.faqIndex = Object.keys(this.model.get('faq')).length;
        } else {
          this.faqIndex = 0;
        }

        if (this.model.get('additional_info')) {
          this.additional_infoIndex = Object.keys(this.model.get('additional_info')).length;
        } else {
          this.additional_infoIndex = 0;
        }

        this.$el.html(
            this.template({
              serverUrl: serverUrl,
              Urls: Urls,
              fields: this.fields,
              values: this.model.toJSON(),
            })
        );
        return this;
      },
    })),

  media: Backbone.View.extend(_.extend(menuHelper.methods, {
      events: _.extend({
        'submit form': api.submitAction,
        // 'click .delete-image': 'deleteImage',
        'change #video,.additional_video_link': 'updateVideo',
        dragover: 'globalDragover',
        dragleave: 'globalDragleave',
        // 'change #video,.additional_video_link': 'appendHttpsIfNecessary',
        'change .press_link': 'appendHttpIfNecessary',
        'click .onPreview': onPreviewAction,
      }, jsonActions.events, menuHelper.events),
      urlRoot: serverUrl + Urls['campaign-list']() + '/media',

      appendHttpsIfNecessary(e) {
        appendHttpIfNecessary(e, true);
      },

      appendHttpIfNecessary: appendHttpIfNecessary,

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
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      addSection: jsonActions.addSection,
      deleteSection: jsonActions.deleteSection,
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
        if (this.model.get('press')) {
          this.pressIndex = Object.keys(this.model.get('press')).length;
        } else {
          this.pressIndex = 0;
        }

        if (this.model.get('additional_video')) {
          this.additional_videoIndex = Object.keys(this.model.get('additional_video')).length;
        } else {
          this.additional_videoIndex = 0;
        }

        this.$el.html(
            template({
              serverUrl: serverUrl,
              Urls: Urls,
              fields: this.fields,
              values: this.model.toJSON(),
              dropzoneHelpers: dropzoneHelpers,
            })
        );

        dropzoneHelpers.createImageDropzone(
          dropzone,
          'header_image',
          'campaign_headers', '',
          (data) => {
            this.model.save({
              header_image: data.file_id,
            }, {
              patch: true,
            }).then((model) => {
              console.log('image upload done', model);
            });
          }
        );
        dropzoneHelpers.createImageDropzone(
          dropzone,
          'list_image',
          'campaign_lists', '',
          (data) => {
            this.model.save({
              list_image: data.file_id,
            }, {
              patch: true,
            }).then((model) => {
              console.log('image upload done', model);
            });
          }
        );
        dropzoneHelpers.createImageDropzone(
          dropzone,
          'gallery',
          'galleries/' + this.model.get('id'), '',
          (data) => {
            // console.log(data);
            let $el = $('<div class="thumb-image-container" style="float: left; overflow: hidden; position: relative;">' +
              '<div class="delete-image-container" style="position: absolute;">' +
              '<a class="delete-image" href="#" data-id="' + data.image_id + '">' +
              '<i class="fa fa-times"></i>' +
              '</a>' +
              '</div>' +
              // '<img class="img-fluid pull-left" src="' + data.url + '" style="width: 100px">' +
              '<img class="img-fluid pull-left" src="' + data.origin_url + '">' +
              '</div>'
              );
            $('.photo-scroll').append($el);
            $el.find('.delete-image').click(this.deleteImage.bind(this));
            this.model.save({
              gallery: data.folder_id,
            }, {
              patch: true,
            }).done((model) => {
              console.log('image upload done', model);
            });
          },
          );
        $('.delete-image').click(this.deleteImage.bind(this));
        return this;
      },

      getVideoId(url) {
        try {
          var provider = url.match(/https:\/\/(:?www.)?(\w*)/)[2];
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

        return id;
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
        var id = this.getVideoId(video);

        // ToDo
        // FixME
        // Bad CHECK
        //
        if(id != '') {
          // $form.find('iframe').attr(
          $videoContainer.find('iframe').attr(
              'src', '//youtube.com/embed/' +  id + '?rel=0'
              );
          //e.target.value = id;
        }
      }
  })),

  teamMemberAdd: Backbone.View.extend(_.extend(menuHelper.methods, {
      events: _.extend({
        'submit form': 'submit',
        'click .delete-member': 'deleteMember',
        dragover: 'globalDragover',
        dragleave: 'globalDragleave',
      }, menuHelper.events),
      urlRoot: serverUrl + Urls['campaign-list']() + '/team_members',

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
            required: true,
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
          this.values = this.model.toJSON().members[this.index];
        } else {
          
          this.values = {
            id: this.model.get('id'),
          };
        }

        this.usaStates = require('helpers/usa-states');
        this.$el.html(
          template({
            serverUrl: serverUrl,
            Urls: Urls,
            fields: this.fields,
            member: this.values,
            values: this.values,
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
        let data = {
          member: json,
          index: this.index,
        };

        $('.help-block').remove();
        if (validation.validate(this.fields, json, this)) {
          api.submitAction.call(this, e, data);
        } else {
          _(validation.errors).each((el, key) => {
            Backbone.Validation.callbacks.invalid(this, key, el);
          });
          $('.help-block').scrollTo(45);
        }
      },
    })),

  teamMembers: Backbone.View.extend(_.extend(menuHelper.methods, {
    events: _.extend({
      'click .delete-member': 'deleteMember',
    }, menuHelper.events),

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    render() {
      let template = require('./templates/teamMembers.pug');
      let values = this.model.toJSON();

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
          app.makeRequest('/api/campaign/team_members/' + this.model.get('id') + '?index=' + memberId, 'DELETE').
              then((data) => {
                  this.model.attributes.members.splice(memberId, 1);
                  $(e.currentTarget).parent().remove();
                  if (this.model.attributes.members.length < 1) {
                    this.$el.find('.notification').show();
                    this.$el.find('.buttons-row').hide();
                  } else {
                    this.$el.find('.notification').hide();
                    this.$el.find('.buttons-row').show();
                  }
                });
        }
      },

  })),

  specifics: Backbone.View.extend(_.extend(menuHelper.methods, {
      events: _.extend({
        'submit form': api.submitAction,
        'change input[name="security_type"]': 'updateSecurityType',
        'change #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation': 'formatNumber',
        'change #minimum_raise,#maximum_raise,#price_per_share,#premoney_valuation': 'calculateNumberOfShares',
        dragover: 'globalDragover',
        dragleave: 'globalDragleave',
        'click .onPreview': onPreviewAction,
      }, menuHelper.events),
      urlRoot: serverUrl + Urls['campaign-list']() + '/specifics',

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
                values: this.model.toJSON(),
                dropzoneHelpers: dropzoneHelpers,
              })
        );
        dropzoneHelpers.createFileDropzone(
            dropzone,
            'investor_presentation',
            'investor_presentation', '',
            (data) => {
                this.model.urlRoot = this.urlRoot;
                this.model.save({
                    investor_presentation: data.file_id,
                  }, {
                    patch: true,
                  }).then((data) => {
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

        return this;
      },
    })),

  perks: Backbone.View.extend(_.extend(menuHelper.methods, {
      events: _.extend({
          'submit form': api.submitAction,
          'click .onPreview': onPreviewAction,
        }, jsonActions.events, menuHelper.events),
      urlRoot: serverUrl + Urls['campaign-list']() + '/perks',

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      addSection: jsonActions.addSection,
      deleteSection: jsonActions.deleteSection,
      getSuccessUrl(data) {
        return '/campaign/thankyou/' + data.id;
      },

      initialize(options) {
        this.fields = options.fields;
        this.perksIndex = 1;
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
              },
            perk: {
                type: 'string',
                label: 'We will',
                placholder: 'Description',
                values: [],
              },
          };
        this.$el.html(
            template({
                serverUrl: serverUrl,
                Urls: Urls,
                fields: this.fields,
                values: this.model.toJSON(),
              })
        );
        return this;
      },

    })),

  thankYou: Backbone.View.extend(_.extend(menuHelper.methods, {
    el: '#content',
    template: require('./templates/thankyou.pug'),
    events: _.extend({
      // for view events
    }, menuHelper.events),

    render() {
      console.log(this.model);
      this.$el.html(
        this.template({
          values: this.model,
        })
      );
      return this;
    },
  })),
};
