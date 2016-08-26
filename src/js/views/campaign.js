define(function() {
    return {
        list: Backbone.View.extend({
            initialize: function(options) {
                this.collection = options.collection;
            },
            events: {
                'change .selectpicker': 'filter'
            },

            filter: function (event) {
                var industries = this.$el.find('.industry-picker option:selected').map(function(){return this.value;}).get();

                var stages = this.$el.find('.stage-picker option:selected').map(function(){return this.value;}).get();

                var locations = this.$el.find('.location-picker option:selected').map(function(){return this.value;}).get();

                var securityTypes = this.$el.find('.deal-type-picker option:selected').map(function(){return this.value}).get();

                var filteredCollection = new Backbone.Collection(this.collection.filter(function (model) {            
                    // return locations.indexOf(model.get('company').city) != -1;
                    if (industries.length && industries.indexOf(model.get('company').industry) == -1) {
                        return false;
                    }

                    if (stages.length && stages.indexOf(model.get('stage')) == -1) {
                        return false;
                    }

                    // if (locations.length && locations.indexOf(model.get('company').city) == -1) {
                    if (locations.length && locations.indexOf(model.get('city')) == -1) {
                        return false;
                    }

                    if (securityTypes.length && securityTypes.indexOf('' + model.get('security_type')) == -1) {
                        return false;
                    }

                    return true;
                }));

                this.$el.find("#campaignList").html('');
                let view = require('views/subviews');
                var subView = new view.campaignListSub({
                    collection: filteredCollection
                });
                this.$el.find("#campaignList").append(subView.render().$el);
            },

            render: function() {
                //require('sass/pages/_campaing.sass');

                require('../../../node_modules/bootstrap-select/sass/bootstrap-select.scss');

                let selectPicker = require('bootstrap-select');
                this.$el.html('');
                let template = require('templates/campaignList.pug');
                
                var locations = []
                $('.location-picker option:selected').each(function(idx, e){
                    locations.push(e.value)
                });
                this.$el.append(
                    template({
                        serverUrl: serverUrl,
                        campaigns: this.collection.toJSON()
                    })
                );
                let view = require('views/subviews');
                var subView = new view.campaignListSub({
                    collection: this.collection
                });
                this.$el.find("#campaignList").append(subView.render().$el);
                this.$el.find('.selectpicker').selectpicker();
                //selectPicker('.selectpicker');
                return this;
            },
        }),

        detail: Backbone.View.extend({

            initialize: function(options) {
                this.template = options.template;
            },

            render: function() {
                require('../../../node_modules/photoswipe/src/css/main.scss');
                require('../../../node_modules/photoswipe/src/css/default-skin/default-skin.scss');

                let PhotoSwipe = require('photoswipe');
                let PhotoSwipeUI_Default = require('photoswipe-ui-default');

                let template = require('templates/campaignDetail.pug');

                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        campaign: this.model.toJSON()
                    })
                );

                $('.nav-tabs li').click(function (e) {
                    $('.nav-tabs li').removeClass('active');
                    $(this).addClass('active');
                });

                setTimeout(() => {
                    var stickyToggle = function(sticky, stickyWrapper, scrollElement) {
                        var stickyHeight = sticky.outerHeight();
                        var stickyTop = stickyWrapper.offset().top;
                        if (scrollElement.scrollTop() >= stickyTop){
                            stickyWrapper.height(stickyHeight);
                            sticky.addClass("is-sticky");
                        }
                        else{
                            sticky.removeClass("is-sticky");
                            stickyWrapper.height('auto');
                        }
                    };

                    this.$el.find('[data-toggle="sticky-onscroll"]').each(function() {
                        var sticky = $(this);
                        var stickyWrapper = $('<div>').addClass('sticky-wrapper'); // insert hidden element to maintain actual top offset on page
                        sticky.before(stickyWrapper);
                        sticky.addClass('sticky');

                        // Scroll & resize events
                        $(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function() {
                            stickyToggle(sticky, stickyWrapper, $(this));
                        });

                        // On page load
                        stickyToggle(sticky, stickyWrapper, $(window));
                    });

                    let photoswipeRun = require('photoswipe_run.js');
                    window.PhotoSwipe = PhotoSwipe;
                    window.PhotoSwipeUI_Default = PhotoSwipeUI_Default;
                    photoswipeRun('#gallery1');
                }, 100);

                return this;
            },

            /*
            preloadTabContent: function(event) {
                let name = event.target.dataset.url; 
                $.ajax({                                                       
                  url: serverUrl + '/api/campaign/' + this.model.get('id') + '/get_' + name,                   
                  typeData: 'json',                                            
                  success: (response) => {                                     
                    $('#' + name).html(_.template(                            
                        $('#' + name + '_template').html()                     
                    )({'campaign': response}));
                  }                                                         
                });                                                            
                if(app.hasOwnProperty(name) == false) {                    
                }   
            }
            */
        }),

        investment: Backbone.View.extend({
            events: {
                'submit form': 'submit',
                'keyup #amount': 'amountUpdate',
            },
            initialize: function(options) {
                this.campaignModel = options.campaignModel;
                this.fields = options.fields;
            },

            render: function() {
                let template = require('templates/campaignInvestment.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        campaignModel: this.campaignModel,
                        campaign: this.campaignModel.toJSON(),
                        user: app.user.toJSON()
                    })
                );
                return this;
            },

            submit: function(e) {
                this.$el.find('.alert').remove();
                event.preventDefault();

                var data = $(e.target).serializeObject();
                //var investment = new InvestmentModel(data);

                this.model.set(data);
                this.model.set('campaign', this.campaignModel.get('id'));
                this.model.set('user', app.user.get('id'));
                Backbone.Validation.bind(this, {model: this.model});
                var campaignModel = this.campaignModel;

                if(this.model.isValid(true)) {
                    var self = this;
                    this.model.save().
                        then((data) => { 
                            app.showLoading();

                            app.routers.navigate(
                                Urls['investment-detail'](data.id),
                                {trigger: false, replace: false}
                            );

                            let template = require('templates/investmentThankYou.pug');
                            console.log('Urls', Urls);
                            $('#content').html(template({
                                Urls: Urls,
                                investment: data,
                                campaign: campaignModel.toJSON()
                            }));
                            app.cache[window.location.pathname] = $('#content').html();
                            app.hideLoading();
                        });
                } else {
                    if(this.$('.alert').length) {
                        this.$('.alert').scrollTo();
                    } else  {
                        this.$el.find('.has-error').scrollTo();
                    }
                }
            },

            amountUpdate: function(e) {
                var amount = parseInt(e.currentTarget.value);
                if(amount >= 5000) {

                    $('#amount').popover({
                        // trigger: 'focus',
                        placement: function(context, src) {
                            $(context).addClass('amount-popover');
                            return 'top';
                        },
                        html: true,
                        content: function(){
                            var content = $('.invest_form').find('.popover-content-amount-campaign').html();
                            return content;
                        }
                    });

                    $('#amount').popover('show');
                } else {
                    $('#amount').popover('dispose');
                }

                this.$('.perk').each((i, el) => {
                    if(parseInt(el.dataset.from) <= amount) {
                        $('.perk').removeClass('active');
                        $('.perk .fa-check').remove();
                        el.classList.add('active');
                        $(el).find('.list-group-item-heading').append('<i class="fa fa-check"></i>');
                    }
                });
            }
        }),

        investmentThankYou: Backbone.View.extend({
            initialize: function(options) {
                this.template = options.template;
                this.campaignModel = options.campaignModel;
            },

            render: function() {
                let template = require('templates/investmentThankYou.pug');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        investment: this.model,
                        campaign: this.campaignModel.attributes,
                    })
                );
                return this;
            },
        }),

        generalInformation: Backbone.View.extend({
            events: {
                'submit form': 'submit',
                'click .add-section': 'addSection',
                'click .delete-section': 'deleteSection',
            },

            initialize: function(options) {
                this.fields = options.fields;
                this.faqIndex = 1;
                this.additional_infoIndex = 1;
            },

            addSection: function(e) {
                e.preventDefault();
                let sectionName = e.target.dataset.section;
                let template = require('templates/section.pug');
                $('.' + sectionName + ' .m-b-0').addClass('form-group').removeClass('m-b-0');
                this[sectionName + 'Index'] ++;
                $('.' + sectionName).append(
                    template({
                        fields: this.fields,
                        name: sectionName,
                        attr: {
                            class1: '',
                            class2: '',
                            type: 'json',
                            index: this[sectionName + 'Index'],
                        },
                        values: this.model.toJSON() 
                    })
                );
            },

            deleteSection: function(e) {
                e.preventDefault();
                let sectionName = e.target.dataset.section;
                if(this[sectionName + 'Index'] >= 1) {
                    console.log('in delete function');
                    this[sectionName + 'Index'] --;
                    $('.' + sectionName + ' .index_' + this[sectionName + 'Index']).remove();
                }
            },

            render: function() {
                let template = require('templates/campaignGeneralInformation.pug');
                this.fields['faq'].type = 'json'
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
                this.fields['additional_info'].type = 'json'
                this.fields['additional_info'].schema = {
                    title: {
                        type: 'string', 
                        label: 'Optional Additioal Sections',
                        placeholder: 'Section Title',
                    },
                    body: {
                        type: 'text',
                        label: '',
                        placeholder: 'Description',
                    }
                }

                if(this.model.get('faq'))
                    this.faqIndex = Object.keys(this.model.get('faq')).length - 1;
                else
                    this.faqIndex = 0
                if(this.model.get('additional_infoIndex'))
                    this.additional_infoIndex = Object.keys(this.model.get('additional_info')).length - 1;
                else
                    this.additional_infoIndex = 0

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

            submit: function(e) {
                this.$el.find('.alert').remove();
                event.preventDefault();

                var data = $(e.target).serializeJSON();
                //var investment = new InvestmentModel(data);

                this.model.set(data);
                console.log(this.model);
                Backbone.Validation.bind(this, {model: this.model});

                if(this.model.isValid(true)) {
                    var self = this;
                    this.model.save().
                        then((data) => { 
                            app.showLoading();

                            //window.location = '/campaign/media/' + this.model.get('id');
                            self.undelegateEvents();
                            $('#content').scrollTo();
                            app.routers.navigate(
                                '/campaign/media/' + this.model.get('id'),
                                {trigger: true, replace: false}
                            );

                        }).
                        fail((xhr, status, text) => {
                            app.defaultSaveActions.error(this, xhr, status, text, this.fields);
                        });
                } else {
                    if(this.$('.alert').length) {
                        this.$('.alert').scrollTo();
                    } else  {
                        this.$el.find('.has-error').scrollTo();
                    }
                }
            }
        }),

        media: Backbone.View.extend({
            events: {
                'submit form': 'submit',
                'change #video': 'updateVideo',
                'click .add-section': 'addSection',
                'click .delete-section': 'deleteSection',
            },

            initialize: function(options) {
                this.fields = options.fields;
                this.pressIndex = 1;
                this.additional_videoIndex = 1;
            },

            addSection: function(e) {
                e.preventDefault();
                let sectionName = e.target.dataset.section;
                let template = require('templates/section.pug');
                $('.' + sectionName + ' .m-b-0').addClass('form-group').removeClass('m-b-0');
                this[sectionName + 'Index'] ++;
                $('.' + sectionName).append(
                    template({
                        fields: this.fields,
                        name: sectionName,
                        attr: {
                            class1: '',
                            class2: '',
                            type: 'json',
                            index: this[sectionName + 'Index']
                        },
                        values: this.model.toJSON() 
                    })
                );
            },

            deleteSection: function(e) {
                e.preventDefault();
                let sectionName = e.target.dataset.section;
                console.log(e, sectionName, this, this[sectionName + 'Index']);
                if(this[sectionName + 'Index'] >= 1) {
                    this[sectionName + 'Index'] --;
                    $('.' + sectionName + ' .index_' + this[sectionName + 'Index']).remove();
                }
            },

            render: function() {
                let template = require('templates/campaignMedia.pug');
                let dropzone = require('dropzone');
                this.fields['press'].type = 'json'
                this.fields['press'].schema = {
                    headline: {
                        type: 'string', 
                        label: 'Headline',
                        placeholder: 'Title',
                    },
                    link: {
                        type: 'url',
                        label: 'Article link',
                        placeholder: 'http://www.',
                    }
                };
                this.fields['additional_video'].type = 'json'
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
                if(this.model.get('press'))
                    this.pressIndex = Object.keys(this.model.get('press')).length - 1;
                else
                    this.pressIndex = 0

                if(this.model.get('additional_video'))
                    this.additional_videoIndex = Object.keys(this.model.get('additional_video')).length - 1;
                else
                    this.additional_videoIndex = 0

                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        values: this.model.toJSON(),
                    })
                );
                app.createFileDropzone(
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
                app.createFileDropzone(
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
                app.createFileDropzone(
                    dropzone,
                    'gallery', 
                    'galleries/' + this.model.get('id'), '', 
                    (data) => {
                        //console.log(data);
                        $('.photo-scroll').append('<img class="img-fluid pull-left" src="' + data.url + '" style="width: 100px">');
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

            submit: function(e) {
                this.$el.find('.alert').remove();
                event.preventDefault();

                var data = $(e.target).serializeJSON();

                this.model.set(data);
                Backbone.Validation.bind(this, {model: this.model});

                if(this.model.isValid(true)) {
                    var self = this;
                    this.model.save().
                        then((data) => { 
                            app.showLoading();

                            //window.location = '/campaign/specifics/' + this.model.get('id');
                            self.undelegateEvents();
                            $('#content').scrollTo();
                            app.routers.navigate(
                                '/campaign/team_members/' + this.model.get('id'),
                                {trigger: true, replace: false}
                            );

                        }).
                        fail((xhr, status, text) => {
                            app.defaultSaveActions.error(this, xhr, status, text, this.fields);
                        });
                } else {
                    if(this.$('.alert').length) {
                        this.$('.alert').scrollTo();
                    } else  {
                        this.$el.find('.has-error').scrollTo();
                    }
                }
            },

            getVideoId: function(url) {
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

            updateVideo: function(e) {
                var video = e.target.value;
                var id = this.getVideoId(video);
                console.log(id);

                // ToDo
                // FixME
                // Bad CHECK
                //
                if(id != '') {
                    this.$el.find('#video_source iframe').attr(
                        'src', '//youtube.com/embed/' +  id + '?rel=0'
                    );
                    //e.target.value = id;
                }
            }
        }),

        teamMemberAdd: Backbone.View.extend({
            events: {
                'submit form': 'submit',
            },

            initialize: function(options) {
                this.fields = options.fields;
                this.type = options.type;
                this.index = options.index;
            },

            render: function() {
                let dropzone = require('dropzone');
                let template = require('templates/campaignTeamMemberAdd.pug');
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
                        required: true,
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
                        label: 'Your personal Linkedin link',
                        placeholder: 'https://linkedin.com/',
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

                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        values: this.values,
                        type: this.type,
                        index: this.index,
                    })
                );

                app.createFileDropzone(
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

            submit: function(e) {
                this.$el.find('.alert').remove();
                event.preventDefault();

                var json = $(e.target).serializeJSON();
                var data = {
                    'member': json,
                    'index': this.index
                };
                console.log(data);

                //var investment = new InvestmentModel(data);

                this.model.set(data);
                Backbone.Validation.bind(this, {model: this.model});

                if(this.model.isValid(true)) {
                    var self = this;
                    this.model.save(data, {patch: true}).
                        then((data) => { 
                            app.showLoading();

                            //window.location = '/campaign/media/' + this.model.get('id');
                            self.undelegateEvents();
                            $('#content').scrollTo();
                            app.routers.navigate(
                                '/campaign/team_members/' + this.model.get('id'),
                                {trigger: true, replace: false}
                            );

                        }).
                        fail((xhr, status, text) => {
                            app.defaultSaveActions.error(this, xhr, status, text, this.fields);
                        });
                } else {
                    if(this.$('.alert').length) {
                        this.$('.alert').scrollTo();
                    } else  {
                        this.$el.find('.has-error').scrollTo();
                    }
                }
            }
        }),

        teamMembers: Backbone.View.extend({
            initialize: function(options) {
                this.campaign = options.campaign;
            },

            render: function() {
                let template = require('templates/campaignTeamMembers.pug');
                let values = this.model.toJSON();

                if(!Array.isArray(values.members)) {
                    values.members = [];
                }

                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        campaign: this.campaign,
                        Urls: Urls,
                        values: values,
                    })
                );

                return this;
            },

        }),

        specifics: Backbone.View.extend({
            events: {
                'submit form': 'submit',
            },

            initialize: function(options) {
                this.fields = options.fields;
            },

            render: function() {
                const template = require('templates/campaignSpecifics.pug');
                const dropzone = require('dropzone');
                this.$el.html(
                    template({
                        serverUrl: serverUrl,
                        Urls: Urls,
                        fields: this.fields,
                        values: this.model.toJSON(),
                    })
                );
                app.createFileDropzone(
                    dropzone,
                    'investor_presentation', 
                    'investor_presentation', '', 
                    (data) => {
                        this.model.save({
                            investor_presentation: data.file_id,
                        }, {
                            patch: true
                        }).then((model) => {
                            console.log('file upload done', model);
                        });
                    }
                );

                return this;
            },

            submit: function(e) {
                this.$el.find('.alert').remove();
                event.preventDefault();

                var data = $(e.target).serializeObject();
                //var investment = new InvestmentModel(data);

                this.model.set(data);
                Backbone.Validation.bind(this, {model: this.model});

                if(this.model.isValid(true)) {
                    var self = this;
                    this.model.save().
                        then((data) => { 
                            app.showLoading();

                            //window.location = '/campaign/perks/' + this.model.get('id');
                            self.undelegateEvents();
                            $('#content').scrollTo();
                            app.routers.navigate(
                                '/campaign/perks/' + this.model.get('id'),
                                {trigger: true, replace: false}
                            );

                        }).
                        fail((xhr, status, text) => {
                            app.defaultSaveActions.error(this, xhr, status, text, this.fields);
                        });
                } else {
                    if(this.$('.alert').length) {
                        this.$('.alert').scrollTo();
                    } else  {
                        this.$el.find('.has-error').scrollTo();
                    }
                }
            }
        }),

        perks: Backbone.View.extend({
            events: {
                'submit form': 'submit',
                'click .add-section': 'addSection',
            },

            initialize: function(options) {
                this.fields = options.fields;
                this.perksIndex = 1;
            },

            addSection: function(e) {
                e.preventDefault();
                let sectionName = e.target.dataset.section;
                let template = require('templates/section.pug');
                $('.' + sectionName + ' .m-b-0').addClass('form-group').removeClass('m-b-0');
                this[sectionName + 'Index'] ++;
                $('.' + sectionName).append(
                    template({
                        fields: this.fields,
                        name: sectionName,
                        attr: {
                            class1: '',
                            class2: '',
                            type: 'json',
                            index: this[sectionName + Index],
                        },
                        values: this.model.toJSON() 
                    })
                );
            },

            render: function() {
                let template = require('templates/campaignPerks.pug');
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

            submit: function(e) {
                this.$el.find('.alert').remove();
                event.preventDefault();

                var data = $(e.target).serializeJSON();
                //var investment = new InvestmentModel(data);

                this.model.set(data);
                Backbone.Validation.bind(this, {model: this.model});

                if(this.model.isValid(true)) {
                    var self = this;
                    this.model.save().
                        then((data) => { 
                            app.showLoading();
                            console.log('data got', data, this.model);

                            //window.location = '/api/campaign/' + this.model.get('id');
                            self.undelegateEvents();
                            $('#content').scrollTo();
                            app.routers.navigate(
                                '/api/campaign/' + this.model.get('id'),
                                {trigger: true, replace: false}
                            );

                        }).
                        fail((xhr, status, text) => {
                            app.defaultSaveActions.error(this, xhr, status, text, this.fields);
                        });
                } else {
                    if(this.$('.alert').length) {
                        this.$('.alert').scrollTo();
                    } else  {
                        this.$el.find('.has-error').scrollTo();
                    }
                }
            }
        }),


    }
});
