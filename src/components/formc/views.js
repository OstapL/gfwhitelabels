"use strict";
let menuHelper = require('helpers/menuHelper.js');
let addSectionHelper = require('helpers/addSectionHelper.js');
let yesNoHelper = require('helpers/yesNoHelper.js');

module.exports = {
    introduction: Backbone.View.extend(_.extend({
        urlRoot: formcServer + '/:id' + '/introduction',

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events, yesNoHelper.events),


        preinitialize() {
            // ToDo
            // Hack for undelegate previous events
            for(let k in this.events) {
                $('#content ' + k.split(' ')[1]).undelegate(); 
            }
        },

        getSuccessUrl() {
          return  '/formc/' + this.model.id + '/team-members';
        },

        submit(e) {
            var $target = $(e.target);
            var data = $target.serializeJSON();
            // ToDo
            // Fix this
            if (data.failed_to_comply_choice == false) {
                data.failed_to_comply = 'Please explain.';
            }
            api.submitAction.call(this, e, data);
        },

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('components/formc/templates/introduction.pug');

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model,
                })
            );
            return this;
        },

    }, menuHelper.methods, yesNoHelper.methods)),

    teamMembers: Backbone.View.extend(_.extend({
        urlRoot: formcServer + '/:id' + '/team-members',
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

        getSuccessUrl() {
            return  '/formc/' + this.model.id + '/use-of-proceeds';
        },
        submit: api.submitAction,

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('components/formc/templates/teamMembers.pug');

            this.model.campaign = {id: 72};
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

    }, menuHelper.methods)),

    teamMemberAdd: Backbone.View.extend(_.extend({
        events: _.extend({
            'submit form': 'submit',
        }, addSectionHelper.events, menuHelper.events),
        urlRoot: formcServer + '/:id' + '/team_members',
        initialize(options) {
            this.fields = options.fields;
            this.role = options.role;
        },
        render() {
            let template;
            if (this.role == 'director' || this.role == 'officer') {
                /*
                this.fields.previous_positions.role = "position";
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
                */

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


                if (this.role == 'director')
                    template = require('components/formc/templates/teamMembersDirector.pug');
                else if (this.role == 'officer')
                    template = require('components/formc/templates/teamMembersOfficer.pug');

            } else if (this.role == 'holder') {
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
        getSuccessUrl(data) {},
        submit: api.submitAction,
    }, addSectionHelper.methods, menuHelper.methods)),

    offering: Backbone.View.extend(_.extend({
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

        getSuccessUrl() {
            return  '/formc/offering/' + this.model.id;
        },
        submit: api.submitAction,

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('templates/formc/offering.pug');
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

    }, addSectionHelper.methods, menuHelper.methods)),

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

    relatedParties: Backbone.View.extend(_.extend({
        urlRoot: formcServer + '/:id' + '/related-parties',
        name: 'relatedParties',
        initialize(options) {
            this.fields = options.fields;
        },

        events: _.extend({
            'submit form': 'submit',
        }, addSectionHelper.events, menuHelper.events, yesNoHelper.events),

        // submit: api.submitAction,
        submit(e) {
            var $target = $(e.target);
            var data = $target.serializeJSON({useIntKeysAsArrayIndex: true});

            if (data.had_transactions == 'false') data.transaction_with_related_parties = [];
            api.submitAction.call(this, e, data);
        },

        render() {
            let template = require('./templates/relatedParties.pug');

            if (this.model.transaction_with_related_parties) {
              this.transaction_with_related_partiesIndex = Object.keys(this.model.transaction_with_related_parties).length;
            } else {
              this.transaction_with_related_partiesIndex = 0;
            }
            this.fields.transaction_with_related_parties.schema.amount_of_interest.label = 'Amount of Interest';
            this.fields.transaction_with_related_parties.schema.nature_of_interest.label = 'Nature of Interst';
            this.fields.transaction_with_related_parties.schema.relationship_to_issuer.label = 'Relationship to Issuer';
            this.fields.transaction_with_related_parties.schema.specified_person.label = 'Specified Person';

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model,
                    addSectionHelper: addSectionHelper
                })
            );
            return this;
        },
    }, addSectionHelper.methods, menuHelper.methods, yesNoHelper.methods)),

    useOfProceeds: Backbone.View.extend(_.extend({
        urlRoot: 'https://api-formc.growthfountain.com/' + ':id' + '/use-of-proceeds',

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

        submit: api.submitAction,

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
    }, addSectionHelper.methods, menuHelper.methods)),

    riskFactorsInstruction: Backbone.View.extend(_.extend({
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit: api.submitAction,        

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
    }, menuHelper.methods)),

    riskFactorsMarket: Backbone.View.extend(_.extend({
        initialize(options) {
            this.fields = options.fields;
        },
        urlRoot: formcServer + '/:id' + '/risk-factors-market/1',
        events: _.extend({
            // 'submit form': 'submit',
            'click form button.add-risk': 'addRisk',
        }, menuHelper.events),

        addRisk(e) {
            event.preventDefault();
            // collapse the risk text
            // add the text added to formc
            // make the field uneditable
            let $form = $(e.target).parents('form');
            var data = $form.serializeJSON({useIntKeysAsArrayIndex: true});
            api.submitAction.call(this, e, data);
        },

        _success(){
            app.hideLoading();
            $(e.target).parents('form').find('textarea').attr('readonly', true);
            // change to text of button to delete
            // mark the risk saved
            // if delete, take it out again
        },

        submit: api.submitAction,

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
    }, menuHelper.methods)),

    riskFactorsFinancial: Backbone.View.extend(_.extend({
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit: api.submitAction,

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
    }, menuHelper.methods)),

    riskFactorsOperational: Backbone.View.extend(_.extend({
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.methods),

        submit: api.submitAction,

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
    }, menuHelper.methods)),

    riskFactorsCompetitive: Backbone.View.extend(_.extend({
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit: api.submitAction,

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
    }, menuHelper.methods)),


    riskFactorsPersonnel: Backbone.View.extend(_.extend({
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit: api.submitAction,

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
    }, menuHelper.methods)),

    riskFactorsLegal: Backbone.View.extend(_.extend({
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit: api.submitAction,

        render() {
            let template = require('components/formc/templates/riskFactorsLegal.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    values: this.model,
                })
            );
            return this;
        },
    }, menuHelper.methods)),

    riskFactorsMisc: Backbone.View.extend(_.extend({
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit: api.submitAction,

        render() {
            let template = require('components/formc/templates/riskFactorsMisc.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    values: this.model,
                })
            );
            return this;
        },
    }, menuHelper.methods)),

    financialCondition: Backbone.View.extend(_.extend({
        urlRoot: 'https://api-formc.growthfountain.com/' + ':id' + '/financial-condition',

        initialize(options) {
            this.fields = options.fields;
        },

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events, yesNoHelper.events),

        submit: api.submitAction,

        getSuccessUrl() {
            return  '/formc/' + this.model.id + '/outstanding-security';
        },

        render() {
            this.fields.sold_securities_data.schema.taxable_income.label = "Taxable Income";
            this.fields.sold_securities_data.schema.total_income.label = "Total Income";
            this.fields.sold_securities_data.schema.total_tax.label = "Total Tax";
            this.fields.sold_securities_data.schema.total_assets.label = "Total Assets";
            this.fields.sold_securities_data.schema.long_term_debt.label = "Long Term Debt";
            this.fields.sold_securities_data.schema.short_term_debt.label = "Short Term Debt";
            this.fields.sold_securities_data.schema.cost_of_goods_sold.label = "Cost of Goods Sold";
            this.fields.sold_securities_data.schema.account_receivable.label = "Account Receivable";
            this.fields.sold_securities_data.schema.cash_and_equivalents.label = "Cash Equivalents";
            this.fields.sold_securities_data.schema.revenues_sales.label = "Revenues Sales";
            let template = require('components/formc/templates/financialCondition.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model,
                })
            );
            return this;
        },
    }, menuHelper.methods, yesNoHelper.methods)),

    outstandingSecurity: Backbone.View.extend(_.extend({
        urlRoot: formcServer + '/:id' + '/outstanding-security',
        initialize(options) {
            this.fields = options.fields;
        },

        events: _.extend({
            'submit form': 'submit',
            'click button.save-outstanding': 'addOutstanding',
        }, addSectionHelper.events, menuHelper.events, yesNoHelper.events),

        // submit: api.submitAction,
        submit(e) {
            var $target = $(e.target);
            var data = $target.serializeJSON({useIntKeysAsArrayIndex: true});
            if (data.have_loans_debt == 'false') data.business_loans_or_debt = [];
            if (data.conduct_exempt_offerings == 'false') data.exempt_offering = [];
            if (!data.outstanding_securities) data.outstanding_securities = [];
            api.submitAction.call(this, e, data);
        },

        addOutstanding(e) {
            e.preventDefault();
        },

        getSuccessUrl() {
            return  '/formc/' + this.model.id + '/background-check';
        },

        render() {
            let template = require('components/formc/templates/outstandingSecurity.pug');

            if (this.model.business_loans_or_debt) {
              this.business_loans_or_debtIndex = Object.keys(this.model.business_loans_or_debt).length;
            } else {
              this.business_loans_or_debtIndex = 0;
            }
            if (this.model.exempt_offerings) {
              this.exempt_offeringsIndex = Object.keys(this.model.exempt_offerings).length;
            } else {
              this.exempt_offeringsIndex = 0;
            }

            this.fields.exempt_offering.schema.exemption_relied_upon.label = "Exemption Relied upon";
            this.fields.exempt_offering.schema.use_of_proceeds.label = "Use of Proceeds";
            this.fields.exempt_offering.schema.offering_date.label = "Date of The Offering";
            this.fields.exempt_offering.schema.amount_sold.label = "Amount Sold";
            this.fields.exempt_offering.schema.securities_offered.label = "Securities Offered";

            this.fields.business_loans_or_debt.schema.maturity_date.label = "Maturity Date";
            this.fields.business_loans_or_debt.schema.outstaind_amount.label = "Outstanding Date";
            this.fields.business_loans_or_debt.schema.interest_rate.label = "Interest Rate";
            this.fields.business_loans_or_debt.schema.other_material_terms.label = "Other Material Terms";
            this.fields.business_loans_or_debt.schema.creditor.label = "Creditor";

            this.fields.principal_shareholders_affect.label = 'How could the exercise of rights held by the principal shareholders affect the purchasers of the securities being offered?';
            this.fields.risks_to_purchasers.label = '';
            this.fields.terms_modified.label = 'How may the terms of the securities being offered be modified?';
            this.fields.security_differences.label = 'Are there any differences not reflected above between the securities being offered and each other class of security of the issuer?';
            this.fields.rights_of_securities_beign.label = 'How may the rights of the securities being offered be materially limited, diluted or qualified by the rights of any other class of security identified above?';

            this.fields.outstanding_securities.label = 'Outstanding Securities';


            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model,
                })
            );
            return this;
        },
    }, addSectionHelper.methods, menuHelper.methods, yesNoHelper.methods)),

    backgroundCheck: Backbone.View.extend(_.extend({
        urlRoot: formcServer + '/:id' + '/background-check',
        initialize(options) {
            this.fields = options.fields;
        },

        getSuccessUrl() {
          // return  '/formc/' + this.model.id + '/background-check';
          return  '/formc/' + this.model.id + '/outstanding-security';
        },

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events, yesNoHelper.events),

        submit: api.submitAction,

        render() {
            this.fields.company_or_director_subjected_to.label = 'If Yes, Explain';
            this.fields.descrption_material_information.label = "2) If you've provide any information in a format, media or other means not able to be reflected in text or pdf, please include here: (a) a description of the material content of such information; (b) a description of the format in which such disclosure is presented; and (c) in the case of disclosure in video, audio or other dynamic media or format, a transcript or description of such disclosure.";
            this.fields.material_information.label = '1) Such further material information, if any, as may be neessary to make the required statments, in the light of the cirsumstances under which they are made, not misleading.';
            let template = require('components/formc/templates/backgroundCheck.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model,
                })
            );
            return this;
        },
    }, menuHelper.methods, yesNoHelper.methods)),
};
