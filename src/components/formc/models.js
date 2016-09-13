define(function() {
    let r = {
        model: Backbone.Model.extend({
            urlRoot: serverUrl + '/api/formc',
        }),

    };

    r.collection = Backbone.Collection.extend({
        model: r.model,
        url: serverUrl + '/api/formc'
    });

    return r;
});
