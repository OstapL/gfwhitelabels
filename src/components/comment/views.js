function countChildComments(comment) {
  let cnt = comment.children.length;
  (comment.children || []).forEach((childComment) => {
    cnt += countChildComments(childComment);
  });
  comment.count = cnt;
  return cnt;
};

function findComment(comments, uid) {
  for (let idx = 0; idx < comments.length; idx += 1) {
    let c = comments[idx];
    if (c.uid == uid)
      return c;

    let found = findComment(c.children, uid);
    if (found)
      return found;
  }

  return null;
}

module.exports = {
  comments: Backbone.View.extend(Object.assign({
    urlRoot: app.config.commentsServer + '/:model/:id',
    template: require('./templates/comments.pug'),
    el: '.comments-container',
    events: Object.assign({
      'keydown .text-body': 'keydownHandler',
      'keyup .text-body': 'keyupHandler',
      'click .ask-question, .submit-comment': 'submitComment',
      'click .cancel-comment': 'cancelComment',
      'click .link-response-count': 'showHideResponses',
      'click .link-reply': 'showReplyTo',
      'click .link-like': 'likeComment',
      'click .link-edit': 'editComment',
      'click .link-delete': 'deleteComment',
    }, app.helpers.yesNo.events),

    initialize(options) {
      this.fields = options.fields;
      this.fields.message = Object.assign(this.fields.message, {
        fn: function (name, value, attr, data, schema) {
          if (value.length > 2000)
            throw 'Length of comment should not exceed more than 2000 characters.';
        },
      });

      this.readonly = options.readonly;
      this.allowQuestion = app.utils.isBoolean(options.allowQuestion) ? options.allowQuestion : true;
      this.allowResponse = app.utils.isBoolean(options.allowResponse) ? options.allowResponse : true;
      this.cssClass = app.utils.isString(options.cssClass) && options.cssClass ? options.cssClass : '';

      this.urlRoot = this.urlRoot.replace(':model', 'company').replace(':id', this.model.id);

      this.userRole = 0;
      (app.user.companiesMember || []).forEach((company) => {
        if (company.company_id == this.model.id)
          this.userRole = company.role;
      });

      //init count
      (this.model.data || []).forEach((c) => {
        countChildComments(c);
      });

      this.snippets = {
        related: require('./templates/snippets/related.pug'),
        add: require('./templates/snippets/add.pug'),
        edit: require('./templates/snippets/edit.pug'),
        comment: require('./templates/comment.pug'),
      };
    },

    findRootComment(uid) {
      for (let i = 0; i < this.model.data.length; i += 1) {
        let comment = this.model.data[i];

        if (comment.uid == uid)
          return comment;

        let found = findComment(comment.children, uid);
        if (found)
          return comment;
      }

      return null;
    },

    getComment(uid) {

      function findComment(comments, uid) {
        for (let idx = 0; idx < comments.length; idx += 1) {
          let c = comments[idx];
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
        owner_id: this.model.owner_id,
        company_id: this.model.id,
        attr: {
          readonly: this.readonly,
          allowQuestion: this.allowQuestion,
          allowResponse: this.allowResponse,
          cssClass: this.cssClass,
        },
        fields: this.fields,
        userRole: this.userRole,
        snippets: this.snippets,
      }));

      return this;
    },

    keydownHandler(e) {
      let $target = $(e.target);

      switch (e.which) {
        case 13:
          return $target.is('input')
            ? this.submitComment(e)
            : void(0);
        case 27:
          return $target.is('textarea')
            ? this.cancelComment(e)
            : void(0);
        default:
          return;
      }
    },

    resizeArea() {
      setTimeout(() => {
        var area = this.el.querySelector('.text-body');
        var topButtonPosition = this.el.querySelector('.topButtonPosition');
        if (!area)
          return;
        area.style.height = 'auto';
        area.style.height = area.scrollHeight + 'px';
        topButtonPosition.style.top = (area.scrollHeight - 37) + 'px';
      }, 0);
    },

    ensureRelatedRolesBlock(e) {
      if (this.userRole)
        return;

      let $target = $(e.target);
      let $form = $target.closest('form');
      let $relatedBlock = $form.find('.related-role');

      let hasRelatedBlock = $relatedBlock && $relatedBlock.length;
      if ($target.val()) {
        if (hasRelatedBlock)
          return;

        $relatedBlock = $(this.snippets.related());
        $target.parent().after($relatedBlock);
        $relatedBlock.show();
      } else {
        if (!hasRelatedBlock)
          return;
        $relatedBlock.remove();
      }
    },

    keyupHandler(e) {
      this.resizeArea(e);
      this.ensureRelatedRolesBlock(e);
    },

    submitComment(e) {
      e.preventDefault();

      if (this.readonly)
        return false;

      if (!app.user.ensureLoggedIn(window.location.pathname))
        return false;

      let $target = $(e.target);
      let $parentComment = $target.closest('.single-comment');
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

      let relatedCb = $form.find('.related-cb');
      if (relatedCb.is(':checked')) {
        let relatedRole = $form.find('input[name=related]:checked').val();
        if (!relatedRole) {
          this.invalidMsg('related', ['Please, select role.'], $form);
          $target.prop('disabled', false);
          return;
        }

        data.related = relatedRole;
      }

      if (!app.validation.validate(this.fields, data)) {
        Object.keys(app.validation.errors).forEach((key) => {
          const errors = app.validation.errors[key];
          this.invalidMsg(key, errors, $form);
        });
        $target.prop('disabled', false);

        // this.$('.help-block').prev().scrollTo(5);
        return false;
      }

      app.showLoading();
      api.makeRequest(this.urlRoot, 'POST', data).done((newData) => {
        $target.prop('disabled', false);

        let newCommentModel = {
          related: data.related,
          children: [],
          message: message,
          uid: newData.new_message_id,
          created_date: app.helpers.date.nowAsString(),
          user: {
            first_name: app.user.first_name,
            last_name: app.user.last_name,
            image_data: app.user.get('image_data'),
            role: this.userRole,
          },
        };

        if (isChild) {
          $form.remove();
          let parentComment = this.getComment(parentId);
          if (parentComment) {
            parentComment.children.push(newCommentModel);

            let rootComment = this.findRootComment(parentId);
            if (rootComment) {
              countChildComments(rootComment);

              //update root comment response count
              let $rootComment = this.$(`#comment${rootComment.uid}`);
              $rootComment.find('.comment-actions:first .link-response-count > .count')
                .text(rootComment.count);
            }
          }
        } else {
          this.model.data.push(newCommentModel);
          $form.find('.text-body').val('');
          this.keyupHandler(e);//remove related role checkbox
        }

        let newCommentHtml = this.snippets.comment({
          comment: newCommentModel,
          snippets: this.snippets,
          attr: {
            owner_id: this.model.owner_id,
            company_id: this.model.id,
          },
          level: level,
        });

        let $newComment = $(newCommentHtml);

        if (isChild) {
          let $childComments = $parentComment.find('.multilevel-comments:first');
          $newComment.appendTo($childComments);
          if ($childComments.hasClass('collapse')) $childComments.removeClass('collapse');
        } else {
          let $commentsContainer = this.$('.comments');
          $newComment.appendTo($commentsContainer);
        }

        app.hideLoading();
      }).fail((err) => {
        $target.prop('disabled', false);
        app.hideLoading();
        app.dialogs.error(err);
      });
    },

    cancelComment(e) {
      e.preventDefault();

      let $target = $(e.target);

      //escape pressed on input with ask question
      if ($target.is('input'))
        return false;

      $target.closest('form').remove();

      return false;
    },

    showReplyTo(e) {
      e.preventDefault();
      if (this.readonly)
        return false;

      let $commentBlock = $(e.target).closest('.single-comment');

      let $newCommentBlock = $commentBlock.find('.comment-form');
      if ($newCommentBlock && $newCommentBlock.length)
        return false;

      $newCommentBlock = $(this.snippets.edit());
      $newCommentBlock.appendTo($commentBlock);
      $newCommentBlock.find('.text-body').focus();

      return false;
    },

    showHideResponses(e) {
      e.preventDefault();
      let $link = $(e.target).closest('.link-response-count');
      $link.closest('.single-comment').find('.multilevel-comments').toggleClass('collapse');
      let $icon = $link.find('.fa');
      if ($icon.hasClass('fa-angle-up'))
        $icon.removeClass('fa-angle-up').addClass('fa-angle-down');
      else
        $icon.removeClass('fa-angle-down').addClass('fa-angle-up');

      return false;
    },

    likeComment(e) {
      e.preventDefault();
      console.log('Likes are not implemented');
      return false;
    },

    editComment(e) {
      e.preventDefault();

      return false;
    },

    deleteComment(e) {
      e.preventDefault();

      return false;
    },

    invalidMsg(name, errors, form) {
      errors = errors.join(', ');
      let el = form.find(`[name=${name}]`);
      if (el.length) {
        let group = el.closest('.field-' + name);
        group = group.length ? group : el.parent();
        group.addClass('has-error');

        let errorBlock = group.find('.help-block');
        if (errorBlock.length)
          errorBlock.html(errors);
        else
          group.append(`<div class="help-block">${errors}</div>`);

        return;
      }

      //show general error
      let errorBlock = form.find('.alert-warning');

      if (errorBlock.length)
        errorBlock.html(errors);
      else
        this.$el.prepend(
          '<div class="alert alert-warning" role="alert"><p>' + errors + '</p></div>'
        );
    },

  }, app.helpers.yesNo.methods)),
};
