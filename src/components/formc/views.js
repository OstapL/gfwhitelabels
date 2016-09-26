"use strict";

var jsonActions = {
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
    introduction: Backbone.View.extend({
        events: _.extend({
            'submit form': 'submit',
            'click input[name=failed_to_comply]': 'onComplyChange',
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
        getSuccessUrl() {
            return  '/formc/team-members/' + this.model.get('id');
        },
        // submit: app.defaultSaveActions.submit,
        // submit: api.submitAction,
        submit: function (e) {
            e.preventDefault();
            // FixMe
            // make the index dynamic
            app.routers.navigate('/formc/team-members/1', {trigger: true});
        },

        initialize(options) {
            this.fields = options.fields;
            // this.model = options.model;
            // Get the type from here, i.e. director, officer, share holder
        },

        render() {
            // let template = require('templates/formc/introduction.pug');
            let template = require('components/formc/templates/introduction.pug');

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    // values: this.model,
                    values: this.model.toJSON(),
                })
            );
            return this;
        },

        onComplyChange(e) {
            let comply = this.$('input[name=failed_to_comply]:checked').val();
            // console.log(comply);
            if (comply == 'no') {
                this.$('.explain textarea').text('');
                this.$('.explain').hide();
            } else {
                this.$('.explain').show();
            }
        }

    }),

    teamMembers: Backbone.View.extend({
        events: _.extend({
            'submit form': 'submit',
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
        getSuccessUrl() {
            return  '/formc/use-of-proceeds/1' + this.model.get('id');
        },
        // submit: app.defaultSaveActions.submit,
        // submit: api.submitAction,
        submit(e) {
            e.preventDefault();
            app.routers.navigate('/formc/related-parties/1', {trigger: true});
            // app.routers.navigate('/formc/use-of-proceeds/1', {trigger: true});
        },

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            // let template = require('templates/formc/team-members.pug');
            let template = require('components/formc/templates/teamMembers.pug');

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model.toJSON(),
                    // values: this.model,
                })
            );
            return this;
        },

    }),

    teamMemberAdd: Backbone.View.extend({
        events: _.extend({
            'submit form': 'submit',
        }, jsonActions.events),
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

                if (this.model.get('previous_positions')) {
                  this.previous_positionsIndex = Object.keys(this.model.get('previous_positions')).length;
                } else {
                  this.previous_positionsIndex = 0;
                }

                if (this.model.get('experiences')) {
                  this.experiencesIndex = Object.keys(this.model.get('experiences')).length;
                } else {
                  this.experiencesIndex = 0;
                }


                if (this.type == 'director')
                    template = require('components/formc/templates/teamMembersDirector.pug');
                else if (this.type == 'officer')
                    template = require('components/formc/templates/teamMembersOfficer.pug');

            } else if (this.type == 'holder') {
                template = require('components/formc/templates/teamMembersShareHolder.pug');

            }

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    fields: this.fields,
                    values: this.model.toJSON(),
                })
            );
        },
        addSection: jsonActions.addSection,
        deleteSection: jsonActions.deleteSection,
        getSuccessUrl(data) {},
        submit(e) {
            e.preventDefault();
            // navigate back to general member page
            app.routers.navigate('/formc/team-members/1', {trigger: true});
        },
    }),

    offering: Backbone.View.extend({
        events: _.extend({
            'submit form': 'submit',
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
        getSuccessUrl() {
            return  '/formc/offering/' + this.model.get('id');
        },
        // submit: app.defaultSaveActions.submit,
        submit: api.submitAction,

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('templates/formc/offering.pug');
            let values = this.model.toJSON();

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

    }),

    useOfProceeds: Backbone.View.extend({
        events: _.extend({
            'submit form': 'submit',
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
    }),

    relatedParties: Backbone.View.extend({
        initialize(options) {
            this.fields = options.fields;
        },

        events: _.extend({
            'submit form': 'submit',
            'click input[name=had_transactions]': 'onHadTransactionsChange',
        }, jsonActions.events),

        addSection: jsonActions.addSection,
        deleteSection: jsonActions.deleteSection,
        
        onHadTransactionsChange(e) {
            let hadTransactions = this.$('input[name=had_transactions]:checked').val();

            if (hadTransactions == 'no') {
                this.$('.transactions-container').hide();
                // i'll need to take out transactions elements as well.
            } else {
                this.$('.transactions-container').show();
            }
        },

        submit(e) {
            e.preventDefault();
            app.routers.navigate('formc/use-of-proceeds/1', {trigger: true});
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

            if (this.model.get('transactions')) {
              this.transactionsIndex = Object.keys(this.model.get('transactions')).length;
            } else {
              this.transactionsIndex = 0;
            }

            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    values: this.model.toJSON(),
                })
            );
            return this;
        },
    }),

    useOfProceeds: Backbone.View.extend({
       initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, jsonActions.events),
        
        submit(e) {
            e.preventDefault();
            app.routers.navigate('/formc/risk-factors/1', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/useOfProceeds.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    values: this.model.toJSON(),
                })
            );
            return this;
        }, 
    }),

    riskFactors: Backbone.View.extend({
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, jsonActions.events),
        
        submit(e) {
            e.preventDefault();
            app.routers.navigate('/formc/financial-condition/1', {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/riskFactorsInstructions.pug');
            this.$el.html(
                template({
                    serverUrl: serverUrl,
                    Urls: Urls,
                    // fields: this.fields,
                    values: this.model.toJSON(),
                })
            );
            return this;
        },
    }),
};
