define(function () {
	return {
		campaignListSub: Backbone.View.extend({
			initialize: function (options) {
				this.collection = options.collection;
			},
			render: function() {
				this.$el.html('');
				let template = require('templates/campaignListSub.pug');
				this.$el.append(
                    template({
                        campaigns: this.collection.toJSON()
                    })
                );
                return this;
			}
		})
	};
});