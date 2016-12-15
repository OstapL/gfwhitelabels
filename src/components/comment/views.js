module.exports = { 
  form: Backbone.View.extend({
    template: require('./templates/form.pug'),

    getHtml(data) {
      return this.template(data)
    },

    render() {
      this.$el.html(
        this.template({model: this.model})
      )
    },

  }),

  list: Backbone.View.extend({
    template: require('./templates/list.pug'),

    render() {
      this.$el.html(
        this.template({
          app: app,
          company: this.model,
          comments: this.collection,
        })
      )
      return this;
    },

  }),

  detail: Backbone.View.extend({
    template: require('./templates/detail.pug'),

    events: {

    },

    initialize(options) {

    },

    getHtml(data) {
      return this.template(data)
    },

    render() {
      this.$el.html(
        this.template({
          model: this.model,
          app: app,
        })
      );

      return this;
    },

  }),


  comments: Backbone.View.extend({
    urlRoot: commentsServer + '/:model/:id',
    template: require('./templates/comments.pug'),
    el: '.comments-container',
    events: {
      'click .ask-question, .submit-comment': 'submitComment',
      'click .link-response-count': 'showHideResponses',
      'click .link-reply': 'replyTo',
      'click .link-like': 'likeComment',
    },

    initialize(options) {
      this.fields = options.fields;
      this.urlRoot = this.urlRoot.replace(':model', 'company').replace(':id', this.model.id);
    },

    render() {
      this.$el.html(this.template({
        comments: this.model.data,
        company: {
          owner: 1,
        },
        users: {
          1: 'Vladimir Chagin',
        }
      }));

      return this;
    },

    submitComment(e) {
      e.preventDefault();

      let $target = $(e.target);
      let $comment = $target.closest('.comment');

      let parentId = $comment && $comment.length ? $comment.data('id') : null;
      let message = $target.closest('.comment-form').find('.text-body').val();

      let data = {
        parent_id: parentId,
        message: message,
      };

      // app.showLoading();
      // api.makeRequest(this.urlRoot, 'POST', data).done((newData) => {
      setTimeout(() => {

        //TODO: hide new comment form
        this.$el.find('.new-comment').addClass('collapse');

        let commentStub = parentId == null
          ? this.$('.comments').find('#comment_empty_0')
          : this.$('.comments').find('#comment_empty_' + $comment.data('level'));

        let newComment = commentStub.clone();

        // newComment.attr('id', newData.new_message_id);
        newComment.removeClass('collapse');
        newComment.find('.date-comments').text((new Date()).toLocaleDateString());
        newComment.find('p').text(data.message);

        //TODO: update parent comment response count
        newComment.find('.link-response-count').text('0')

        newComment.appendTo(this.$('.comments'));
        // app.hideLoading();
      }, 500);
      // }).fail((err) => {
      //   app.hideLoading();
      //   alert(err);
      // });
    },


    replyTo(e) {
      e.preventDefault();

      this.$el.find('.new-comment').appendTo($(e.target).closest('.comment')).removeClass('collapse');

      return false;
    },

    showHideResponses(e) {
      e.preventDefault();

      let $link = $(e.target).closest('.link-response-count');

      $link.closest('.comment').find('.comment:first').toggleClass('collapse');

      let $icon = $link.find('.fa');
      if ($icon.hasClass('fa-angle-up'))
        $icon.removeClass('fa-angle-up').addClass('fa-angle-down');
      else
        $icon.removeClass('fa-angle-down').addClass('fa-angle-up');

      return false;
    },

    likeComment(e) {
      e.preventDefault();

      console.log('Likes are not implemented')

      return false;
    },

    checkResponse(e) {
        e.preventDefault();
        this.$el.find('.comment-form-div').remove();
        var $el = $(e.currentTarget);
        $el.parents('.comment').after(
            new this.commentView.form({
            }).getHtml({
                model: {parent: e.currentTarget.dataset.id},
                company: this.model.company,
                app: app,
            })
        );
    },

  }),
};
