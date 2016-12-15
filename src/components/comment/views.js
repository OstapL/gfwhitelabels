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
      'click .cancel-comment': 'cancelComment',
      'click .link-response-count': 'showHideResponses',
      'click .link-reply': 'showReplyTo',
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

      this.$stubs = this.$('.stubs');

      return this;
    },

    submitComment(e) {
      e.preventDefault();

      let $target = $(e.target);

      let $parentComment = $target.closest('.comment');

      let isChild = $parentComment && $parentComment.length;

      let parentId = isChild ? $parentComment.data('id') : null;
      let level = isChild ? ($parentComment.data('level') + 1) : 0;

      let $form = $target.closest('form');

      let message = $form.find('.text-body').val();

      if (!message)
        return;

      $target.prop('disabled', true);

      let data = {
        parent_id: parentId,
        message: message,
      };

      // app.showLoading();
      // api.makeRequest(this.urlRoot, 'POST', data).done((newData) => {
      setTimeout(() => {

        if (isChild)
          $form.remove();
        else
          $form.find('.text-body').val('');

        let commentStub = this.$stubs.find('.comment[data-level=' + level + ']');

        let newComment = commentStub.clone();

        // newComment.attr('id', newData.new_message_id);
        newComment.removeClass('collapse');
        newComment.find('.date-comments').text((new Date()).toLocaleDateString());
        newComment.find('p').text(data.message);

        //TODO: update parent comment response count
        newComment.find('.link-response-count').text('0')

        newComment.appendTo(isChild ? $parentComment : this.$('.comments'));
        // app.hideLoading();
      }, 500);
      // }).fail((err) => {
      //   app.hideLoading();
      //   alert(err);
      // });
    },

    cancelComment(e) {
      e.preventDefault();

      let $form = $(e.target).closest('form');
      if (!$form.hasClass('new-comment'))
        $form.remove();

      return false;
    },

    showReplyTo(e) {
      e.preventDefault();

      let $newCommentBlock = this.$stubs.find('.new-comment').clone();

      $newCommentBlock.removeClass('new-comment collapse');

      $newCommentBlock.appendTo($(e.target).closest('.comment'));

      $newCommentBlock.find('.text-body').focus();

      return false;
    },

    showHideResponses(e) {
      e.preventDefault();

      let $link = $(e.target).closest('.link-response-count');

      $link.closest('.comment').find('.comment').toggleClass('collapse');

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
