const View = require('components/raiseFunds/views.js');

const isBoolean = function(val) {
  return val == 0 || val == 1 || val == true || val == false;
}

const raiseCapitalCalcProgress = function(data) {
	return {
		'general_information': 
      data.pitch.length > 5 &&
      data.intended_use_of_proceeds.length > 5 &&
      data.business_model.length > 5,
		'media':
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
};

const updateRaiseCapitalMenu = function(progress) {
  let complited = 0;
  _(progress).each((v,k) => {
    let el = null;
    if(v == false) {
      el = document.querySelector('#menu_f_' + k + ' .icon-check');
      if(el != null) {
        el.remove();
      }
    } else {
      if(k != 'perks') {
        complited ++;
      }
      if(document.querySelector('#menu_f_' + k + ' .icon-check') == null) {
        document.querySelector('#menu_f_' + k).innerHTML += ' <div class="icon-check"><i class="fa fa-check-circle-o"></i></div>';
      }
    }
  });
  
  if(complited == 4) {
    document.querySelectorAll('#form_c a.disabled').forEach((v, i) => {
      v.className = v.className.replace('disabled', '');
    });
  }
};

function getOCCF(optionsR, viewName, params = {}) {
  $('#content').scrollTo();
  params.el = '#content';
  $.when(optionsR, app.user.getCompanyR(), app.user.getCampaignR(), app.user.getFormcR())
    .done((options, company, campaign, formc) => {

      params.fields = options[0].fields;
      // ToDo
      // This how we can avoid empty response
      if(company == '') {
        params.company = app.user.company;
        params.campaign = app.user.campaign;
        params.formc = app.user.formc;
      }
      else {
        if(Object.keys(company[0]).length > 0) {
          params.company = app.user.company = app.user.company || company[0];
          params.campaign = app.user.campaign = app.user.campaign || campaign[0];
          params.formc = app.user.formc = app.user.formc || formc[0];
        } else {
          params.company = {};
          params.campaign = {};
          params.formc = {};
        }
      }

      if(typeof viewName == 'string') {
        new View[viewName](Object.assign({}, params)).render();
        app.hideLoading();
      } else {
        viewName();
      }

      updateRaiseCapitalMenu(raiseCapitalCalcProgress(app.user.campaign));
    }).fail(function(xhr, response, error) {
      api.errorAction.call(this, $('#content'), xhr, response, error);
    });
};

module.exports = Backbone.Router.extend({
  routes: {
    'company/create': 'company',
    'company/in-review': 'inReview',
    'campaign/:id/general_information': 'generalInformation',
    'campaign/:id/media': 'media',
    'campaign/:id/team-members/add/:type/:index': 'teamMembersAdd',
    'campaign/:id/team-members': 'teamMembers',
    'campaign/:id/specifics': 'specifics',
    'campaign/:id/perks': 'perks',
  },

  execute: function (callback, args, name) {
    ga('send', 'pageview', "/" + Backbone.history.getPath());
    if (app.user.is_anonymous()) {
      const pView = require('components/anonymousAccount/views.js');
      require.ensure([], function() {
        new pView.popupLogin().render(window.location.pathname);
        app.hideLoading();
        $('#sign_up').modal();
      });
      return false;
    }
    if (callback) callback.apply(this, args);
  },

  company() {
    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS');
    getOCCF(optionsR, 'company', {});
  },

  generalInformation (id) {
    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/general_information', 'OPTIONS');
    getOCCF(optionsR, 'generalInformation', {});
  },

  media(id) {
    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/media', 'OPTIONS');
    getOCCF(optionsR, 'media', {});
  },

  teamMembers(id) {
    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/team-members', 'OPTIONS');
    getOCCF(optionsR, 'teamMembers', {});
  },

  teamMembersAdd(id, type, index) {
    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/team-members', 'OPTIONS');
    getOCCF(optionsR, 'teamMemberAdd', {
      type: type,
      index: index,
    });
  },

  specifics(id) {
    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/specifics', 'OPTIONS');
    getOCCF(optionsR, 'specifics', {});
  },

  perks(id) {
    const optionsR = app.makeCacheRequest(raiseCapitalServer + '/campaign/' + id + '/perks', 'OPTIONS');
    getOCCF(optionsR, 'perks', {});
  },    

  inReview() {
    app.showLoading();

    $('.modal-backdrop').remove();
    let fn = function() {
      app.hideLoading();
      if(app.user.company.is_approved == 1) {
        const i = new View.inReview({
          model: company,
        });
        i.render();
      } else {
        app.routers.navigate(
          '/company/create',
          { trigger: true, replace: false }
        );
      }
    };

    getOCCF('', fn);
  },
   
});
