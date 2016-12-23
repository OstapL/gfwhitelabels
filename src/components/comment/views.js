const helpers = {
  date: require('helpers/dateHelper.js'),
};

const yesNoHelper = require('helpers/yesNoHelper.js');
// const validation = require('componenets/validation/validation.js');

function initDates(c) {
  c.created_date = new Date(c.created_date);
  _.each(c.children, (ch) => {
    initDates(ch);
  });
};

module.exports = {
  comments: Backbone.View.extend(_.extend({
    urlRoot: commentsServer + '/:model/:id',
    template: require('./templates/comments.pug'),
    el: '.comments-container',
    events: _.extend({
      'keydown .text-body': 'keydownHandler',
      'keyup .text-body': 'keyupHandler',
      'click .ask-question, .submit-comment': 'submitComment',
      'click .cancel-comment': 'cancelComment',
      'click .link-response-count': 'showHideResponses',
      'click .link-reply': 'showReplyTo',
      'click .link-like': 'likeComment',
      'click .link-edit': 'editComment',
      'click .link-delete': 'deleteComment',
    }, yesNoHelper.events),

    initialize(options) {
      this.fields = options.fields;
      this.urlRoot = this.urlRoot.replace(':model', 'company').replace(':id', this.model.id);
      //init dates
      _.each(this.model.data, (c) => {
        initDates(c);
      });
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
        helpers: helpers,
        owner_id: this.model.owner_id,
        company_id: this.model.id,
      }));

      this.$stubs = this.$('.stubs');

      return this;
    },

    keydownHandler(e) {
      let $target = $(e.target);

      switch(e.which) {
        case 13: {
          return $target.is('input')
            ? this.submitComment(e)
            : void(0);
        }
        case 27: {
          return $target.is('textarea')
            ? this.cancelComment(e)
            : void(0);
        }
        default: {
          break;
        }
      }
    },

    keyupHandler(e) {
      if (this.isRelatedToCompany)
        return;

      let $target = $(e.target);
      let $form = $target.closest('form');
      let $relatedBlock = $form.find('.related-role');

      let hasRelatedBlock = $relatedBlock && $relatedBlock.length;
      if ($target.val()) {
        if (hasRelatedBlock)
          return;

        $relatedBlock = this.$stubs.find('.related-role').clone();
        //$form.append($relatedBlock);
        $target.after($relatedBlock);
        $relatedBlock.show();
      } else {
        if(!hasRelatedBlock)
          return;
        $relatedBlock.remove();
      }

    },

    _ensureUserLoggedIn(e) {
      if (app.user.is_anonymous()) {
        const pView = require('components/anonymousAccount/views.js');
        require.ensure([], function() {
          new pView.popupLogin().render(window.location.pathname);
          app.hideLoading();
          $('#sign_up').modal();
        });
        return false;
      }

      return true;
    },

    submitComment(e) {
      e.preventDefault();

      if (!this._ensureUserLoggedIn(e))
        return false;

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

      let relatedCb = $form.find('.related-cb');
      if (relatedCb.is(':checked')) {
        let relatedRole = $form.find('input[name=related]:checked').val();
        if (!relatedRole) {
          // validation.invalidMsg(this, );
          alert('Please, select role');
          return;
        }
        data.related = relatedRole;
      }

      app.showLoading();
      api.makeRequest(this.urlRoot, 'POST', data).done((newData) => {
        $target.prop('disabled', false);
        let role = app.user.get('role');

        let newCommentModel = {
          related: data.related,
          children: [],
          message: message,
          uid: newData.new_message_id,
          created_date: new Date(),
          user: {
            first_name: app.user.get('first_name'),
            last_name: app.user.get('last_name'),
            id: app.user.get('id'),
            image_data: app.user.get('image_data'),
            role: role,
            // role: {
            //   company_name: role.company_name,
            //   // company_id: role.company_id,
            //   company_id: this.model.id,
            //   role: role.role,
            // },
          },
        };

        if (isChild) {
          $form.remove();
          let parentComment = this.getComment(parentId);
          if (parentComment) {
            parentComment.children.push(newCommentModel);
            //update parent comment response count
            $parentComment.find('.comment-actions:first .link-response-count > .count').text(parentComment.children.length);
          }
        } else {
          this.model.data.push(newCommentModel);
          $form.find('.text-body').val('');
        }

        let newCommentHtml = app.fields.comment(newCommentModel, level, {
          owner_id: this.model.owner_id,
          company_id: this.model.id,
        });
        $(newCommentHtml).appendTo(isChild ? $parentComment : this.$('.comments'));

        app.hideLoading();
      }).fail((err) => {
        $target.prop('disabled', false);
        app.hideLoading();
        alert(err);
      });
    },

    cancelComment(e) {
      e.preventDefault();

      let target = $(e.target);

      //escape pressed on input with ask question
      if (target.is('input'))
        return false;

      $(e.target).closest('form').remove();

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

  }, yesNoHelper.methods)),
};
