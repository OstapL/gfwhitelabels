const isBoolean = function(val) {
  return val == 0 || val == 1 || val == true || val == false;
}

let exports = {

  submitCampaign: function submitCampaign(e) {
    // ToDo
    // Fix class
    let campaignClass = new app.models.Campaign(app.user.campaign);
    let progress = campaignClass.calcProgress();

    if(
        progress.general_information == true &&
        progress.media == true &&
        progress.specifics == true &&
        progress['team-members'] == true
    ) {
      $('#company_publish_confirm').modal('show');
    } else {
      Object.keys(progress).forEach((k) => {
        const d = progress[k];
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
          app.analytics.emitEvent(app.analytics.events.CampaignSubmitted, app.user.stats);
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
    let data = this.$('form').serializeJSON();
    if (window.location.href.indexOf('team-members/add') !== -1) {
      e.target.dataset.method = 'PUT';
    }
    if (api.submitAction.call(this, e, data)) {
      setTimeout((function() {
        const campaignURL = (app.user.company.slug || app.user.company.id);
        window.location = '/' + (campaignURL + '?preview=1&previous=' + pathname);
      }).bind(this), 100);
    } else {
      app.hideLoading();
    }
  }
};

module.exports = exports;
