"use strict";
let menuHelper = require('helpers/menuHelper.js');
let addSectionHelper = require('helpers/addSectionHelper.js');

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
    introduction: Backbone.View.extend(_.extend(menuHelper.methods, {
        events: _.extend({
            'submit form': 'submit',
            'click input[name=failed_to_comply]': 'onComplyChange',
        }, menuHelper.events),

        // onCollapse: menuActions.onCollapse,

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
        submit: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            // FixMe
            // make the index dynamic
            app.routers.navigate('/formc/team-members/' + this.model.id, {trigger: true});
        },

        initialize(options) {
            this.fields = options.fields;
            // this.model = options.model;
            // Get the type from here, i.e. director, officer, share holder
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
            // let template = require('templates/formc/introduction.pug');
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
            app.routers.navigate('/formc/related-parties/' + this.model.id, {trigger: true});
            // app.routers.navigate('/formc/use-of-proceeds/1', {trigger: true});
        },

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
            // let template = require('templates/formc/team-members.pug');
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
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
                  this.previous_positionsIndex = 0;
                }

                if (this.model.experiences) {
                  this.experiencesIndex = Object.keys(this.model.experiences).length;
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
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
        },
        // addSection: jsonActions.addSection,
        // deleteSection: jsonActions.deleteSection,
        getSuccessUrl(data) {},
        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            // navigate back to general member page
            app.routers.navigate('/formc/team-members/' + this.model.id, {trigger: true});
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
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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

    relatedParties: Backbone.View.extend(_.extend(addSectionHelper.methods, menuHelper.methods, {
        name: 'relatedParties',
        initialize(options) {
            this.fields = options.fields;
        },

        events: _.extend({
            'submit form': 'submit',
            'click input[name=had_transactions]': 'onHadTransactionsChange',
        }, addSectionHelper.events, menuHelper.events),

        // addSection: jsonActions.addSection,
        // deleteSection: jsonActions.deleteSection,
        
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
            e.stopPropagation();
            this.undelegateEvents();

            app.routers.navigate('formc/use-of-proceeds/' + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
                    // fields: this.fields,
                    // values: this.model.toJSON(),
                    values: this.model,
                })
            );
            return this;
        },
    })),

    useOfProceeds: Backbone.View.extend(_.extend(addSectionHelper.methods, menuHelper.methods, {
       initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, addSectionHelper.events, menuHelper.events),
        
        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            // app.routers.navigate('/formc/risk-factors/instruction/' + this.model.id, {trigger: true});
            app.routers.navigate('/formc/risk-factors-instruction/' + this.model.id, {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/useOfProceeds.pug');
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
            this.undelegateEvents();
            // e.stopPropagation();
            // app.routers.navigate('/formc/risk-factors/' + this.model.id + '/market', {trigger: true});
            // app.routers.navigate('/formc/risk-factors/market/' + this.model.id, {trigger: true});
            app.routers.navigate('/formc/risk-factors-market/' + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
        }, menuHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            // app.routers.navigate('/formc/risk-factors/' + this.model.id + '/financial', {trigger: true});
            // app.routers.navigate('/formc/risk-factors/financial/' + this.model.id, {trigger: true});
            app.routers.navigate('/formc/risk-factors-financial/' + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
            // app.routers.navigate('/formc/risk-factors/'  + this.model.id + '/operational', {trigger: true});
            // app.routers.navigate('/formc/risk-factors/operational/'  + this.model.id, {trigger: true});
            app.routers.navigate('/formc/risk-factors-operational/'  + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
            // app.routers.navigate('/formc/risk-factors/' + this.model.id + '/competitive', {trigger: true});
            // app.routers.navigate('/formc/risk-factors/competitive/' + this.model.id, {trigger: true});
            this.undelegateEvents();

            app.routers.navigate('/formc/risk-factors-competitive/' + this.model.id, {trigger: true});
            // app.routers.navigate('/formc/risk-factors-competitive/107', {trigger: true});
            // debugger
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
            // app.routers.navigate('/formc/risk-factors/' + this.model.id + '/personnel', {trigger: true});
            // app.routers.navigate('/formc/risk-factors/personnel/' + this.model.id, {trigger: true});
            app.routers.navigate('/formc/risk-factors-personnel/' + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
            // app.routers.navigate('/formc/risk-factors/' + this.model.id + '/legal', {trigger: true});
            // app.routers.navigate('/formc/risk-factors/legal/' + this.model.id, {trigger: true});
            app.routers.navigate('/formc/risk-factors-legal/' + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
            // app.routers.navigate('/formc/risk-factors/' + this.model.id + '/misc', {trigger: true});
            // app.routers.navigate('/formc/risk-factors/misc/' + this.model.id, {trigger: true});
            app.routers.navigate('/formc/risk-factors-misc/' + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
            app.routers.navigate('/formc/financial-condition/' + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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

    financialCondition: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/outstanding-security/' + this.model.id, {trigger: true});
        },

        render() {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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

    outstandingSecurity: Backbone.View.extend(_.extend(addSectionHelper.methods, menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, addSectionHelper.events, menuHelper.events),

        submit(e) {
            e.preventDefault();
            e.stopPropagation();
            this.undelegateEvents();
            app.routers.navigate('/formc/background-check/' + this.model.id, {trigger: true});
        },

        render() {
            let template = require('components/formc/templates/outstandingSecurity.pug');
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

    backgroundCheck: Backbone.View.extend(_.extend(menuHelper.methods, {
        initialize(options) {},

        events: _.extend({
            'submit form': 'submit',
        }, menuHelper.events),

        submit(e) {
            // app.currentView && app.currentView.remove();
            // app.currentView == this;
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
