const raiseHelpers = require('./helpers.js');
const appendHttpIfNecessary = app.helpers.format.appendHttpIfNecessary;

const validation = require('components/validation/validation.js');

const valuation_determination = require('consts/raisecapital/valuation_determination.json');

module.exports = {
  company: Backbone.View.extend(_.extend({
    urlRoot: app.config.raiseCapitalServer + '/company',
    template: require('./templates/company.pug'),
    events: _.extend({
      'click #submitForm': api.submitAction,
      'keyup #zip_code': 'changeZipCode',
      'click .update-location': 'updateLocation',
      'click .onPreview': raiseHelpers.onPreviewAction,
      'click .submit_form': raiseHelpers.submitCampaign,
      'click #postForReview': raiseHelpers.postForReview,
      'change #website': appendHttpIfNecessary,
      'keyup #slug': 'fixSlug',
      'change #website,#twitter,#facebook,#instagram,#linkedin': 'appendHttpsIfNecessary',
    }, /*app.helpers.confirmOnLeave.events,*/ app.helpers.phone.events, app.helpers.menu.events),

    appendHttpsIfNecessary(e) {
      appendHttpIfNecessary(e, true);
    },

    initialize(options) {
      this.fields = options.fields.company;
      this.formc = options.formc || {};
      this.campaign = options.campaign || {};
      this.model = options.company || {};

      this.fields.industry.validate.choices = require('consts/raisecapital/industry.json');
      this.fields.founding_state.validate.choices = require('consts/usaStatesChoices.json');
      this.fields.corporate_structure.validate.choices = require('consts/raisecapital/corporate_structure.json');

      this.labels = {
        name: 'Legal Name of Company',
        short_name: 'Doing Business as Another Name?',
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
        slug: 'What would you like your custom URL to be?',
      };
      this.assignLabels();

      if(this.model.hasOwnProperty('id')) {
        this.urlRoot += '/:id';
      }
    },

    fixSlug(e) {
      e.currentTarget.value = e.currentTarget.value.replace(/\s+/g,'-').replace(/[^a-zA-Z0-9\-]/g,'').toLowerCase();
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
      app.helpers.location(e.target.value, ({ success=false, city='', state='' }) => {
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
      this.$el.html(
        this.template({
          fields: this.fields,
          values: this.model,
          user: app.user.toJSON(),
          formc: this.formc,
          campaign: this.campaign,
        })
      );
      app.helpers.disableEnter.disableEnter.call(this);
      this.checkForm();
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
      return this;
    },

    _success(data, formData) {
      this.undelegateEvents();

      if(data == null) {
        data = {};
      }

      if (data.hasOwnProperty('campaign_id') == false) {
        data.campaign_id = this.formc.campaign_id;
      } else {
        data.company = formData.name;
        data.is_paid = false;
        data.role = 0; 
        data.owner_id = app.user.data.id;
        data.user_id = app.user.data.id;
        data.company_id = data.id;
        delete data.id;
        app.user.data.info.push(data);
        localStorage.setItem('user', JSON.stringify(app.user.toJSON()));
      }

      app.routers.navigate(
        '/campaign/' + data.campaign_id + '/general_information',
        { trigger: true, replace: false }
      );
    },
  }, app.helpers.confirmOnLeave.methods, app.helpers.phone.methods, app.helpers.menu.methods)),

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
    urlRoot: app.config.raiseCapitalServer + '/campaign/:id',
    template: require('./templates/generalInformation.pug'),
    events: _.extend({
        'click #submitForm': api.submitAction,
        'click .onPreview': raiseHelpers.onPreviewAction,
        'click .submit_form': raiseHelpers.submitCampaign,
        'click #postForReview': raiseHelpers.postForReview,
      }, app.helpers.section.events, app.helpers.confirmOnLeave.events, app.helpers.menu.events),

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        console.log('#content ' + k.split(' ')[1]);
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    _success(data, newData) {
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
      return 1;
    },

    getSuccessUrl(data) {
      return '/campaign/' + this.model.id  + '/media';
    },

    initialize(options) {
      this.fields = options.fields.campaign;
      this.model = options.campaign;
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
            fields: this.fields,
            values: this.model,
            templates: this.jsonTemplates,
            formc: this.formc,
          })
      );

      this.checkForm();
      app.helpers.disableEnter.disableEnter.call(this);
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
      return this;
    },
  }, app.helpers.confirmOnLeave.methods, app.helpers.menu.methods, app.helpers.section.methods)),

  media: Backbone.View.extend(_.extend({
    urlRoot: app.config.raiseCapitalServer + '/campaign/:id',
    template: require('./templates/media.pug'),

    events: _.extend({
        'click #submitForm': api.submitAction,
        'change #video,.additional-video-link': 'updateVideo',
        'change .press_link': 'appendHttpIfNecessary',
        'click .submit_form': raiseHelpers.submitCampaign,
        'click #postForReview': raiseHelpers.postForReview,
        'click .onPreview': raiseHelpers.onPreviewAction,
      }, app.helpers.confirmOnLeave.events, app.helpers.menu.events,
        app.helpers.section.events, app.helpers.dropzone.events
    ),

    _success(data, newData) {
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
      return 1;
    },

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
      this.model = new app.models.campaign(
        this.urlRoot.replace(':id', options.campaign.id),
        options.campaign,
        options.fields.campaign
      );
      this.urlRoot = this.urlRoot.replace(':id', this.model.id);
      this.formc = options.formc;
      this.fields = options.fields.campaign;

      this.fields.header_image_image_id = _.extend(this.fields.header_image_image_id, {
        title: 'Drop your photo here or click to upload',
        help_text: 'This is the image that will appear at the top of your campaign. A minimum size of 1600х960 is recommended.',
        crop: {
          control: {
            aspectRatio: 1600/960,
          },
          auto: {
            width: 1600,
            height: 960,
          },
          resize: {
            width: 305,
            height: 205,
          },
          cssClass: 'img-crop',
          template: 'regular'
        },
      });

      this.fields.list_image_image_id = _.extend(this.fields.list_image_image_id, {
        title: 'Drop your photo here or click to upload',
        help_text: ' This image entices investors to view your campaign. A minimum size of 350x209 is recommended.',
        crop: {
          control:  {
            aspectRatio: 305 / 205,
          },
          auto: {
            width: 305,
            height: 205,
          },
          resize: {
            width: 305,
            height: 205,
          },
          cssClass: 'img-crop',
          template: 'regular'
        },
      });

      this.fields.gallery_group_id = _.extend(this.fields.gallery_group_id, {
        title: 'Drop your photo(s) here or click to upload',
        help_text: 'We recommend uploading 6 images (minimum size of 1024x800 is recommended) that represent your service of business. These images will be displayed in a gallery format.',
        crop: {
          control: {
            aspectRatio: 1024 / 800,
          },
          auto: {
            width: 1024,
            height: 800,
          },
          resize: {
            width: 530,
            height: 356,
          },
          cssClass: 'img-crop',
          template: 'regular'
        },

        fn: function checkNotEmpty(name, value, attr, data, computed) { 
          if(!this.model.gallery_group_data || !this.model.gallery_group_data.length) {
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
          fields: this.fields,
          values: this.model,
          formc: this.formc,
          view: this,
          templates: this.jsonTemplates,
        })
      );

      // setTimeout(() => { this.createDropzones() } , 1000);
      app.helpers.disableEnter.disableEnter.call(this);
      this.checkForm();
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));

      return this;
    },

    updateVideo(e) {
      appendHttpIfNecessary(e, true);

      let $videoContainer = $(e.target).closest('.video-container');

      var videoInfo = app.getVideoId(e.target.value);
      var src = app.getVideoUrl(videoInfo);

      $videoContainer.find('iframe').attr('src', src);
    },

  }, app.helpers.confirmOnLeave.methods, app.helpers.menu.methods,
    app.helpers.dropzone.methods, app.helpers.section.methods)),

  teamMemberAdd: Backbone.View.extend(_.extend({
    urlRoot: app.config.raiseCapitalServer + '/campaign/:id/team-members',
    template: require('./templates/teamMemberAdd.pug'),
    events: _.extend({
      'click .delete-member': 'deleteMember',
      'click .submit_form': raiseHelpers.submitCampaign,
      'click #postForReview': raiseHelpers.postForReview,
      'change #linkedin,#facebook': 'appendHttpsIfNecessary',
      'click .cancel': 'cancel',
      'click .save': api.submitAction,
      'click .onPreview': raiseHelpers.onPreviewAction,
      // 'change #zip_code': 'changeZipCode',
    }, app.helpers.confirmOnLeave.events, app.helpers.menu.events, app.helpers.dropzone.events),
    
    _success(data) {
      window.location = '/campaign/' + this.model.id + '/team-members';
    },

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    initialize(options) {
      this.fields = options.fields.campaign.team_members.schema;
      this.fields.order.placeholder = 'Put a number if you want to order your members';
      this.fields.photo_image_id = _.extend(this.fields.photo_image_id, {
        crop: {
          control:  {
            aspectRatio: 1 / 1,
          },
          cropper: {
            cssClass: 'img-profile-crop',
            preview: true,
          },
          auto: {
            width: 500,
            height: 500,
          },
        },
      });

      this.model = options.campaign;
      this.formc = options.formc;
      this.type = options.type;
      this.index = options.index;

      this.urlRoot = this.urlRoot.replace(':id', this.model.id);

      if (this.index != 'new') {
        this.member = this.model.team_members[this.index];
        this.urlRoot  += '/' + this.index;
        this.submitMethod = 'PUT';
      } else {
        this.member = {
          photo_data: [],
          type: this.type
        };
        this.submitMethod = 'POST';
      }
    },

    render() {
      this.$el.html(
        this.template({
          formc: this.formc,
          fields: this.fields,
          member: this.member,
          values: this.model,
          type: this.type,
          index: this.index
        })
      );

      this.createDropzones();
      this.checkForm();

      //delete this.model.progress;
      //delete this.model.data;

      app.helpers.disableEnter.disableEnter.call(this);
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
      return this;
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

  }, app.helpers.confirmOnLeave.methods, app.helpers.menu.methods, app.helpers.dropzone.methods)),

  teamMembers: Backbone.View.extend(_.extend({
    urlRoot: app.config.raiseCapitalServer + '/campaign/:id/team-members',
    events: _.extend({
      'click .delete-member': 'deleteMember',
      'click .submit_form': raiseHelpers.submitCampaign,
      'click #postForReview': raiseHelpers.postForReview,
      'click .onPreview': raiseHelpers.onPreviewAction,
    }, app.helpers.menu.events),

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    initialize(options) {
      this.fields = options.fields.campaign;
      this.formc = options.formc;
      this.model = options.campaign;

      this.urlRoot = this.urlRoot.replace(':id', this.model.id);
    },

    render() {
      let template = require('./templates/teamMembers.pug');
      let values = this.model;

      this.$el.html(
        template({
            campaign: values,
            values: values,
            formc: this.formc,
          })
        );

      app.helpers.disableEnter.disableEnter.call(this);
      this.checkForm();
      this.$el.find('.team-add-item').equalHeights();
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
      return this;
    },

    deleteMember: function (e) {
        let memberId = e.currentTarget.dataset.id;

        if (confirm('Are you sure you would like to delete this team member?')) {

          api.makeRequest(this.urlRoot + '/' + memberId, 'DELETE').
              then((data) => {
                  this.model.team_members.splice(memberId, 1);

                  $(e.currentTarget).parent().remove();
                  if (this.model.team_members.length < 1) {
                    this.$el.find('.notification').show();
                    this.$el.find('.buttons-row').hide();
                  } else {
                    this.$el.find('.notification').hide();
                    this.$el.find('.buttons-row').show();
                  }
                });
        }
      },

  }, app.helpers.menu.methods)),

  specifics: Backbone.View.extend(_.extend({
      urlRoot: app.config.raiseCapitalServer + '/campaign/:id',
      events: _.extend({
        'click #submitForm': api.submitAction,
        'change input[name="security_type"]': 'updateSecurityType',
        //'focus #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation,#price_per_share': 'clearZeroAmount',
        //'change #minimum_raise,#maximum_raise,#minimum_increment,#premoney_valuation': 'formatNumber',
        'change #minimum_raise,#maximum_raise,#price_per_share,#premoney_valuation': 'calculateNumberOfShares',
        'click .onPreview': raiseHelpers.onPreviewAction,
        'click .submit_form': raiseHelpers.submitCampaign,
        'click #postForReview': raiseHelpers.postForReview,
        'click .submit-specifics': 'checkMinMaxRaise',
        'change #valuation_determination': 'valuationDetermine',
      }, app.helpers.confirmOnLeave.events, app.helpers.menu.events, app.helpers.dropzone.events),

      preinitialize() {
        // ToDo
        // Hack for undelegate previous events
        for (let k in this.events) {
          $('#content ' + k.split(' ')[1]).undelegate();
        }
      },

      initialize(options) {
        this.fields = options.fields.campaign;
        this.formc = options.formc;
        this.model = new app.models.campaign(
          this.urlRoot.replace(':id', options.campaign.id),
          options.campaign,
          options.fields.campaign
        );
        this.company = options.company;
        this.fields.valuation_determination_other = _.extend(this.fields.valuation_determination_other, {
          dependies: ['valuation_determination'],
          fn: function(name, value, attr, data, schema) {
            let valuation_determination_val = this.getData(data, 'valuation_determination');
            if (valuation_determination_val == valuation_determination.Other)
              return this.required(name, true, attr, data);
          }
        });
        this.fields.valuation_determination = _.extend(this.fields.valuation_determination, {
          dependies: ['valuation_determination_other'],
        });
        this.fields.length_days.validate.choices = require('consts/raisecapital/length_days.json');
        this.fields.security_type.validate.choices = require('consts/raisecapital/security_type_options.json');
        this.fields.valuation_determination.validate.choices = require('consts/raisecapital/valuation_determination_options.json');
        this.labels = {
          minimum_raise: 'Our Minimum Total Raise is',
          maximum_raise: 'Our Maximum Total Raise is',
          minimum_increment: 'The Minimum investment is',
          length_days: 'Length of the Campaign',
          investor_presentation_file_id: 'Upload an Investor Presentation',
          premoney_valuation: 'Pre-Money Valuation',
          price_per_share: 'Price Per Share',
          min_number_of_shares: 'Minimum № of Shares',
          max_number_of_shares: 'Maximum № of Shares',
          min_equity_offered: 'Minimum Equity Offered',
          max_equity_offered: 'Maximum Equity Offered',
          security_type: 'Security Type',
          valuation_determination: 'How did you determine your valuation?',
          valuation_determination_other: 'Please explain',
        };
        this.assignLabels();
        this.createIndexes();
        this.buildJsonTemplates('raiseFunds');

        this.fields.minimum_raise.dependies = ['maximum_raise',];
        this.fields.maximum_raise.dependies = ['minimum_raise',];

        if(this.model.hasOwnProperty('id')) {
          this.urlRoot = this.urlRoot.replace(':id', this.model.id);
        }

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

      calculateNumberOfShares: function (e) {
        const minRaise = parseInt(this.$('#minimum_raise').val().replace(/[\$\,]/g, ''));
        const maxRaise = parseInt(this.$('#maximum_raise').val().replace(/[\$\,]/g, ''));
        const pricePerShare = parseFloat(this.$('#price_per_share').val().replace(/[\$\,]/g, ''));
        const premoneyVal = parseFloat(this.$('#premoney_valuation').val().replace(/[\$\,]/g, ''));
        let min_number_of_shares = Math.round(minRaise / pricePerShare);
        let max_number_of_shares = Math.round(maxRaise / pricePerShare);

        if (!isFinite(min_number_of_shares)) { 
          min_number_of_shares = 0;
        }

        if (!isFinite(max_number_of_shares)) {
          max_number_of_shares = 0;
        }

        let min_equity_offered = Math.round(100 * minRaise / (minRaise + premoneyVal));
        let max_equity_offered = Math.round(100 * maxRaise / (maxRaise + premoneyVal));

        if (!isFinite(min_equity_offered)) {
          min_equity_offered = 0;
        }

        if (!isFinite(max_equity_offered)) {
          max_equity_offered = 0;
        }

        this.$('#min_number_of_shares').val(min_number_of_shares.toLocaleString('en-US'));
        this.$('#max_number_of_shares').val(max_number_of_shares.toLocaleString('en-US'));
        this.$('#min_equity_offered').val(min_equity_offered + '%');
        this.$('#max_equity_offered').val(max_equity_offered + '%');
      },

      _success(data, newData) {
        raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
        return 1;
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
                fields: this.fields,
                values: this.model,
                formc: this.formc,
                view: this,
            })
        );

        // delete this.model.progress;

        // setTimeout(() => { this.createDropzones() } , 1000);

        this.calculateNumberOfShares(null);

        this.checkForm();

        if (this.company.corporate_structure == 2) {
          this.$('input[name=security_type][value=0]').prop('disabled', true);
          this.$('input[name=security_type][value=1]').attr('checked', true);
          $('.security_type_list').hide();
          $('.security_type_1').show();
        }
        $('#description_determine').parent().parent().hide();

        app.helpers.disableEnter.disableEnter.call(this);
        raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
        return this;
      },
  }, app.helpers.confirmOnLeave.methods, app.helpers.menu.methods, app.helpers.dropzone.methods, app.helpers.section.methods)),

  perks: Backbone.View.extend(_.extend({
    urlRoot: app.config.raiseCapitalServer + '/campaign/:id',
    events: _.extend({
        'click #submitForm': api.submitAction,
        'click .onPreview': raiseHelpers.onPreviewAction,
        'click .submit_form': raiseHelpers.submitCampaign,
        'click #postForReview': raiseHelpers.postForReview,
    }, app.helpers.confirmOnLeave.events, app.helpers.menu.events, app.helpers.section.events),

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    initialize(options) {
      this.fields = options.fields.campaign;
      this.formc = options.formc;
      this.model = options.campaign;
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
            fields: this.fields,
            values: this.model,
            formc: this.formc,
            templates: this.jsonTemplates,
        })
      );

      app.helpers.disableEnter.disableEnter.call(this);
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
      return this;
    },

    _success(data) {
      raiseHelpers.updateMenu(raiseHelpers.calcProgress(app.user.campaign));
      app.hideLoading();
      return 0;
    }

  }, app.helpers.confirmOnLeave.methods, app.helpers.menu.methods, app.helpers.section.methods)),
};
