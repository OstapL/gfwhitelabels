const View = require('components/formc/views.js');

const isBoolean = function(val) {
  return val == 0 || val == 1 || val == true || val == false;
}

const formcCalcProgress = function(data) {
	return {
		'introduction': isBoolean(data.certify) == true &&
      isBoolean(data.failed_to_comply_choice),
		//'team-members': team_member_progress,
		'related-parties':
				isBoolean(data.transaction_with_related_parties_choice) == 0 ||
				(isBoolean(data.transaction_with_related_parties_choice) == 1 &&
						data.transaction_with_related_parties.length > 0),
		'use-of-proceeds': 
		  data.intended_use_of_proceeds.length > 0 &&
			data.less_offering_express.length > 0 &&
			data.use_of_net_proceeds.length > 0 &&
			data.business_plan_file_id != null,
		'risk-factors-market':
				Object.keys(data.market_and_customer_risk).length > 0,
		'risk-factors-financial': Object.keys(data.financial_risk).length > 0,
		'risk-factors-operational': Object.keys(data.operational_risk).length > 0,
		'risk-factors-competitive': Object.keys(data.competitive_risk).length > 0,
		'risk-factors-personnel':
				Object.keys(data.personnel_and_third_parties_risk).length > 0,
		'risk-factors-legal':
				Object.keys(data.legal_and_regulatory_risk).length > 0,
		'risk-factors-misc': Object.keys(data.miscellaneous_risk).length > 0,
		'financial-condition': 
				(isBoolean(data.financials_condition_choice) &&
				 data.financials_condition_yes.length > 0) ||
				(isBoolean(data.financials_condition_choice) &&
				 data.financials_condition_no.length > 0
				) && data.fiscal_recent_group_data.length > 0 &&
				data.fiscal_prior_group_data.length > 0 &&
				data.sold_securities_data.length == 2 && 
				(app.user.campaign.maximum_raise <= 100000 &&
				 data.sold_securities_data[0]['total_income'] > 0 &&
				 data.sold_securities_data[0]['taxable_income'] > 0 &&
				 data.sold_securities_data[0]['total_tax'] > 0 &&
				 data.sold_securities_data[1]['total_income'] > 0 &&
				 data.sold_securities_data[1]['taxable_income'] > 0 &&
				 data.sold_securities_data[1]['total_tax'] > 0) ||
				app.user.campaign.maximum_raise > 100000,
		'outstanding-security':
	    data.rights_of_securities.length > 0 &&
			data.terms_of_securities.length > 0 &&
			data.security_differences.length > 0 &&
			data.exercise_of_rights.length > 0 &&
			data.risks_to_purchasers.length > 0, 
		'background-check': 
			isBoolean(data.company_or_director_subjected_to_choice) || 
			(
        isBoolean(data.company_or_director_subjected_to_choice) &&
			  data.company_or_director_subjected_to.length > 0
      ) &&
			data.material_information.length > 0 &&
			data.descrption_material_information.length > 0
  }
};

const updateFormcMenu = function(progress) {
  _(progress).each((v,k) => {
    var el = null;
    if(v == false) {
      el = document.querySelector('#menu_f_' + k + ' .icon-check');
      if(el != null) {
        el.remove();
      }
    } else {
      if(document.querySelector('#menu_f_' + k + ' .icon-check') == null) {
        document.querySelector('#menu_f_' + k).innerHTML += ' <div class="icon-check"><i class="fa fa-check-circle-o"></i></div>';
      }
    }
  });
};

function getOCCF(optionsR, viewName, params = {}) {
  $('#content').scrollTo();
  params.el = '#content';
  $.when(optionsR, app.user.getCompanyR(), app.user.getCampaignR(), app.user.getFormcR())
    .done((options, company, campaign, formc) => {

      if(options != '') {
        params.fields = options[0].fields;
      }
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

      if(params.formc.is_paid == false && viewName != 'introduction') {
        app.routers.navigate('/formc/' + params.formc.id +  '/introduction?notPaid=1', { trigger: true, replace: true } );
        return false;
      }

      if(typeof viewName == 'string') {
        new View[viewName](Object.assign({}, params)).render();
        app.hideLoading();
      } else {
        viewName();
      }

      updateFormcMenu(formcCalcProgress(app.user.formc));
    }).fail(function(xhr, response, error) {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
      else {
        api.errorAction.call(this, $('#content'), xhr, response, error);
      }
    });
};


module.exports = Backbone.Router.extend({
  routes: {
    'formc/:id/introduction': 'introduction',
    'formc/:id/team-members/:type/:index': 'teamMemberAdd',
    'formc/:id/team-members': 'teamMembers',
    'formc/:id/related-parties': 'relatedParties',
    'formc/:id/use-of-proceeds': 'useOfProceeds',
    'formc/:id/risk-factors-market': 'riskFactorsMarket',
    'formc/:id/risk-factors-financial': 'riskFactorsFinancial',
    'formc/:id/risk-factors-operational': 'riskFactorsOperational',
    'formc/:id/risk-factors-competitive': 'riskFactorsCompetitive',
    'formc/:id/risk-factors-personnel': 'riskFactorsPersonnel',
    'formc/:id/risk-factors-legal': 'riskFactorsLegal',
    'formc/:id/risk-factors-misc': 'riskFactorsMisc',
    'formc/:id/risk-factors-instruction': 'riskFactorsInstruction',
    'formc/:id/financial-condition': 'financialCondition',
    'formc/:id/outstanding-security': 'outstandingSecurity',
    'formc/:id/background-check': 'backgroundCheck',
    'formc/:id/final-review': 'finalReview',
    'formc/:id/final-review-two': 'finalReviewTwo',
    'formc/:id/formc-elecrtonic-signature': 'electronicSignature',
    'formc/:id/formc-elecrtonic-signature-company': 'electronicSignatureCompany',
    'formc/:id/formc-elecrtonic-signature-cik': 'electronicSignatureCik',
    'formc/:id/formc-elecrtonic-signature-financial-certification': 'electronicSignatureFinancials',
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
    else alert('Not such url');
  },

  introduction(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/introduction', 'OPTIONS');
    getOCCF(optionsR, 'introduction', {});
  },
  
  teamMembers(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/team-members', 'OPTIONS');
    getOCCF(optionsR, 'teamMembers', {});
  },

  teamMemberAdd(id, role, user_id) {

    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/team-members/' + role, 'OPTIONS');
    getOCCF(optionsR, 'teamMemberAdd', {
      role: role,
      user_id: user_id
    });

  },

  relatedParties(id) {

    const optionsR = api.makeCacheRequest(
      formcServer + '/' + id + '/related-parties',
      'OPTIONS'
    );
    getOCCF(optionsR, 'relatedParties', {});

  },

  useOfProceeds(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/use-of-proceeds', 'OPTIONS');
    getOCCF(optionsR, 'useOfProceeds', {});
  },

  riskFactorsInstruction(id) {
    getOCCF('', 'riskFactorsInstruction', {});
  },

  riskFactorsMarket(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-market', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsMarket', {});
  },

  riskFactorsFinancial(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-financial', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsFinancial', {});
  },

  riskFactorsOperational(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-operational', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsOperational', {});
  },

  riskFactorsCompetitive(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-competitive', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsCompetitive', {});
  },

  riskFactorsPersonnel(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-personnel', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsPersonnel', {});
  },

  riskFactorsLegal(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-legal', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsLegal', {});
  },

  riskFactorsMisc(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/risk-factors-misc', 'OPTIONS');
    getOCCF(optionsR, 'riskFactorsMisc', {});
  },

  financialCondition(id) {
    const optionsR = api.makeRequest(
      formcServer + '/' + id + '/financial-condition', 
      'OPTIONS'
    );
    getOCCF(optionsR, 'financialCondition', {});
  },

  outstandingSecurity(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/outstanding-security', 'OPTIONS');
    getOCCF(optionsR, 'outstandingSecurity', {});
  },

  backgroundCheck(id) {
    const optionsR = api.makeCacheRequest(formcServer + '/' + id + '/background-check', 'OPTIONS');
    getOCCF(optionsR, 'backgroundCheck', {});
  },

  finalReview(id) {

    let companyR = api.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS');
    let campaignR = api.makeCacheRequest(raiseCapitalServer + '/campaign', 'OPTIONS');
    let formcR = api.makeCacheRequest(formcServer + '/' + id + '/final-review', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/final-review');

    $('#content').scrollTo();
    $.when(companyR, campaignR, formcR, dataR).done((company, campaign, formc, data) => {
      data[0].id = id;
      const fields = {
        company: company[0].fields,
        campaign: campaign[0].fields,
        formc: formc[0].fields,
      };
      const i = new View.finalReview({
        el: '#content',
        model: data[0],
        fields: fields
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },

  finalReviewTwo: function(id) {

    let companyR = api.makeCacheRequest(raiseCapitalServer + '/company', 'OPTIONS');
    let campaignR = api.makeCacheRequest(raiseCapitalServer + '/campaign', 'OPTIONS');
    let formcR = api.makeCacheRequest(formcServer + '/' + id + '/final-review', 'OPTIONS');
    let dataR = api.makeCacheRequest(formcServer + '/' + id + '/final-review');

    $('#content').scrollTo();
    $.when(companyR, campaignR, formcR, dataR).done((company, campaign, formc, data) => {
      data[0].id = id;
      const fields = {
        company: company[0].fields,
        campaign: campaign[0].fields,
        formc: formc[0].fields,
      };
      const i = new View.finalReviewTwo({
        el: '#content',
        model: data[0],
        fields: fields
      });
      i.render();
      app.hideLoading();
    }).fail((response, error, status) => {
      if(response.responseJSON.location) {
         app.routers.navigate('/formc' + response.responseJSON.location +  '?notPaid=1', { trigger: true, replace: true } );
      }
    });
  },
  electronicSignature(id) {
      let i = new View.electronicSignature({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  electronicSignatureCompany(id) {
      let i = new View.electronicSignatureCompany({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  electronicSignatureCik(id) {
      let i = new View.electronicSignatureCik({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
  electronicSignatureFinancials(id) {
      let i = new View.electronicSignatureFinancials({
        el: '#content',
      });
      i.render();
      app.hideLoading();
  },
});
