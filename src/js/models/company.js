define(function() {
    let r = {
        model: Backbone.Model.extend({
            urlRoot: serverUrl + '/api/company',
        }),
    };

    r.collection = Backbone.Collection.extend({
        model: r.model,
        url: serverUrl + '/api/company'
    });

    return r;
});
