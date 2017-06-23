const raiseHelpers = require('./helpers.js');
const appendHttpIfNecessary = app.helpers.format.appendHttpIfNecessary;

const validation = require('components/validation/validation.js');

const valuation_determination = require('consts/raisecapital/valuation_determination.json');

const snippets = {
  additional_info: require('./templates/snippets/additional_info.pug'),
  additional_video: require('./templates/snippets/additional_video.pug'),
  faq: require('./templates/snippets/faq.pug'),
  gallery_data: require('./templates/snippets/gallery_data.pug'),
  header_image_data: require('./templates/snippets/header_image_data.pug'),
  investor_presentation_data: require('./templates/snippets/investor_presentation_data.pug'),
  list_image_data: require('./templates/snippets/list_image_data.pug'),
  media: require('./templates/snippets/media.pug'),
  perks: require('./templates/snippets/perks.pug'),
  press: require('./templates/snippets/press.pug'),
  team_members: require('./templates/snippets/team_members.pug'),
};

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
      'keyup #slug': 'fixSlug',
      'change #website': 'appendHttpIfNecessary',
    },
      /*app.helpers.confirmOnLeave.events,*/
      app.helpers.phone.events,
      app.helpers.menu.events,
      app.helpers.social.events,
    ),

    appendHttpIfNecessary(e) {
      appendHttpIfNecessary(e, false);
    },

    initialize(options) {
      this.fields = options.fields.company;
      this.formc = options.formc || {};
      this.campaign = options.campaign || {};
      this.model = options.company;

      this.fields.industry.validate.choices = require('consts/raisecapital/industry.json');
      this.fields.founding_state.validate.choices = require('consts/usaStatesChoices.json');
      this.fields.corporate_structure.validate.choices = require('consts/raisecapital/corporate_structure.json');
      this.fields.tour.validate.choices = require('consts/raisecapital/tour.json').TOUR;

      this.labels = {
        tour: 'Would You Like to Participate in The <a class="link-2" href="/pg/heartland-tour" target="_blank">Heartland Tour</a>',
        name: 'Legal Name of Company',
        short_name: 'Doing Business as Another Name?',
        industry: 'Industry',
        ga_id: 'Google Analytic ID',
        founding_state: 'Jurisdiction of Incorporation / Organization',
        tagline: 'Tagline',
        description: 'About Us',
        corporate_structure: 'Corporate Structure',
        founding_date: 'Founding date',
        ga_id: 'Google Analytic ID',
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
      if(e.currentTarget.value) {
        e.currentTarget.value = e.currentTarget.value.replace(/\s+/g,'-').replace(/[^a-zA-Z0-9\-]/g,'').toLowerCase();
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
      if(this.campaign) {
        this.campaign.updateMenu(this.campaign.calcProgress());
      }
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
  },
    app.helpers.confirmOnLeave.methods,
    app.helpers.phone.methods,
    app.helpers.menu.methods,
    app.helpers.social.methods,
  )),

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
      this.model.updateMenu(this.model.calcProgress(this.model));
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
      this.buildSnippets(snippets);
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
      this.model.updateMenu(this.model.calcProgress(this.model));
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
        app.helpers.section.events
    ),

    _success(data, newData) {
      this.model.updateMenu(this.model.calcProgress(this.model));
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
      this.model = options.campaign;
      this.urlRoot = this.urlRoot.replace(':id', this.model.id);
      this.formc = options.formc;
      this.fields = options.fields.campaign;

      this.fields.header_image_image_id = _.extend(this.fields.header_image_image_id, {
        title: 'Drop your photo here or click to upload',
        help_text: 'This is the image that will appear at the top of your campaign. A minimum size of 1600x800 is recommended.',
        templateDropzone: 'headerMedia.pug',
        defaultImage: require('images/default/default-header.png'),
        onSaved: (data) => {
          this.model.updateMenu(this.model.calcProgress(this.model));
        },
        crop: {
          control: {
            aspectRatio: 1600/800,
            crop: function(e) {
              /*
              if(event.detail.height < 1600) {
                console.log('too small area ', event.detail.height);
                throw('too small');
              }
              if(event.detail.width < 960) {
                console.log('too small area ', event.detail.width);
                throw('too small');
              }
              */
            }
          },
          auto: {
            width: 1600,
            height: 800,
          },
          resize: {
            width: 538,
            height: 272,
          },
          cssClass: 'img-crop',
          template: 'regular'
        },
      });

      this.fields.list_image_image_id = _.extend(this.fields.list_image_image_id, {
        title: 'Drop your photo here or click to upload',
        help_text: ' This image entices investors to view your campaign. A minimum size of 350x209 is recommended.',
        onSaved: (data) => {
          this.model.updateMenu(this.model.calcProgress(this.model));
        },
        crop: {
          control:  {
            aspectRatio: 350 / 209,
          },
          auto: {
            width: 350,
            height: 209,
          },
          resize: {
            width: 350,
            height: 209,
          },
          cssClass: 'img-crop',
          template: 'regular'
        },
      });

      this.fields.gallery_group_id = _.extend(this.fields.gallery_group_id, {
        title: 'Drop your photo(s) here or click to upload',
        help_text: 'We recommend uploading 6 images (minimum size of 1024x612 is recommended) that represent your service of business. These images will be displayed in a gallery format.',
        onSaved: (data) => {
          this.model.gallery_group_data = data.file.data;
          this.model.updateMenu(this.model.calcProgress(this.model));
        },
        crop: {
          control: {
            aspectRatio: 1024 / 612,
          },
          auto: {
            width: 1024,
            height: 612,
          },
          resize: {
            width: 530,
            height: 317,
          },
          cssClass: 'img-crop',
          template: 'regular'
        },

        fn: function checkNotEmpty(name, value, attr, data, computed) { 
          if(!data.gallery_group_data || data.gallery_group_data.length < 6) {
            throw 'Please upload at least 6 images';
          }
        },
      });

      this.labels = {
        gallery_data: {
          url: 'Gallery',
        },
        press: {
          headline: 'Quote from Article',
          name: 'Name of Publication',
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
      this.buildSnippets(snippets);
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

      app.helpers.disableEnter.disableEnter.call(this);
      this.checkForm();
      this.model.updateMenu(this.model.calcProgress(this.model));
      setTimeout(this._initVimeoVideoThumbnails.bind(this), 100);
      return this;
    },

    updateVideo(e) {
      appendHttpIfNecessary(e, true);

      const $videoContainer = $(e.target).closest('.video-container');
      const img = $videoContainer.find('img')[0];

      if (!e.target.value) {
        img.src = require('images/default/default-video.png');
        return;
      }

      const videoInfo = app.getVideoInfo(e.target.value);
      if (!videoInfo) {
        return;
      }

      if (videoInfo.provider === 'youtube')
        this._updateYoutubeThumbnail(img, videoInfo.id);
      else if (videoInfo.provider === 'vimeo')
        this._updateVimeoThumbnail(img, videoInfo.id);
    },

    _updateYoutubeThumbnail(img, videoID) {
      img.src = videoID
        ? '//img.youtube.com/vi/' + videoID + '/0.jpg'
        : require('images/default/default-video.png');
    },

    _updateVimeoThumbnail(img, videoID) {
      if (!videoID) {
        img.src = require('images/default/default-video.png');
        return;
      }

      $.getJSON('//vimeo.com/api/v2/video/' + videoID + '.json').then((response) => {
        if (!response || !response[0] || !response[0].thumbnail_large) {
          console.error('Unexpected response format');
          console.log(response);
          return;
        }

        img.src = response[0].thumbnail_large;
      }).fail((err) => {
        console.error('Failed to load thumbnail from vimeo');
        img.src = require('images/default/default-video.png');
      });
    },

    _initVimeoVideoThumbnails() {
      const $images = this.$('img[data-vimeo-id]');
      if (!$images.length)
        return;

      $images.each((idx, img) => {
        this._updateVimeoThumbnail(img, img.dataset.vimeoId);
      });
    },

  }, app.helpers.confirmOnLeave.methods, app.helpers.menu.methods,
    app.helpers.section.methods)),

  teamMemberAdd: Backbone.View.extend(_.extend({
    urlRoot: app.config.raiseCapitalServer + '/campaign/:id/team-members',
    template: require('./templates/teamMemberAdd.pug'),
    events: _.extend({
      'click .delete-member': 'deleteMember',
      'click .submit_form': raiseHelpers.submitCampaign,
      'click #postForReview': raiseHelpers.postForReview,
      'click .cancel': 'cancel',
      'click .save': api.submitAction,
      'click .onPreview': raiseHelpers.onPreviewAction,
      // 'change #zip_code': 'changeZipCode',
    },
      app.helpers.confirmOnLeave.events,
      app.helpers.menu.events,
      app.helpers.social.events),
    
    _success(data, postData, method) {
      /*
      if (method == 'POST') {
        let TeamMember = require('models/teammembercampaign.js');
        this.campaign.team_members.members.push(
          new TeamMember.TeamMember(
            postData,
            this.campaign.schema.team_members.schema,
            this.campaign.url + '/team-members/' + this.campaign.team_members.members.length
          )
        )
      }
      this.undelegateEvents();
      app.routers.navigate(
        '/campaign/' + this.campaign.id + '/team-members',
        {trigger: true, replace: false}
      );
      */
      window.location = '/campaign/' + this.campaign.id + '/team-members';
      return false;
    },

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    initialize(options) {
      let TeamMember = require('models/teammembercampaign.js');
      this.fields = options.fields.campaign.team_members.schema;
      this.fields.photo_image_id = _.extend(this.fields.photo_image_id, {
        label: 'Profile Picture',
        help_text: 'A minimum size of 300x300 is recommended.',
        onSaved: (data) => {
          // delete newData.urlRoot;
          api.makeRequest(this.urlRoot, 'PUT', this.model.toJSON());
        },
        crop: {
          control:  {
            aspectRatio: 1 / 1,
          },
          auto: {
            width: 300,
            height: 300,
          },
          resize: {
            width: 300,
            height: 300,
          },
          cssClass: 'img-profile-crop',
          template: 'withpreview'
        },
      });

      this.campaign = options.campaign;
      this.formc = options.formc;
      this.type = options.type;
      this.index = options.index;

      this.urlRoot = this.urlRoot.replace(':id', this.campaign.id);
      if (this.index != 'new') {
        this.model = this.campaign.team_members.members[this.index];
        this.urlRoot  += '/' + this.index;
        this.submitMethod = 'PUT';
      } else {
        this.model = new TeamMember.TeamMember(
          {
            photo_image_id: null,
            photo_data: [],
            type: this.type
          },
          this.fields,
          this.campaign.url + '/team-members'
        )
        this.submitMethod = 'POST';
      }
    },

    render() {
      this.$el.html(
        this.template({
          formc: this.formc,
          fields: this.fields,
          model: this.model,
          campaign: this.campaign,
          type: this.type,
          view: this,
          index: this.index
        })
      );

      this.checkForm();

      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },

    cancel(e) {
      e.preventDefault();
      e.stopPropagation();
      this.undelegateEvents();

      app.dialogs.confirm('Do you really want to leave?').then((confirmed) => {
        if (!confirmed)
          return;

        app.routers.navigate(
          '/campaign/' + this.campaign.id + '/team-members',
          { trigger: true, replace: false }
        );
      });
    },

  },
    app.helpers.confirmOnLeave.methods,
    app.helpers.menu.methods,
    app.helpers.social.methods)),

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

      this.$el.html(
        template({
          values: this.model,
          formc: this.formc,
        })
      );

      app.helpers.disableEnter.disableEnter.call(this);
      this.checkForm();
      this.$el.find('.team-add-item').equalHeights();
      this.model.updateMenu(this.model.calcProgress(this.model));
      return this;
    },

    deleteMember: function (e) {
      let memberId = e.currentTarget.dataset.id;

      app.dialogs.confirm('Are you sure you would like to delete this team member?').then((confirmed) => {
        if (!confirmed)
          return;

        api.makeRequest(this.urlRoot + '/' + memberId, 'DELETE').
        then((data) => {
          this.model.team_members.members.splice(memberId, 1);

          $(e.currentTarget).parent().remove();
          if (this.model.team_members.members.length < 1) {
            this.$el.find('.notification').show();
            this.$el.find('.buttons-row').hide();
          } else {
            this.$el.find('.notification').hide();
            this.$el.find('.buttons-row').show();
          }
        });
      });
    },

  }, app.helpers.menu.methods)),

  specifics: Backbone.View.extend(_.extend({
    urlRoot: app.config.raiseCapitalServer + '/campaign/:id',
    events: _.extend({
      'click #submitForm': api.submitAction,
      'change input[name="security_type"]': 'updateSecurityType',
      'change #minimum_raise,#maximum_raise,#price_per_share,#premoney_valuation': 'calculateNumberOfShares',
      'click .onPreview': raiseHelpers.onPreviewAction,
      'click .submit_form': raiseHelpers.submitCampaign,
      'click #postForReview': raiseHelpers.postForReview,
      'click .submit-specifics': 'checkMinMaxRaise',
      'change #valuation_determination': 'valuationDetermine',
    }, app.helpers.confirmOnLeave.events, app.helpers.menu.events),

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
      this.fields.investor_presentation_file_id = _.extend(this.fields.investor_presentation_file_id, {
        label: 'Upload an Investor Presentation',
        onSaved: (data) => {
          this.model.updateMenu(this.model.calcProgress(this.model));
        },
      });

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
      this.buildSnippets(snippets);

      this.fields.minimum_raise.dependies = ['maximum_raise',];
      this.fields.maximum_raise.dependies = ['minimum_raise',];
      this.fields.premoney_valuation.dependies = ['security_type',];
      this.fields.security_type.dependies = ['premoney_valuation',];
      this.fields.price_per_share.type = 'money';
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
        app.dialogs.error("Maximum Raise must be larger than Minimum Raise!");
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
      this.model.updateMenu(this.model.calcProgress(this.model));
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
      this.model.updateMenu(this.model.calcProgress(this.model));
      return this;
    },
  }, app.helpers.confirmOnLeave.methods, app.helpers.menu.methods, app.helpers.section.methods)),

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
      this.model = options.campaign
      this.labels = {
        perks: {
          amount: 'If an Investor Invests Over',
          perk: 'Describe the Perk',
        },
      };
      this.assignLabels();
      this.createIndexes();
      this.buildSnippets(snippets);
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
      this.model.updateMenu(this.model.calcProgress(this.model));
      return this;
    },

    _success(data) {
      this.model.updateMenu(this.model.calcProgress(this.model));
      app.hideLoading();
      return 0;
    }

  }, app.helpers.confirmOnLeave.methods, app.helpers.menu.methods, app.helpers.section.methods)),
}
