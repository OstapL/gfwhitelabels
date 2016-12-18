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
      'click .link-edit': 'editComment',
      'click .link-delete': 'deleteComment',
    },

    initialize(options) {
      this.fields = options.fields;
      this.urlRoot = this.urlRoot.replace(':model', 'company').replace(':id', this.model.id);
    },

    getComment(uid) {

      function findComment(comments, uid) {
        for(let c in comments) {
          if (c.uid == uid)
            return c;

          let found = findComment(c.children, uid);
          if (found)
            return found;
        }

        return null;
      }

      return findComment(this.model.data, uid);
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

      let parentId = isChild ? $parentComment.data('id') : '';
      let level = isChild ? ($parentComment.data('level') + 1) : 0;

      let $form = $target.closest('form');

      let message = $form.find('.text-body').val();

      if (!message)
        return;

      $target.prop('disabled', true);

      let data = {
        parent_id: parentId,
        message: message,
        model_id: this.model.id,
        model_name: 'company',
      };

      app.showLoading();
      api.makeRequest(this.urlRoot, 'POST', data).done((newData) => {
      // setTimeout(() => {
        $target.prop('disabled', false);

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
        newComment.find('.link-response-count').text('0');

        newComment.appendTo(isChild ? $parentComment : this.$('.comments'));
        app.hideLoading();
      // }, 500);
      }).fail((err) => {
        $target.prop('disabled', false);
        app.hideLoading();
        alert(err);
      });
    },

    cancelComment(e) {
      e.preventDefault();

      let $form = $(e.target).closest('form');
      if (!$form.hasClass('edit-comment'))
        $form.remove();

      return false;
    },

    showReplyTo(e) {
      e.preventDefault();

      let $newCommentBlock = this.$stubs.find('.edit-comment').clone();

      $newCommentBlock.removeClass('edit-comment collapse');

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

    editComment(e) {
      e.preventDefault();

      let $target = $(e.target);

      let $comment = $target.closest('.comment');
      let level = $comment.data('level');
      let uid = $comment.data('id');

      let comment = this.findComment(uid);
      let commentText = comment.message;

      // let $editCommentBlock = this.$stubs.find('.edit-comment').clone();
      // $editCommentBlock.removeClass('edit-comment collapse');
      // $editCommentBlock.find('.text-body')
      //
      // $comment.find('p').text().addClass('collapse').after($editCommentBlock);


      return false;
    },

    deleteComment(e) {
      e.preventDefault();



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
