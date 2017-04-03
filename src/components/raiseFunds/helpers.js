const isBoolean = function(val) {
  return val == 0 || val == 1 || val == true || val == false;
}

let exports = {
  calcProgress: function(data) {
    try {
      return {
        'general_information': 
          data.pitch.length > 5 &&
          data.intended_use_of_proceeds.length > 5 &&
          data.business_model.length > 5,
        'media':
          data.video != '' &&
          data.header_image_image_id != null &&
          data.list_image_image_id != null &&
          data.gallery_group_data.length > 0,
        'specifics': 
          data.minimum_raise >= 25000 &&
          data.maximum_raise <= 1000000 &&
          data.minimum_increment >= 100 &&
          data.length_days >= 60 &&
          data.investor_presentation_file_id != null &&
          isBoolean(data.security_type),
        'team-members': data.team_members.length > 0,
        'perks': data.perks.length > 0
      }
    } catch(e) {
      return {};
    }
  },

  updateMenu: function(progress) {
    let complited = 0;
    _(progress).each((v,k) => {
      let el = null;
      if(v == false) {
        el = document.querySelector('#menu_c_' + k + ' .icon-check');
        if(el != null) {
          el.remove();
        }
      } else {
        if(k != 'perks') {
          complited ++;
        }
        if(document.querySelector('#menu_c_' + k + ' .icon-check') == null) {
          document.querySelector('#menu_c_' + k).innerHTML += ' <div class="icon-check"><i class="fa fa-check-circle-o"></i></div>';
        }
      }
    });
    
    if(complited == 4) {
      document.querySelectorAll('#form_c a.disabled').forEach((v, i) => {
        v.className = v.className.replace('disabled', '');
      });
    }
  },

  submitCampaign: function submitCampaign(e) {
    let progress = exports.calcProgress(app.user.campaign);

    if(
        progress.general_information == true &&
        progress.media == true &&
        progress.specifics == true &&
        progress['team-members'] == true
    ) {
      $('#company_publish_confirm').modal('show');
    } else {
      var errors = {};
      _(progress).each((d, k) => {
        if(k != 'perks') {
          if(d == false)  {
            $('#company_publish .'+k).removeClass('collapse');
          } else {
            $('#company_publish .'+k).addClass('collapse');
          }
        }
      });
      $('#company_publish').modal('toggle');
    }
  },

  postForReview: function postForReview(e) {
    $('#company_publish_confirm').modal('hide', 0);
    if(app.user.company.is_approved < 1) {
      api.makeRequest(app.config.raiseCapitalServer + '/company/' + e.target.dataset.companyid + '/post-for-review', 'PUT')
        .then((data) => {
          app.user.company.is_approved = 1;
          $('#company_publish_confirm').modal('hide');
          setTimeout(() => {
            app.routers.navigate(
              '/company/in-review',
              { trigger: true, replace: false }
            );
          }, 500);
        });
    } else if(app.user.company.is_approved == 1) {
      app.routers.navigate(
        '/company/in-review',
        { trigger: true, replace: false }
      );
    } else {
      app.routers.navigate(
        '/formc/' + app.user.formc.id + '/introduction',
        { trigger: true, replace: false }
      );
    }
  },

  onPreviewAction: function(e) {
    e.preventDefault();
    let pathname = location.pathname;
    app.showLoading();
    let data = this.$('form').serializeJSON({ useIntKeysAsArrayIndex: true });
    if (window.location.href.indexOf('team-members/add') !== -1) {
      e.target.dataset.method = 'PUT';
    }
    if (api.submitAction.call(this, e, data)) {
      setTimeout((function() {
        window.location = '/' + this.formc.company_id + '?preview=1&previous=' + pathname;
      }).bind(this), 100);
    }
  }
};

module.exports = exports;
