var jsonActions = {
    events: {
        'click .add-section': 'addSection',
        'click .delete-section': 'deleteSection',
    },

    addSection: function(e) {
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
                            type: 'json',
                            index: this[sectionName + 'Index'],
                        },
                        values: this.model.toJSON() 
                    })
                );
            },

   deleteSection: function(e) {
                e.preventDefault();
                let sectionName = e.currentTarget.dataset.section;
                $('.' + sectionName + ' .index_' + e.currentTarget.dataset.index).remove();
                e.currentTarget.remove();
                // ToDo
                // Fix index counter
                // this[sectionName + 'Index'] --;
   },
};


define(function() {
    return {
        list: Backbone.View.extend({
            initialize: function(options) {
                this.collection = options.collection;
            },

            render: function() {
                //require('sass/pages/_campaing.sass');

                require('../../../node_modules/bootstrap-select/sass/bootstrap-select.scss');

                let selectPicker = require('bootstrap-select');
                this.$el.html('');
                let template = require('templates/campaignList.pug');
                this.$el.append(
                    template({
                        serverUrl: serverUrl,
                        campaigns: this.collection.toJSON()
                    })
                );
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

                            self.undelegateEvents();
                            $('#content').scrollTo();
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
            events: _.extend({
                'submit form': 'submit',
            }, jsonActions.events),

            preinitialize: function() {
                // ToDo
                // Hack for undelegate previous events
                for(let k in this.events) {
                    console.log('#content ' + k.split(' ')[1]);
                    $('#content ' + k.split(' ')[1]).undelegate(); 
                }
            },

            addSection: jsonActions.addSection,
            deleteSection: jsonActions.deleteSection,
            getSuccessUrl: function() {
                return  '/campaign/media/' + this.model.get('id');
            },
            submit: app.defaultSaveActions.submit,

            initialize: function(options) {
                this.fields = options.fields;
                this.faqIndex = 1;
                this.additional_infoIndex = 1;
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
                if(this.model.get('additional_info'))
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

        }),

        media: Backbone.View.extend({
            events: _.extend({
                'submit form': 'submit',
                'change #video': 'updateVideo',
            }, jsonActions.events),

            preinitialize: function() {
                // ToDo
                // Hack for undelegate previous events
                for(let k in this.events) {
                    console.log('#content ' + k.split(' ')[1]);
                    $('#content ' + k.split(' ')[1]).undelegate(); 
                }
            },

            addSection: jsonActions.addSection,
            deleteSection: jsonActions.deleteSection,
            getSuccessUrl: function() {
                return  '/campaign/team_members/' + this.model.get('id');
            },
            submit: app.defaultSaveActions.submit,

            initialize: function(options) {
                this.fields = options.fields;
                this.pressIndex = 1;
                this.additional_videoIndex = 1;
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

            preinitialize: function() {
                // ToDo
                // Hack for undelegate previous events
                for(let k in this.events) {
                    console.log('#content ' + k.split(' ')[1]);
                    $('#content ' + k.split(' ')[1]).undelegate(); 
                }
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

            getSuccessUrl: function() {
                return  '/campaign/specifics/' + this.model.get('id');
            },
            
            submit: function(e) {
                var json = $(e.target).serializeJSON();
                var data = {
                    'member': json,
                    'index': this.index
                };
                app.defaultSaveActions.submit.call(this, e, data);
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
                'change input[name="security_type"]': 'updateSecurityType',
            },

            preinitialize: function() {
                // ToDo
                // Hack for undelegate previous events
                for(let k in this.events) {
                    console.log('#content ' + k.split(' ')[1]);
                    $('#content ' + k.split(' ')[1]).undelegate(); 
                }
            },

            addSection: jsonActions.addSection,
            deleteSection: jsonActions.deleteSection,
            getSuccessUrl: function() {
                return  '/campaign/perks/' + this.model.get('id');
            },
            submit: app.defaultSaveActions.submit,

            initialize: function(options) {
                this.fields = options.fields;
            },

            updateSecurityType: function(e) {
                $('.security_type_list').hide();
                let val = e.currentTarget.value;
                $('.security_type_'  +val).show();
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
                            $('.img-investor_presentation').attr('src', '/img/MS-PowerPoint.png');
                            $('.img-investor_presentation').after('<a class="link-3" href="' + data.url + '">' + data.name + '</a>');
                        });
                    }
                );

                return this;
            },

        }),

        perks: Backbone.View.extend({
            events: _.extend({
                'submit form': 'submit',
            }, jsonActions.events),

            preinitialize: function() {
                // ToDo
                // Hack for undelegate previous events
                for(let k in this.events) {
                    console.log('#content ' + k.split(' ')[1]);
                    $('#content ' + k.split(' ')[1]).undelegate(); 
                }
            },

            addSection: jsonActions.addSection,
            deleteSection: jsonActions.deleteSection,
            getSuccessUrl: function() {
                return  '/api/campaign/' + this.model.get('id');
            },
            submit: app.defaultSaveActions.submit,

            initialize: function(options) {
                this.fields = options.fields;
                this.perksIndex = 1;
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

        }),
    }
});
