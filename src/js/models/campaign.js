var calculatorHelper = require("../helpers/calculatorHelpers");
var formatPrice = calculatorHelper.formatPrice;

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

            showBeautifulNumber: function (number) {
                return formatPrice(number);
            },

            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

            formatDate: function (dateStr) {
                var strs = dateStr.split("-");
                var monthIndex = parseInt(strs[1]) - 1;
                // return strs[1] + "-" + strs[0];
                return this.months[monthIndex] + " " + strs[0];
            },

            calculateRaisedPercentage: function (minimum_raise, amount_raised) {
                var percentage_raised = Math.round(amount_raised / minimum_raise * 100);
                if (percentage_raised < 20) percentage_raised = 20;
                return percentage_raised;
            }
        
        }),

    };

    r.collection = Backbone.Collection.extend({
        model: r.model,
        url: serverUrl + '/api/campaign',
        showBeautifulNumber: function (number) {
            return formatPrice(number);
        },
    });

    return r;
});
