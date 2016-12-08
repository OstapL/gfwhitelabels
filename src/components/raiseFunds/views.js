'use strict';
let addSectionHelper = require('helpers/addSectionHelper.js');

import formatHelper from '../../helpers/formatHelper';
const appendHttpIfNecessary = formatHelper.appendHttpIfNecessary;

const dropzoneHelpers = require('helpers/dropzoneHelpers.js');
const leavingConfirmationHelper = require('helpers/leavingConfirmationHelper.js');
const phoneHelper = require('helpers/phoneHelper.js');
const validation = require('components/validation/validation.js');
const menuHelper = require('helpers/menuHelper.js');
const disableEnterHelper = require('helpers/disableEnterHelper.js');

const submitCampaign = function submitCampaign(e) {
  doCampaignValidation(e, this.model);
};


const postForReview = function postForReview(e) {
  api.makeRequest(raiseCapitalServer + '/company/' + e.target.dataset.companyid + '/post-for-review', 'PUT')
    .then((data) => {
      api.routers.navigate(
        '/company/in-review',
        { trigger: true, replace: false }
      );
    });
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
      'click #postForReview': postForReview,
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
        short_name: 'Doing business as another name?',
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
      disableEnterHelper.disableEnter.call(this);
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

  inReview: Backbone.View.extend(_.extend({
    el: '#content',
    template: require('./templates/companyInReview.pug'),

    render() {
      this.$el.html(
        this.template({
          company: this.model
        })
      );
      return this;
    },
  })),

  generalInformation: Backbone.View.extend(_.extend({
    urlRoot: raiseCapitalServer + '/campaign/:id/general_information',
    template: require('./templates/generalInformation.pug'),
    events: _.extend({
        'click #submitForm': api.submitAction,
        'click .onPreview': onPreviewAction,
        'click .submit_form': submitCampaign,
        'click #postForReview': postForReview,
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
      disableEnterHelper.disableEnter.call(this);
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
        'click #postForReview': postForReview,
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
      this.formc = options.formc;
      this.fields = options.fields;

      this.fields.header_image_image_id = _.extend(this.fields.header_image_image_id, {
        imgOptions: {
          aspectRatio: 16/9,
          cssClass : 'img-crop',
          showPreview: false,
        },

      });

      this.fields.list_image_image_id = _.extend(this.fields.list_image_image_id, {
        imgOptions: {
          aspectRatio: 16 / 9,
          cssClass: 'img-crop',
          showPreview: false,
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
          formc: this.formc,
          templates: this.jsonTemplates,
        })
      );

      setTimeout(() => { this.createDropzones() } , 1000);

      if(app.getParams().check == '1') {
        let data = this.$el.find('form').serializeJSON();
        api.deleteEmptyNested.call(this, this.fields, data);
        api.fixDateFields.call(this, this.fields, data);
        api.fixMoneyField.call(this, this.fields, data);
        data = _.extend({}, this.model, data);

        if (!validation.validate(this.fields, data, this)) {
          _(validation.errors).each((errors, key) => {
            validation.invalidMsg(this, key, errors);
          });
          this.$('.help-block').prev().scrollTo(5);
        }
      }

      disableEnterHelper.disableEnter.call(this);

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
    template: require('./templates/teamMemberAdd.pug'),
    events: _.extend({
      'click .delete-member': 'deleteMember',
      'click .submit_form': doCampaignValidation,
      'click #postForReview': postForReview,
      'change #linkedin,#facebook': 'appendHttpsIfNecessary',
      'click .cancel': 'cancel',
      'click .save': api.submitAction,
      'click .onPreview': onPreviewAction,
      'change #zip_code': 'changeZipCode',
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
      this.fields.photo_image_id.imgOptions = {
        aspectRatio: 1 / 1,
        cssClass: 'img-crop',
        showPreview: true,
      };

      this.formc = options.formc;
      this.type = options.type;
      this.index = options.index;
      this.urlRoot = this.urlRoot.replace(':id', this.model.id);

      if (this.index != 'new') {
        this.member = this.model.data[this.index];
        this.urlRoot  += '/' + this.index;
        this.submitMethod = 'PUT';
      } else {
        this.member = {
          photo_data: [],
          type: this.type
        };
        this.submitMethod = 'POST';
      }

      this.getCityStateByZipCode = require("helpers/getSityStateByZipCode");
    },

    render() {
      this.usaStates = require('helpers/usa-states');

      this.$el.html(
        this.template({
          formc: this.formc,
          fields: this.fields,
          member: this.member,
          values: this.model,
          type: this.type,
          index: this.index,
          // submitMethod: this.submitMethod,
          states: this.usaStates,
        })
      );

      setTimeout(() => { this.createDropzones() } , 1000);

      delete this.model.progress;
      delete this.model.data;

      disableEnterHelper.disableEnter.call(this);
      return this;
    },

    //TODO: it is reasonable make addresss helper
    changeZipCode(e) {
      // if not 5 digit, return
      if (!e.target.value.match(/\d{5}/))
        return;

      this.getCityStateByZipCode(e.target.value, ({ success=false, city='', state='' }) => {
        if (success) {
          this.$('.js-city-state').text(`${city}, ${state}`);
          $('form input[name=city]').val(city);
          this.$('.js-state').val(state);
          $('form input[name=state]').val(state);
        } else {
          console.log('error');
        }
      });
    },

    cancel(e) {
      e.preventDefault();
      e.stopPropagation();
      this.undelegateEvents();
      if (confirm("Do you really want to leave?")) {
        app.routers.navigate(
          '/campaign/' + this.model.id + '/team-members',
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
      'click #postForReview': postForReview,
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
      this.formc = options.formc;

      this.urlRoot = this.urlRoot.replace(':id', this.model.id);
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
            formc: this.formc,
          })
        );

      disableEnterHelper.disableEnter.call(this);

      return this;
    },

    deleteMember: function (e) {
        let memberId = e.currentTarget.dataset.id;

        if (confirm('Are you sure you would like to delete this team member?')) {

          app.makeRequest(this.urlRoot + '/' + memberId, 'DELETE').
              then((data) => {
                  this.model.data.splice(memberId, 1);

                  $(e.currentTarget).parent().remove();
                  if (this.model.data.length < 1) {
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
        'focus #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation,#price_per_share': 'clearZeroAmount',
        'change #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation': 'formatNumber',
        'change #minimum_raise,#maximum_raise,#price_per_share,#premoney_valuation': 'calculateNumberOfShares',
        'click .onPreview': onPreviewAction,
        'click .submit_form': submitCampaign,
        'click #postForReview': postForReview,
        'click .submit-specifics': 'checkMinMaxRaise',
        'change #valuation_determination': 'valuationDetermine',
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
        if (e.target.options[e.target.selectedIndex].value == 2) {
          $('#valuation_determination_other').parent().parent().parent().show();
        } else {
          $('#valuation_determination_other').parent().parent().parent().hide();
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

        disableEnterHelper.disableEnter.call(this);
        return this;
      },
  }, leavingConfirmationHelper.methods, menuHelper.methods, dropzoneHelpers.methods, addSectionHelper.methods)),

  perks: Backbone.View.extend(_.extend({
    urlRoot: raiseCapitalServer + '/campaign/:id/perks',
    events: _.extend({
        'click #submitForm': api.submitAction,
        'click .onPreview': onPreviewAction,
        'click .submit_form': submitCampaign,
        'click #postForReview': postForReview,
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

      disableEnterHelper.disableEnter.call(this);
      return this;
    },

    _success(data) {
      app.hideLoading();
    }

  }, leavingConfirmationHelper.methods, menuHelper.methods, addSectionHelper.methods)),
};
