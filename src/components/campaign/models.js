import calcHelpers from '../../helpers/calculatorHelpers';
const formatPrice = calcHelpers.formatPrice;

define(function() {
    let r = {
        model: Backbone.Model.extend({
            urlRoot: serverUrl + '/api/campaign',

            // Helpers for getting values in human readable format
            get_human_number: function(value) {
                if(parseFloat(value) > 900000) {
                    return [parseFloat(value) / 1000000, 'Million']
                } else {
                    return [parseFloat(value) / 1000, 'Thousand']
                }
            },

            // will work for youtube only
            get_video_id: function() {
                if(self.video.count('=') > 0) {
                    //  in case if we have youtube.com?v=ID&key1=val1 link
                    return this.video.split('=')[1].split('=')[0]
                } else {
                    return ''
                }
            },
        }),
    };

    r.collection = Backbone.Collection.extend({
        model: r.model,
        url: serverUrl + '/api/campaign',
        showBeautifulPrice: function (number) {
            return formatPrice(number);
        },
    });

    return r;
});
