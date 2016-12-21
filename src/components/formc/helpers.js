const isBoolean = function(val) {
  return val == 0 || val == 1 || val == true || val == false;
}

const haveRequiredMembers = function(teamMembers) {
  var requiredRoles = { 1: 'CEO/President', 2: 'Principal Financial Officer/Treasurer', 5: 'Controller/Principal Accounting Officer' };
  var roleCounter = 0;

  _(requiredRoles).each((k, v) => {
    var persons = teamMembers.filter(function(el) { return (el.title ? el.title.indexOf(v) != -1: false); });
    
    if(persons.length > 0) {
      roleCounter ++;
    }
  });

  return roleCounter == 3
};


module.exports = {
  haveRequiredMembers: haveRequiredMembers,

  formcCalcProgress: function(data) {
    return {
      'introduction': data.certify == true && isBoolean(data.failed_to_comply_choice),
      'team-members': haveRequiredMembers(data.team_members),
      'related-parties':
          data.transaction_with_related_parties_choice == 0 ||
          (data.transaction_with_related_parties_choice == 1 &&
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
        (
          (data.financials_condition_choice == 1 &&
           data.financials_condition_yes.length > 0) || 
          (data.financials_condition_choice == 0 &&
           data.financials_condition_no.length > 0
          )
        ) && data.fiscal_recent_group_data.length > 0 &&
          data.fiscal_prior_group_data.length > 0 &&
          data.sold_securities_data.length == 2 && 
          (
           (app.user.campaign.maximum_raise <= 100000 &&
           data.sold_securities_data[0]['total_income'] > 0 &&
           data.sold_securities_data[0]['taxable_income'] > 0 &&
           data.sold_securities_data[0]['total_tax'] > 0 &&
           data.sold_securities_data[1]['total_income'] > 0 &&
           data.sold_securities_data[1]['taxable_income'] > 0 &&
           data.sold_securities_data[1]['total_tax'] > 0) ||
           app.user.campaign.maximum_raise > 100000
          ),
      'outstanding-security':
        (
         data.business_loans_or_debt_choice == false || 
         data.rights_of_securities.length > 0
        ) &&
        (
         data.exempt_offering_choice == false ||
         data.exempt_offering.length > 0
        ) &&
        data.rights_of_securities.length > 0 &&
        data.terms_of_securities.length > 0 &&
        data.security_differences.length > 0 &&
        data.exercise_of_rights.length > 0 &&
        data.risks_to_purchasers.length > 0, 
      'background-check': 
        (
         data.company_or_director_subjected_to_choice == 0 || 
         (
          data.company_or_director_subjected_to_choice == 1 &&
          data.company_or_director_subjected_to.length > 0
         )
        ) &&
        data.material_information.length > 0 &&
        data.descrption_material_information.length > 0
    }
  },

  updateFormcMenu: function(progress) {
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
  },
};
