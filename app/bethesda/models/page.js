define(function() {
    let r = {
        model: Backbone.Model.extend({
            urlRoot: serverUrl + '/api/page',
        }),
    };

    r.collection = Backbone.Collection.extend({
        model: r.model,
        url: serverUrl + '/api/page'
    });

    return r;
});
