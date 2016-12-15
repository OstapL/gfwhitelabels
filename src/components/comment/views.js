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
      'click .ask-question': 'submitQuestion',
      'click .link-response-count': 'showHideResponses',
      'click .link-reply': 'replyTo',
      'click .link-like': 'likeComment',
      'click .submit-comment': 'submitComment',
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
      let data = {
        parent_id: $comment.data('id'),
        message: $target.closest('.reply-block').find('textarea').val(),
      };

      api.makeRequest(this.urlRoot, 'POST', data).done((newData) => {
        let commentStub = $comment.find('#comment_empty_' + $comment.data('level' + 1))
        let newComment = commentStub.clone();

        newComment.attr('id', newData.new_message_id);
        newComment.removeClass('collapse');
        newComment.find('.date-comments').text((new Date()).toLocaleDateString());
        newComment.find('p').text(data.message);
        newComment.find('.link-response-count').text('0&nbsp;')

      }).fail((err) => {
        alert(err);
      });




      // var data = $(e.target).serializeJSON();
      // let model = new Backbone.Model();
      // model.urlRoot = serverUrl + Urls['comment-list']();
      // data['company'] = this.model.company.id;
      // model.set(data)
      // if (model.isValid(true)) {
      //   model.save().
      //   then((data) => {
      //     this.$el.find('.alert-warning').remove();
      //     this._commentSuccess(data);
      //   }).
      //   fail((xhr, status, text) => {
      //     api.errorAction(this, xhr, status, text, this.fields);
      //   });
      // } else {
      //   if (this.$('.alert').length) {
      //     $('#content').scrollTo();
      //   } else {
      //     this.$el.find('.has-error').scrollTo();
      //   }
      // }
    },

    _commentSuccess(data) {
      this._success = null;
      this.urlRoot = null;
      if (data.parent) {
        $('#comment_' + data.parent).after(
          new this.commentView.detail().getHtml({
            model: data,
            company: this.model.company,
            app: app,
          })
        );
      } else {
        $('#comment_' + data.parent).html(
          new this.commentView.detail().getHtml({
            company: this.model.company,
            model: data,
            app: app,
          })
        );
      }

      this.$el.find('.comment-form-div').remove();
      app.hideLoading();
      app.showLoading = this._showLoading;
    },

    submitQuestion(e) {

    },

    replyTo(e) {
      e.preventDefault();

      this.$el.find('.reply-block').appendTo($(e.target).closest('.comment')).removeClass('collapse');

      return false;
    },

    showHideResponses(e) {
      e.preventDefault();

      $(e.target).closest('.comment').find('.comment').first().toggleClass('collapse');

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
