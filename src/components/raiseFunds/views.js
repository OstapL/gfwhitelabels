"use strict";

import formatHelper from '../../helpers/formatHelper';
let appendHttpIfNecessary = formatHelper.appendHttpIfNecessary;

const dropzone = require('dropzone');
const dropzoneHelpers = require('helpers/dropzone.js');
const jsonActions = {
  events: {
    'click .add-section': 'addSection',
    'click .delete-section': 'deleteSection',
  },

  addSection(e) {
    e.preventDefault();
    let sectionName = e.target.dataset.section;
    let template = require('templates/section.pug');
    this[sectionName + 'Index'] ++;
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
          values: this.model.toJSON() 
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


module.exports = {
  company: Backbone.View.extend({
    urlRoot: Urls['company-list'](),
    template: require('./templates/company.pug'),
    events: {
      'submit form': api.submitAction,
      'keyup #zip_code': 'changeZipCode',
      'click .update-location': 'updateLocation',
      'change input[name=phone]': 'formatPhone',
      'change #website': 'appendHttpIfNecessary',
    },

    initialize(options) {
      this.fields = options.fields;
      this.campaign = options.campaign;
      this.$el.on('keypress', ':input:not(textarea)', function(event){
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
    appendHttpIfNecessary: appendHttpIfNecessary,

    formatPhone(e){
      this.$('input[name=phone]').val(this.$('input[name=phone]').val().replace(/^\(?(\d{3})\)?-?(\d{3})-?(\d{4})$/, '$1-$2-$3'));
    },

    updateLocation(e) {
      this.$('.js-city-state').text(this.$('.js-city').val() + ', ' + this.$('.js-state').val());
      $("form input[name=city]").val(this.$('.js-city').val());
      $("form input[name=state]").val(this.$('.js-state').val());
    },

    changeZipCode(e) {
      // if not 5 digit, return
      if (e.target.value.length < 5) return;
      if (!e.target.value.match(/\d{5}/)) return;
      this.getCityStateByZipCode(e.target.value, ({ success=false, city="", state=""}) => {
        // this.zipCodeField.closest('div').find('.help-block').remove();
        if (success) {
          this.$('.js-city-state').text(`${city}, ${state}`);
          // this.$('#city').val(city);
          this.$('.js-city').val(city);
          $("form input[name=city]").val(city);
          // this.$('#state').val(city);
          this.$('.js-state').val(state);
          $("form input[name=state]").val(state);

        } else {
          console.log("error");
        }
      });
    },

    render() {
      this.getCityStateByZipCode = require("helpers/getSityStateByZipCode");
      this.usaStates = require("helpers/usa-states");
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
      // IF we dont have campaign we need create it
      if (this.campaign.id) {
        app.routers.navigate(
            '/campaign/general_information/' + this.campaign.id,
            {trigger: true, replace: false}
            );
      }
      else {
        app.makeRequest('/api/campaign/general_information', 'POST', {
          company: data.id,
          business_model: '',
          intended_use_of_proceeds: '',
          pitch: ''
        }).
        then((campaign) => {
          app.cache['/api/campaign/general_information/' + campaign.id] = campaign;
          app.routers.navigate(
            '/campaign/general_information/' + campaign.id,
            {trigger: true, replace: true}
            );
        })
      }
    },
  }),

  generalInformation: Backbone.View.extend({
      urlRoot: Urls['campaign-list']() + '/general_information',
      template: require('./templates/generalInformation.pug'),
      events: _.extend({
          'submit form': api.submitAction,
      }, jsonActions.events),

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for(let k in this.events) {
          console.log('#content ' + k.split(' ')[1]);
          $('#content ' + k.split(' ')[1]).undelegate(); 
        }
      },

      addSection: jsonActions.addSection,
      deleteSection: jsonActions.deleteSection,
      getSuccessUrl(data) {
        return  '/campaign/media/' + data.id;
      },

      initialize(options) {
        this.fields = options.fields;
        this.faqIndex = 1;
        this.additional_infoIndex = 1;
      },

      render() {
        this.fields['faq'].type = 'json';
        this.fields['faq'].schema = {
          question: {
                      type: 'string', 
                      label: 'Question',
                    },
          answer: {
                    type: 'text',
                    label: 'Answer',
                  }
        }
        this.fields['additional_info'].type = 'json';
        this.fields['additional_info'].schema = {
          title: {
                   type: 'string', 
                   label: 'Optional Additional Section',
                   placeholder: 'Section Title',
                 },
          body: {
                  type: 'text',
                  label: '',
                  placeholder: 'Description',
                }
        }

        if (this.model.get('faq')) {
          this.faqIndex = Object.keys(this.model.get('faq')).length - 1;
        } else {
          this.faqIndex = 0
        }
        if (this.model.get('additional_info')) {
          this.additional_infoIndex = Object.keys(this.model.get('additional_info')).length - 1;
        } else {
          this.additional_infoIndex = 0
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
  }),

  media: Backbone.View.extend({
      events: _.extend({
        'submit form': api.submitAction,
        'click .delete-image': 'deleteImage',
        'change .videoInteractive input[type="url"]': 'updateVideo',
        'dragover .media-container,.dropzone': 'globalDragover',
        'dragleave .media-container,.dropzone': 'globalDragleave',
        'change #video,.additional_video_link': 'appendHttpIfNecessary',
      }, jsonActions.events),

      appendHttpIfNecessary: appendHttpIfNecessary,

      globalDragover () {
          // console.log('hello');
          this.$('.dropzone').css({ border: 'dashed 1px lightgray' });
      },

      globalDragleave () {
          this.$('.dropzone').css({ border: 'none' });
      },

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for(let k in this.events) {
          $('#content ' + k.split(' ')[1]).undelegate(); 
        }
      },

      addSection: jsonActions.addSection,
      deleteSection: jsonActions.deleteSection,
      getSuccessUrl(data) {
        return  '/campaign/team-members/' + data.id;
      },

      initialize(options) {
        this.fields = options.fields;
        this.pressIndex = 1;
        this.additional_videoIndex = 1;
      },

      render() {
        this.model.urlRoot = serverUrl + Urls['campaign-list']() + '/media';
        let template = require('./templates/media.pug');
        this.fields['press'].type = 'json';
        this.fields['press'].schema = {
          headline: {
            type: 'string', 
            label: 'Headline',
            placeholder: 'Title',
            maxLength: 30,
          },
          link: {
            type: 'url',
            label: 'Article link',
            placeholder: 'http://www.',
          }
        };
        this.fields['additional_video'].type = 'jsonVideo';
        this.fields['additional_video'].schema = {
          headline: {
            type: 'string', 
            label: 'Title',
            placeholder: 'Title',
          },
          link: {
            type: 'url',
            label: 'Youtube or vimeo link',
            placeholder: 'https://',
          }
        };
        if(this.model.get('press')) {
          this.pressIndex = Object.keys(this.model.get('press')).length - 1;
        } else {
          this.pressIndex = 0
        }

        if(this.model.get('additional_video')) {
          this.additional_videoIndex = Object.keys(this.model.get('additional_video')).length - 1;
        } else {
          this.additional_videoIndex = 0
        }

        this.$el.html(
            template({
              serverUrl: serverUrl,
              Urls: Urls,
              fields: this.fields,
              values: this.model.toJSON(),
              dropzoneHelpers: dropzoneHelpers
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
              patch: true
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
              patch: true
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
            $('.photo-scroll').append('<div class="thumb-image-container" style="float: left; overflow: hidden; position: relative;">' +
              '<div class="delete-image-container" style="position: absolute;">' +
              '<a class="delete-image" href="#" data-id="' + data.image_id + '">' +
              '<i class="fa fa-times"></i>' +
              '</a>' +
              '</div>' +
              // '<img class="img-fluid pull-left" src="' + data.url + '" style="width: 100px">' +
              '<img class="img-fluid pull-left" src="' + data.origin_url + '">' +
              '</div>'
              );
            this.model.save({
              gallery: data.folder_id,
            }, {
              patch: true
            }).done((model) => {
              console.log('image upload done', model);
            });
          },
          );
        return this;
      },

      getVideoId(url) {
          try {
              var provider = url.match(/https:\/\/(:?www.)?(\w*)/)[2],
              id;

              if(provider == "youtube") {
                  id = url.match(/https:\/\/(?:www.)?(\w*).com\/.*v=(\w*)/)[2];
              } else if (provider == "vimeo") {
                  id = url.match(/https:\/\/(?:www.)?(\w*).com\/(\d*)/)[2];
              } else {
                  return ""
              }
          } catch(err) {
                  return ""
          }
          return id;
      },

      deleteImage(e) {
          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();
          const image_id = e.currentTarget.dataset.id;

          $(e.currentTarget).parent().parent().remove();
          var params = _.extend({
                  url: serverUrl + Urls['image2-list']() + '/' + image_id,
          }, app.defaultOptionsRequest);
          params.type = 'DELETE';

          $.ajax(params);

          return false;
      },

      updateVideo(e) {
          var $form = $(e.target).parents('.videoInteractive').parent();
          var video = e.target.value;
          var id = this.getVideoId(video);
          console.log(id);

          // ToDo
          // FixME
          // Bad CHECK
          //
          if(id != '') {
              $form.find('iframe').attr(
                  'src', '//youtube.com/embed/' +  id + '?rel=0'
              );
              //e.target.value = id;
          }
      }
  }),

  teamMemberAdd: Backbone.View.extend({
      events: {
        'submit form': 'submit',
        'click .delete-member': 'deleteMember',
      },

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for(let k in this.events) {
          $('#content ' + k.split(' ')[1]).undelegate(); 
        }
      },

      initialize(options) {
        this.fields = options.fields;
        this.type = options.type;
        this.index = options.index;
      },

      render() {
        this.model.urlRoot = serverUrl + Urls['campaign-list']() + '/team_members';
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
                       placholder: "Jordon",
                       required: true,
          },
          title: {
                   type: 'string',
                   label: 'Title',
                   placholder: "CEO",
                   required: true,
          },
          email: {
                   type: 'email',
                   label: 'Email',
                   placholder: "imboss@comanpy.com",
                   required: true,
          },
          bio: {
                 type: 'text',
                 label: 'Bio',
                 placholder: 'At least 150 characters and no more that 250 charactes',
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
        }

        if(this.index != 'new') {
          this.values = this.model.toJSON().members[this.index]
        } else {
          this.values = {};
        }

        this.usaStates = require("helpers/usa-states");
        this.$el.html(
          template({
            serverUrl: serverUrl,
            Urls: Urls,
            fields: this.fields,
            member: this.values,
            values: {id: this.model.get('id')},
            type: this.type,
            index: this.index,
            states: this.usaStates,
          })
        );

        dropzoneHelpers.createFileDropzone(
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
        return  '/campaign/team-members/' + data.id;
      },
      
      submit(e) {
        let json = $(e.target).serializeJSON();
        let data = {
          'member': json,
          'index': this.index
        };
        api.submitAction.call(this, e, data);
      },
    }),

    teamMembers: Backbone.View.extend({
      events: {
        'click .delete-member': 'deleteMember',
      },

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for(let k in this.events) {
          $('#content ' + k.split(' ')[1]).undelegate(); 
        }
      },

      render() {
        let template = require('./templates/teamMembers.pug');
        let values = this.model.toJSON();

        if(!Array.isArray(values.members)) {
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

        deleteMember: function(e) {
            let memberId = e.currentTarget.dataset.id;
            app.makeRequest('/api/campaign/team_members/' + this.model.get('id') + '?index=' + memberId, {}, 'DELETE').
                then((data) => {
                    this.model.attributes.members.splice(memberId, 1);
                    $(e.currentTarget).parent().remove()
                    if(this.model.attributes.members.length < 1) {
                        this.$el.find('.notification').show();
                        this.$el.find('.buttons-row').hide();
                    } else {
                        this.$el.find('.notification').hide();
                        this.$el.find('.buttons-row').show();
                    }
                });
        },

    }),

    specifics: Backbone.View.extend({
        events: {
          'submit form': api.submitAction,
          'change input[name="security_type"]': 'updateSecurityType',
          'change #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation': 'formatNumber',
          'change #minimum_raise,#maximum_raise,#price_per_share,#premoney_valuation': "calculateNumberOfShares",
        },

        preinitialize() {
          // ToDo
          // Hack for undelegate previous events
          for(let k in this.events) {
            console.log('#content ' + k.split(' ')[1]);
            $('#content ' + k.split(' ')[1]).undelegate(); 
          }
        },

        formatNumber: function(e) {
          var valStr = $(e.target).val().replace(/,/g,'');
          var val = parseInt(valStr);
          if (val) {
            $(e.target).val(val.toLocaleString('en-US'));
          }
        },

        calculateNumberOfShares: function(e) {
          var minRaise = parseInt(this.$("#minimum_raise").val().replace(/,/g,''));
          var maxRaise = parseInt(this.$("#maximum_raise").val().replace(/,/g,''));
          var pricePerShare = parseInt(this.$("#price_per_share").val().replace(/,/g,''));
          var premoneyVal = parseInt(this.$("#premoney_valuation").val().replace(/,/g,''));
          this.$("#min_number_of_shares").val((Math.round(minRaise/pricePerShare)).toLocaleString('en-US'));
          this.$("#max_number_of_shares").val((Math.round(maxRaise/pricePerShare)).toLocaleString('en-US'));
          // this.$("#min_number_of_shares").val((Math.round(minRaise/pricePerShare)));
          // this.$("#max_number_of_shares").val((Math.round(maxRaise/pricePerShare)));
          this.$("#min_equity_offered").val(Math.round(100*minRaise/(minRaise+premoneyVal)) + "%");
          this.$("#max_equity_offered").val(Math.round(100*maxRaise/(maxRaise+premoneyVal)) + "%");
        },


        addSection: jsonActions.addSection,
        deleteSection: jsonActions.deleteSection,
        getSuccessUrl(data) {
            return  '/campaign/perks/' + data.id;
        },

        initialize(options) {
            this.fields = options.fields;
        },

        updateSecurityType(e) {
            $('.security_type_list').hide();
            let val = e.currentTarget.value;
            $('.security_type_'  +val).show();
        },

        render() {
            this.model.urlRoot = serverUrl + Urls['campaign-list']() + '/specifics';
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
                    this.model.save({
                        investor_presentation: data.file_id,
                    }, {
                        patch: true
                    }).then((model) => {
                        $('.img-investor_presentation').attr('src', '/img/MS-PowerPoint.png');
                        // $('.img-investor_presentation').after('<a class="link-3" href="' + data.url + '">' + data.name + '</a>');
                        $('.a-investor_presentation').attr('href', data.url).text(data.name);
                    });
                }
            );

            this.calculateNumberOfShares(null);

            return this;
        },
    }),

    perks: Backbone.View.extend({
        events: _.extend({
            'submit form': api.submitAction,
        }, jsonActions.events),

        preinitialize() {
            // ToDo
            // Hack for undelegate previous events
            for(let k in this.events) {
                $('#content ' + k.split(' ')[1]).undelegate(); 
            }
        },

        addSection: jsonActions.addSection,
        deleteSection: jsonActions.deleteSection,
        getSuccessUrl(data) {
            return  '/api/campaign/' + data.id;
        },

        initialize(options) {
            this.fields = options.fields;
            this.perksIndex = 1;
        },

        render() {
            this.model.urlRoot = serverUrl + Urls['campaign-list']() + '/perks';
            let template = require('./templates/perks.pug');
            this.fields['perks'].type = 'json'
            this.fields['perks'].schema = {
                amount: {
                    type: 'number', 
                    label: 'If an Investor Invests Over',
                    placeholder: '$',
                    values: [],
                },
                perk: {
                    type: 'string',
                    label: 'We will',
                    placholder: "Description",
                    values: [],
                }
            }
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

    }),
};
