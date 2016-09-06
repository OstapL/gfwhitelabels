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
        submit: app.defaultSaveActions.submit,

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('templates/formc/introduction.pug');

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
            return  '/formc/related-parties/' + this.model.get('id');
        },
        submit: app.defaultSaveActions.submit,

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('templates/formc/team-members.pug');

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
        submit: app.defaultSaveActions.submit,

        initialize(options) {
            this.fields = options.fields;
        },

        render() {
            let template = require('templates/formc/offering.pug');

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
        submit: app.defaultSaveActions.submit,

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
};
