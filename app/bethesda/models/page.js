define(function() {
    let r = {
        model: Backbone.Model.extend({
            urlRoot: serverUrl + '/api/pages/',
        }),
    };

    r.collection = Backbone.Collection.extend({
        model: r.model,
    });

    return r;
});
