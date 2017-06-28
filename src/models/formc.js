const File = require('./file.js');
const Image = require('./image.js');
const Folder = require('./folder.js');
const Gallery = require('./gallery.js');


class Formc {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data || {};
    this.schema = schema;
    if(data && data.id) {
      this.url = url || app.config.formcServer + '/' + data.id;
    } else {
      this.url = url || app.config.formcServer;
    }

    this.data.business_plan_file_id = new File(
      this.url,
      this.data.business_plan_data
    );

    this.data.fiscal_recent_group_id = new Folder(
      this.url,
      this.data.fiscal_recent_group_id,
      this.data.fiscal_recent_group_data
    );

    this.data.fiscal_prior_group_id = new Folder(
      this.url,
      this.data.fiscal_prior_group_id,
      this.data.fiscal_prior_group_data
    );

    this.data = Object.seal(this.data);
    for(let key in this.data) {
      Object.defineProperty(this, key, {
        get: function(value) { return this.data[key]; },
        set: function(value) { this.data[key] = value; },
      });
    }
  }

  toJSON() {
    let data = Object.assign({}, this.data);
    data.business_plan_file_id = data.business_plan_file_id.id;
    data.fiscal_recent_group_id = data.fiscal_recent_group_id.id;
    data.fiscal_prior_group_id = data.fiscal_prior_group_id.id;
    return data;
  }

  requiredRoles() {
    return { 4: 'CEO/President', 8: 'Principal Financial Officer/Treasurer', 64: 'Controller/Principal Accounting Officer' };
  }

  haveRequiredMembers() {
    var roleCounter = 0;

    var requiredRoles = this.requiredRoles();
    Object.keys(requiredRoles).forEach((k) => {
      var persons = this.data.team_members.filter(function(el) { 
        return (el.role ? (el.role & k) && (el.is_invited == 1): false); 
      })
      
      if(persons.length > 0) {
        roleCounter ++;
      }
    });

    return roleCounter >= 3
  }

  calcProgress() {
    return {
      'introduction': this.certify == true && app.utils.isBoolean(this.failed_to_comply_choice),
      'team-members': this.haveRequiredMembers(this.team_members),
      'related-parties':
          this.transaction_with_related_parties_choice == 0 ||
          (this.transaction_with_related_parties_choice == 1 &&
              this.transaction_with_related_parties.length > 0),
      'use-of-proceeds': 
        this.intended_use_of_proceeds.length > 0 &&
        this.less_offering_express.length > 0 &&
        this.use_of_net_proceeds.length > 0 &&
        this.business_plan_file_id != null,
      'risk-factors-market':
          Object.keys(this.market_and_customer_risk).length > 0,
      'risk-factors-financial': Object.keys(this.financial_risk).length > 0,
      'risk-factors-operational': Object.keys(this.operational_risk).length > 0,
      'risk-factors-competitive': Object.keys(this.competitive_risk).length > 0,
      'risk-factors-personnel':
          Object.keys(this.personnel_and_third_parties_risk).length > 0,
      'risk-factors-legal':
          Object.keys(this.legal_and_regulatory_risk).length > 0,
      'risk-factors-misc': Object.keys(this.miscellaneous_risk).length > 0,
      'financial-condition': 
        (
          (this.financials_condition_choice == 1 &&
           this.financials_condition_yes.length > 0) || 
          (this.financials_condition_choice == 0 &&
           this.financials_condition_no.length > 0
          )
        ) && this.fiscal_recent_group_data.length > 0 &&
          this.fiscal_prior_group_data.length > 0 &&
          this.sold_securities_data.length == 2 && 
          (
           this.sold_securities_data.length == 2 &&
           this.sold_securities_data[0].hasOwnProperty('total_assets') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('total_assets') == 1 &&
           this.sold_securities_data[0].hasOwnProperty('cash_and_equivalents') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('cash_and_equivalents') == 1 &&
           this.sold_securities_data[0].hasOwnProperty('account_receivable') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('account_receivable') == 1 &&
           this.sold_securities_data[0].hasOwnProperty('short_term_debt') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('short_term_debt') == 1 &&
           this.sold_securities_data[0].hasOwnProperty('long_term_debt') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('long_term_debt') == 1 &&
           this.sold_securities_data[0].hasOwnProperty('revenues_sales') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('revenues_sales') == 1 &&
           this.sold_securities_data[0].hasOwnProperty('cost_of_goods_sold') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('cost_of_goods_sold') == 1 &&
           (app.user.campaign.maximum_raise <= 100000 &&
           this.sold_securities_data[0].hasOwnProperty('total_income') == 1 &&
           this.sold_securities_data[0].hasOwnProperty('taxable_income') == 1 &&
           this.sold_securities_data[0].hasOwnProperty('total_tax') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('total_income') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('taxable_income') == 1 &&
           this.sold_securities_data[1].hasOwnProperty('total_tax') == 1) ||
           app.user.campaign.maximum_raise > 100000
          ),
      'outstanding-security':
        (
         this.business_loans_or_debt_choice == false || 
         this.rights_of_securities.length > 0
        ) &&
        (
         this.exempt_offering_choice == false ||
         this.exempt_offering.length > 0
        ) &&
        this.rights_of_securities.length > 0 &&
        this.terms_of_securities.length > 0 &&
        // this.security_differences.length > 0 &&
        // this.exercise_of_rights.length > 0 &&
        this.risks_to_purchasers.length > 0, 
      'background-check': 
        (
         this.company_or_director_subjected_to_choice == 0 || 
         (
          this.company_or_director_subjected_to_choice == 1 &&
          this.company_or_director_subjected_to.length > 0
         )
        ) &&
        this.material_information.length > 0 &&
        this.descrption_material_information.length > 0
    }
  }

  updateMenu(progress) {
    Object.keys(progress).forEach((k) => {
      let v = progress[k];
      var el = null;
      if (v == false) {
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
  }
}

module.exports = Formc
