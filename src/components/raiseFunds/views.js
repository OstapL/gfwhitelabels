'use strict';
let addSectionHelper = require('helpers/addSectionHelper.js');

import formatHelper from '../../helpers/formatHelper';
const appendHttpIfNecessary = formatHelper.appendHttpIfNecessary;

const dropzoneHelpers = require('helpers/dropzoneHelpers.js');
const leavingConfirmationHelper = require('helpers/leavingConfirmationHelper.js');
const phoneHelper = require('helpers/phoneHelper.js');
const validation = require('components/validation/validation.js');
const menuHelper = require('helpers/menuHelper.js');

const submitCampaign = function submitCampaign(e) {
  doCampaignValidation(e, this.model);
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
  //this.$el.find('#submitForm').click();
  app.showLoading();
  window.location = '/' + this.formc.company_id + '?preview=1&previous=' + pathname;
  setTimeout(() => {
  }, 500);
};


module.exports = {
  company: Backbone.View.extend(_.extend({
    urlRoot: raiseCapitalServer + '/company',
    template: require('./templates/company.pug'),
    events: _.extend({
      'click #submitForm': api.submitAction,
      'keyup #zip_code': 'changeZipCode',
      'click .update-location': 'updateLocation',
      'click .onPreview': onPreviewAction,
      'click .submit_form': submitCampaign,
      'change #website': appendHttpIfNecessary,
      'change #website,#twitter,#facebook,#instagram,#linkedin': 'appendHttpsIfNecessary',
    }, leavingConfirmationHelper.events, phoneHelper.events, menuHelper.events),

    appendHttpsIfNecessary(e) {
      appendHttpIfNecessary(e, true);
    },

    initialize(options) {
      this.fields = options.fields;
      this.formc = options.formc;
      this.campaign = options.campaign;
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
      if(this.model.hasOwnProperty('id')) {
        this.urlRoot += '/:id/edit';
      }
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
        if (success) {
          this.$('.js-city-state').text(`${city}, ${state}`);
          this.$('.js-city').val(city);
          $('form input[name=city]').val(city);
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
          formc: this.formc,
          campaign: this.campaign,
          states: this.usaStates,
        })
      );
      return this;
    },

    _success(data) {
      this.undelegateEvents();
      if (data.hasOwnProperty('campaign_id') == false) {
        data.campaign_id = this.formc.campaign_id;
      }

      app.routers.navigate(
        '/campaign/' + data.campaign_id + '/general_information',
        { trigger: true, replace: false }
      );
    },
  }, leavingConfirmationHelper.methods, phoneHelper.methods, menuHelper.methods)),

  companyDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/companyDashboard.pug'),

    render() {
      this.$el.html(
        this.template({
          values: this.model,
        })
      );
      return this;
    },
  }),
  companyDashboardFirst: Backbone.View.extend({
    el: '#content',
    template: require('./templates/companyDashboardFirst.pug'),

    render() {
      this.$el.html(
        this.template({
          values: this.model,
        })
      );
      return this;
    },
  }),
  afterPaymentDashboard: Backbone.View.extend({
    el: '#content',
    template: require('./templates/afterPaymentDashboard.pug'),

    render() {
      this.$el.html(
        this.template({
          
        })
      );
      return this;
    },
  }),
  generalInformation: Backbone.View.extend(_.extend({
      urlRoot: raiseCapitalServer + '/campaign/:id/general_information',
      template: require('./templates/generalInformation.pug'),
      events: _.extend({
          'click #submitForm': api.submitAction,
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
        return '/campaign/' + this.model.id  + '/media';
      },

      initialize(options) {
        this.fields = options.fields;
        this.formc = options.formc;
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
              values: this.model,
              templates: this.jsonTemplates,
              formc: this.formc,
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
    template: require('./templates/media.pug'),
    urlRoot: raiseCapitalServer + '/campaign/:id/media',

    events: _.extend({
        'click #submitForm': api.submitAction,
        'change #video,.additional-video-link': 'updateVideo',
        'change .press_link': 'appendHttpIfNecessary',
        'click .submit_form': submitCampaign,
        'click .onPreview': onPreviewAction,
      }, leavingConfirmationHelper.events, menuHelper.events,
        addSectionHelper.events, dropzoneHelpers.events
    ),

    getSuccessUrl(data) {
      return '/campaign/' + this.model.id + '/team-members';
    },

    appendHttpsIfNecessary(e) {
      appendHttpIfNecessary(e, true);
    },

    appendHttpIfNecessary: appendHttpIfNecessary,

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    initialize(options) {
      this.urlRoot = this.urlRoot.replace(':id', this.model.id);

      this.fields = options.fields;

      this.fields.header_image_image_id = _.extend(this.fields.header_image_image_id, {
        imgOptions: {
          aspectRatio: 16/9,
          cssClass : 'img-crop',
          showPreview: false,
        },
        fn: function checkNotEmpty(value, attr, fn, model, computed) {
          if(!this.header_image_data || !this.header_image_data.length) {
            throw 'Please upload Header Image';
          }
        },

      });

      this.fields.list_image_image_id = _.extend(this.fields.list_image_image_id, {
        imgOptions: {
          aspectRatio: 16 / 9,
          cssClass: 'img-crop',
          showPreview: false,
        },
        fn: function checkNotEmpty(value, attr, fn, model, computed) {
          if(!this.list_image_data || !this.list_image_data.length) {
            throw 'Please upload Thumbnail Picture';
          }
        },

      });

      this.fields.gallery_group_id = _.extend(this.fields.gallery_group_id, {
        imgOptions: {
          aspectRatio: 16 / 9,
          cssClass: 'img-crop',
          showPreview: false,
        },
        fn: function checkNotEmpty(value, attr, fn, model, computed) {
          if(!this.gallery_group_data || !this.gallery_group_data.length) {
            throw 'Please upload at least 1 image';
          }
        },
      });

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
          headline: 'Additional Video for Campaign',
        },
        list_image_image_id: 'Thumbnail Picture',
        header_image_image_id: 'Header Image',
        video: 'Main Video for Campaign',
        gallery_group_id: 'Gallery'
      };

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

      setTimeout(() => { this.createDropzones() } , 1000);

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

    updateVideo(e) {
      appendHttpIfNecessary(e, true);

      let $videoContainer = $(e.target).closest('.video-container');

      var videoInfo = app.getVideoId(e.target.value);
      var src = app.getVideoUrl(videoInfo);

      $videoContainer.find('iframe').attr('src', src);
    },

  }, leavingConfirmationHelper.methods, menuHelper.methods,
    dropzoneHelpers.methods, addSectionHelper.methods)),

  teamMemberAdd: Backbone.View.extend(_.extend({
    urlRoot: raiseCapitalServer + '/campaign/:id/team-members',
    // doNotExtendModel: true,
    events: _.extend({
      'click .btn-primary': api.submitAction,
      'click .delete-member': 'deleteMember',
      'click .submit_form': doCampaignValidation,
      'change #linkedin,#facebook': 'appendHttpsIfNecessary',
      'click .cancel': 'cancel',
      'click .onPreview': onPreviewAction,
    }, leavingConfirmationHelper.events, menuHelper.events, dropzoneHelpers.events),

    getSuccessUrl(data) {
      return '/campaign/' + this.model.id + '/team-members';
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
      this.formc = options.formc;
      this.type = options.type;
      this.index = options.index;
      this.urlRoot = this.urlRoot.replace(':id', this.model.id);
      this.$el.on('keypress', ':input:not(textarea)', function (event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          return false;
        }
      });
    },

    render() {
      const template = require('./templates/teamMemberAdd.pug');

      if (this.index != 'new') {
        this.member = this.model.data[this.index];
        this.urlRoot  += '/' + this.index;
      } else {
        this.member = {
          photo_data: [],
          type: this.type
        };
      }

      this.usaStates = require('helpers/usa-states');
      this.$el.html(
        template({
          formc: this.formc,
          fields: this.fields,
          member: this.member,
          values: this.model,
          type: this.type,
          index: this.index,
          states: this.usaStates,
        })
      );

      setTimeout(() => { this.createDropzones() } , 1000);
      delete this.model.progress;
      delete this.model.data;
      return this;
    },

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

  }, leavingConfirmationHelper.methods, menuHelper.methods, dropzoneHelpers.methods)),

  teamMembers: Backbone.View.extend(_.extend({
    urlRoot: raiseCapitalServer + '/campaign/:id/team-members',
    events: _.extend({
      'click .delete-member': 'deleteMember',
      'click .submit_form': doCampaignValidation,
      'click .onPreview': onPreviewAction,
      'submit form': 'submit',
    }, menuHelper.events),

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
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

    render() {
      let template = require('./templates/teamMembers.pug');
      // let values = this.model.toJSON();
      let values = this.model;

      if (!Array.isArray(values.data)) {
        values.data = [];
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
          app.makeRequest('/api/campaign/team-members/' + this.model.id + '?index=' + memberId, 'DELETE').
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
      urlRoot: raiseCapitalServer + '/campaign/:id/specifics',
      events: _.extend({
        'click #submitForm': api.submitAction,
        'change input[name="security_type"]': 'updateSecurityType',
        // 'focus #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation,#price_per_share': 'clearZeroAmount',
        // 'change #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation': 'formatNumber',
        // 'change #minimum_raise,#maximum_raise,#price_per_share,#premoney_valuation': 'calculateNumberOfShares',
        'click .onPreview': onPreviewAction,
        'click .submit_form': submitCampaign,
        'click .submit-specifics': 'checkMinMaxRaise',
        'change #valuation_determine': 'valuationDetermine',
      }, leavingConfirmationHelper.events, menuHelper.events, dropzoneHelpers.events),

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          console.log('#content ' + k.split(' ')[1]);
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      initialize(options) {
        this.fields = options.fields;
        this.formc = options.formc;
        this.company = options.company;
        this.labels = {
          investor_presentation_data: '',
          minimum_raise: 'Our Minimum Total Raise is',
          maximum_raise: 'Our Maximum Total Raise is',
          minimum_increment: 'The Minimum investment is',
          length_days: 'Length of the Campaign',
          investor_presentation: 'Upload an Investor Presentation',
          premoney_valuation: 'Pre-Money Valuation',
          price_per_share: 'Price Per Share',
          min_number_of_shares: 'Minimum № of Shares',
          max_number_of_shares: 'Maximum № of Shares',
          min_equity_offered: 'Minimum Equity Offered',
          max_equity_offered: 'Maximum Equity Offered',
          security_type: 'Security Type',
          valuation_determination: 'How did you determine your valuation?',
          valuation_determination_other: 'Description',
        };
        this.assignLabels();
        this.createIndexes();
        this.buildJsonTemplates('raiseFunds');
        this.formatData();

      },

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

      getSuccessUrl(data) {
        return '/campaign/' + this.model.id + '/perks';
      },

      valuationDetermine(e) {
      if (e.target.options[e.target.selectedIndex].value == '2') {
        $('#description_determine').parent().parent().show();
      } else {
        $('#description_determine').parent().parent().hide();
      }
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
                values: this.model,
                formc: this.formc,
              })
        );
        delete this.model.progress;

        setTimeout(() => { this.createDropzones() } , 1000);

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

        if (this.company.corporate_structure == 2) {
          this.$('input[name=security_type][value=0]').prop('disabled', true);
          this.$('input[name=security_type][value=1]').attr('checked', true);
          $('.security_type_list').hide();
          $('.security_type_1').show();
        }
        $('#description_determine').parent().parent().hide();
        return this;
      },
  }, leavingConfirmationHelper.methods, menuHelper.methods, dropzoneHelpers.methods, addSectionHelper.methods)),

  perks: Backbone.View.extend(_.extend({
    urlRoot: raiseCapitalServer + '/campaign/:id/perks',
    events: _.extend({
        'click #submitForm': api.submitAction,
        'click .onPreview': onPreviewAction,
        'click .submit_form': submitCampaign,
    }, leavingConfirmationHelper.events, menuHelper.events, addSectionHelper.events),

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    initialize(options) {
      this.fields = options.fields;
      this.formc = options.formc;
      this.labels = {
        perks: {
          amount: 'If an Investor Invests Over',
          perk: 'Describe the Perk',
        },
      };
      this.assignLabels();
      this.createIndexes();
      this.buildJsonTemplates('raiseFunds');
    },

    render() {
      let template = require('./templates/perks.pug');
      this.$el.html(
        template({
            serverUrl: serverUrl,
            Urls: Urls,
            fields: this.fields,
            values: this.model,
            formc: this.formc,
            templates: this.jsonTemplates,
        })
      );
      return this;
    },

    _success(data) {
      app.hideLoading();
    }

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
