"use strict";
let menuHelper = require('helpers/menuHelper.js');
let addSectionHelper = require('helpers/addSectionHelper.js');
let yesNoHelper = require('helpers/yesNoHelper.js');

/*var jsonActions = {
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
};*/

/*var menuEvents = {
  'hidden.bs.collapse .panel': 'onCollapse',
  'show.bs.collapse .panel': 'onCollapse',
};
var menuMethods = {
    onCollapse (e) {
      let $elem = $(e.currentTarget);
      let $a = $elem.find('a.list-group-heading');
      let $icon = $a.find('.fa');
      if (e.type === 'show') {
        $a.addClass('active');
        $icon.removeClass('fa-angle-left').addClass('fa-angle-down');
      } else if (e.type === 'hidden') {
        $a.removeClass('active');
        $icon.removeClass('fa-angle-down').addClass('fa-angle-left');
      }
    },
};*/

module.exports = {
    introduction: Backbone.View.extend(_.extend(menuHelper.methods, yesNoHelper.methods, {
        urlRoot: Urls['campaign-list']() + '/general_information',

        events: _.extend({
            'submit form': 'submit',
            // 'click input[name=failed_to_comply]': 'onComplyChange',
            // 'click input:radio': 'onComplyChange',
        }, menuHelper.events, yesNoHelper.events),


        preinitialize() {
            // ToDo
            // Hack for undelegate previous events
            for(let k in this.events) {
                $('#content ' + k.split(' ')[1]).undelegate(); 
            }
        },

        // addSection: jsonActions.addSection,
        // deleteSection: jsonActions.deleteSection,
        getSuccessUrl() {
            // return  '/formc/team-members/' + this.model.get('id');
            return  '/formc/team-members/' + this.model.id;
        },
        // submit: app.defaultSaveActions.submit,
        // submit: api.submitAction,
        /*submit: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/team-members/' + this.model.id, {trigger: true});
        },*/

        submit(e) {
            var $target = $(e.target);
            var data = $target.serializeJSON();
            data.failed_to_comply = data.failed_to_comply === 'yes' ? $target.find('textarea').text() : '';
            api.submitAction.call(this, e, data);
        },

        initialize(options) {
            this.fields = options.fields;
            // this.model = options.model;
            // Get the type from here, i.e. director, officer, share holder
        },

        render() {
            let template = require('components/formc/templates/introduction.pug');

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model,
                    // values: this.model.toJSON(),
                })
            );
            return this;
        },

        // onComplyChange(e) {
        //     // let comply = this.$('input[name=failed_to_comply]:checked').val();
        //     let $target = $(e.target);
        //     let val = $target.val();
        //     let targetElem = $target.attr('target');
        //     // console.log(comply);
        //     // if (comply == 'no') {
        //     //     this.$('.explain textarea').text('');
        //     //     this.$('.explain').hide();
        //     // } else {
        //     //     this.$('.explain').show();
        //     // }
        //     if (val == 'no') {
        //         this.$(targetElem).hide();
        //     } else {
        //         this.$(targetElem).show();
        //     }
        // }

    })),

    teamMembers: Backbone.View.extend(_.extend(menuHelper.methods, {
        name: 'teamMembers',
        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        preinitialize() {
            // ToDo
            // Hack for undelegate previous events
            for(let k in this.events) {
                $('#content ' + k.split(' ')[1]).undelegate(); 
            }
        },

        // addSection: jsonActions.addSection,
        // deleteSection: jsonActions.deleteSection,
        getSuccessUrl() {
            // return  '/formc/use-of-proceeds/1' + this.model.get('id');
            return  '/formc/use-of-proceeds/1' + this.model.id;
        },
        // submit: app.defaultSaveActions.submit,
        // submit: api.submitAction,
        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            // app.routers.navigate('/formc/related-parties/' + this.model.id, {trigger: true});
            app.routers.navigate('/formc/' + this.model.id + '/related-parties', {trigger: true});
            // app.routers.navigate('/formc/use-of-proceeds/1', {trigger: true});
        },

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('components/formc/templates/teamMembers.pug');

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },

    })),

    teamMemberAdd: Backbone.View.extend(_.extend(addSectionHelper.methods, menuHelper.methods, {
        events: _.extend({
            'submit form': 'submit',
        }, addSectionHelper.events, menuHelper.events),
        urlRoot: serverUrl + 'xxxxx' + '/team_members',
        initialize(options) {
            this.fields = options.fields;
            this.type = options.type;
            // this.faqIndex = 1;
            /*if (this.type == 'director') {
                this.previous_positionsIndex = 1;
                this.experiencesIndex = 1;
            } else if (this.type == 'officer') {

            } else if (this.type == 'holder') {

            }*/
        },
        render() {
            let template;
            if (this.type == 'director' || this.type == 'officer') {
                this.fields.previous_positions.type = "position";
                this.fields.previous_positions.schema = {
                    position: {
                        type: 'string',
                        label: 'Position',
                    },
                    start_date: {
                        type: 'date',
                        label: 'Start Date of Service',
                    },
                    end_date_fo_service: {
                        type: 'date',
                        label: 'End Date of Service',
                    }
                };

                this.fields.experiences.type = "experience";
                this.fields.experiences.schema = {
                    employer: {
                        type: 'string',
                        label: 'Employer',
                    },
                    employer_principal: {
                        type: 'string',
                        label: "Employer's Principal Business",
                    },
                    title: {
                        type: 'string',
                        label: 'Title',
                    },
                    responsibilities: {
                        type: 'date',
                        label: 'Responsibilities',
                    },
                    start_date: {
                        type: 'date',
                        label: 'Start Date of Service',
                    },
                    end_date: {
                        type: 'date',
                        label: 'End Date of Service',
                    },
                };

                if (this.model.previous_positions) {
                  this.previous_positionsIndex = Object.keys(this.model.previous_positions).length;
                } else {
                  // this.previous_positionsIndex = 0;
                  this.previous_positionsIndex = 1;
                }

                if (this.model.experiences) {
                  this.experiencesIndex = Object.keys(this.model.experiences).length;
                } else {
                  // this.experiencesIndex = 0;
                  this.experiencesIndex = 1;
                }


                if (this.type == 'director')
                    template = require('components/formc/templates/teamMembersDirector.pug');
                else if (this.type == 'officer')
                    template = require('components/formc/templates/teamMembersOfficer.pug');

            } else if (this.type == 'holder') {
                template = require('components/formc/templates/teamMembersShareHolder.pug');

            }

            require('bootstrap-select/sass/bootstrap-select.scss');
            let selectPicker = require('bootstrap-select');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            this.$el.find('.selectpicker').selectpicker();

        },
        // addSection: jsonActions.addSection,
        // deleteSection: jsonActions.deleteSection,
        getSuccessUrl(data) {},
        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/team-members', {trigger: true});
        },
    })),

    offering: Backbone.View.extend(_.extend(addSectionHelper.methods, menuHelper.methods, {
        events: _.extend({
            'submit form': 'submit',
        }, addSectionHelper.events, menuHelper.events),

        preinitialize() {
            // ToDo
            // Hack for undelegate previous events
            for(let k in this.events) {
                $('#content ' + k.split(' ')[1]).undelegate(); 
            }
        },

        // addSection: jsonActions.addSection,
        // deleteSection: jsonActions.deleteSection,
        getSuccessUrl() {
            return  '/formc/offering/' + this.model.id;
        },
        // submit: app.defaultSaveActions.submit,
        submit: api.submitAction,

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('templates/formc/offering.pug');
            // let values = this.model.toJSON();
            let values = this.model;

            if (!Array.isArray(values.members)) {
                values.members = [];
            }

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    // values: this.model.toJSON(),
                    values: values,
                })
            );
            return this;
        },

    })),

    /*useOfProceeds: Backbone.View.extend({
        events: _.extend({
            'submit form': 'submit',
        }, jsonActions.events),

        preinitialize() {
            // ToDo
            // Hack for undelegate previous events
            for(let k in this.events) {
                $('#content ' + k.split(' ')[1]).undelegate(); 
                $('#content ' + k.split(' ')[1]).undelegate(); 
            }
        },

        addSection: jsonActions.addSection,
        deleteSection: jsonActions.deleteSection,
        getSuccessUrl() {
            return  '/formc/team-members/' + this.model.get('id');
        },
        // submit: app.defaultSaveActions.submit,
        submit: api.submitAction,

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('templates/formc/useofproceeds.pug');

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
    }),*/

    relatedParties: Backbone.View.extend(_.extend(addSectionHelper.methods, menuHelper.methods, yesNoHelper.methods, {
        name: 'relatedParties',
        initialize(options) {
            this.fields = options.fields;
        },

        events: _.extend({
            'submit form': 'submit',
            // 'click input[name=had_transactions]': 'onHadTransactionsChange',
        }, addSectionHelper.events, menuHelper.events, yesNoHelper.events),

        // addSection: jsonActions.addSection,
        // deleteSection: jsonActions.deleteSection,
        
        // onHadTransactionsChange(e) {
        //     let hadTransactions = this.$('input[name=had_transactions]:checked').val();

        //     if (hadTransactions == 'no') {
        //         this.$('.transactions-container').hide();
        //         // i'll need to take out transactions elements as well.
        //     } else {
        //         this.$('.transactions-container').show();
        //     }
        // },

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('formc/' + this.model.id + '/use-of-proceeds', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/relatedParties.pug');
            this.fields.transactions.type = 'json';
            this.fields.transactions.schema = {
                specified_person: {
                    type: 'string',
                    label: 'Specified Person',
                    placeholder: 'Specified Person',
                    values: [],
                },
                relationship_issuer: {
                    type: 'string',
                    label: 'Relationship to Issuer',
                    placeholder: 'Relationship Issuer',
                    values: [],
                },
                nature: {
                    type: 'string',
                    label: 'Nature of Interest in Transaction',
                    placeholder: 'Nature of Interest in Transaction',
                    values: [],
                },
                amount: {
                    type: 'number',
                    label: 'Amount of Interest',
                    placeholder: 'Amount of Interest',
                    values: [],
                },
            };

            if (this.model.transactions) {
              this.transactionsIndex = Object.keys(this.model.transactions).length;
            } else {
              this.transactionsIndex = 0;
            }

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    useOfProceeds: Backbone.View.extend(_.extend(addSectionHelper.methods, menuHelper.methods, {
    // useOfProceeds: Backbone.View.extend(_.extend(menuHelper.methods, {
       initialize(options) {
        this.fields = options.fields;
       },

        events: _.extend({
            'submit form': 'submit',
            'change input[type=radio][name=doc_type]': 'changeDocType',
        }, addSectionHelper.events, menuHelper.events),
        // }, menuHelper.events),
        
        changeDocType(e) {
            if (e.target.value == 'describe') {
                this.$('.describe').show();
                this.$('.doc').hide();
            } else if (e.target.value == 'doc') {
                this.$('.describe').hide();
                this.$('.doc').show();
            }
        },

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/risk-factors-instruction', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/useOfProceeds.pug');
        // this.fields['offering-expense'].type = 'row';

            if (this.model.faq) {
              // this.faqIndex = Object.keys(this.model.get('faq')).length;
              this.faqIndex = Object.keys(this.model.faq).length;
            } else {
              this.faqIndex = 0;
            }
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        }, 
    })),

    riskFactorsInstruction: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),
        
        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/risk-factors-market', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsInstructions.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    riskFactorsMarket: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
            'click form button.add-risk': 'addRisk',
        }, menuHelper.events),

        addRisk(e) {
            // collapse the risk text
            // add the text added to formc
        },

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/risk-factors-financial', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsMarket.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    riskFactorsFinancial: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/risk-factors-operational', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsFinancial.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    riskFactorsOperational: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.methods),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();

            app.routers.navigate('/formc/' + this.model.id + '/risk-factors-competitive', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsOperational.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    riskFactorsCompetitive: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/risk-factors-personnel', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsCompetitive.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),


    riskFactorsPersonnel: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/risk-factors-legal', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsPersonnel.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    riskFactorsLegal: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/'  + this.model.id + '/risk-factors-misc', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsLegal.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    riskFactorsMisc: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/financial-condition', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsMisc.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    financialCondition: Backbone.View.extend(_.extend(menuHelper.methods, yesNoHelper.methods, {
        initialize(options) {
            this.fields = options.fields;
        },

        events: _.extend({
            'submit form': 'submit',
            // 'click input[name=operating_history]': 'onOperatingHistoryChange',
            // 'click input[name=previous_security]': 'onPreviousSecurityChange',
        }, menuHelper.events, yesNoHelper.events),

        // onOperatingHistoryChange(e) {
        //     let operatingHistory = this.$('input[name=operating_history]:checked').val();

        //     if (operatingHistory == 'no') {
        //         this.$('.operating-history-container').hide();
        //     } else {
        //         this.$('.operating-history-container').show();
        //     }
        // },

        // onPreviousSecurityChange(e) {
        //     let previousSecurity = this.$('input[name=previous_security]:checked').val();

        //     if (previousSecurity == 'no') {
        //         this.$('.previous-security-container').hide();
        //     } else {
        //         this.$('.previous-security-container').show();
        //     }
        // },

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/outstanding-security', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/financialCondition.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    outstandingSecurity: Backbone.View.extend(_.extend(addSectionHelper.methods, menuHelper.methods, yesNoHelper.methods, {
        initialize(options) {
            this.fields = options.fields;
        },

        events: _.extend({
            'submit form': 'submit',
        }, addSectionHelper.events, menuHelper.events, yesNoHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/' + this.model.id + '/background-check', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/outstandingSecurity.pug');
            this.fields.loans.type = 'json';
            this.fields.loans.schema = {
                creditor: {
                    type: 'string',
                    label: 'Creditor',
                    placeholder: 'Creditor',
                    values: [],
                },
                outstanding: {
                    type: 'string',
                    label: 'Outstanding',
                    placeholder: 'Outstanding',
                    values: [],
                },
                rate: {
                    type: 'string',
                    label: 'Rate',
                    placeholder: 'Rate',
                    values: [],
                },
                date: {
                    type: 'date',
                    label: 'Date',
                    placeholder: 'Date',
                    values: [],
                },
                terms: {
                    type: 'string',
                    label: 'Terms',
                    placeholder: 'Terms',
                    values: [],
                },
            };
            this.fields.exempt_offerings.type = 'json';
            this.fields.exempt_offerings.schema = {
                date_offering: {
                    type: 'string',
                    label: 'Date Offering',
                    placeholder: 'Date Offering',
                    values: [],
                },
                exemption: {
                    type: 'string',
                    label: 'Date Offering',
                    placeholder: 'Date Offering',
                    values: [],
                },
                securities: {
                    type: 'string',
                    label: 'Securities',
                    placeholder: 'Securities',
                    values: [],
                },
                amount: {
                    type: 'number',
                    label: 'Amount',
                    placeholder: 'Amount',
                    values: [],
                },
                use: {
                    type: 'string',
                    label: 'Use',
                    placeholder: 'Use',
                    values: [],
                },
            };

            if (this.model.loans) {
              this.loansIndex = Object.keys(this.model.loans).length;
            } else {
              this.loansIndex = 0;
            }
            if (this.model.exempt_offerings) {
              this.exempt_offeringsIndex = Object.keys(this.model.exempt_offerings).length;
            } else {
              this.exempt_offeringsIndex = 0;
            }

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    backgroundCheck: Backbone.View.extend(_.extend(menuHelper.methods, yesNoHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events, yesNoHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/background-check/' + this.model.id, {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/backgroundCheck.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),
};
