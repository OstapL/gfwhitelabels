const companyFees = require('consts/raisecapital/companyFees.json');
const securityTypeConsts = require('consts/formc/security_type.json');
const yesNoConsts = require('consts/yesNo.json');
const roles = ['Shareholder', 'Director', 'Officer'];
const riskFactors = require('./riskFactorsHelper.js');

const labels = {
  title: 'Title for Risk',
  risk: 'Describe Your Risk',
  market_and_customer_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  financial_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  operational_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  competitive_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  personnel_and_third_parties_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  legal_and_regulatory_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  miscellaneous_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
};

const submitFormc = function submitFormc(e) {
  e.preventDefault();
  let progress = this.model.calcProgress();

  if(
      progress.introduction == true &&
      progress["team-members"] == true &&
      progress["related-parties"] == true &&
      progress["use-of-proceeds"] == true &&
      progress["risk-factors-market"] == true &&
      progress["risk-factors-financial"] == true &&
      progress["risk-factors-operational"] == true &&
      progress["risk-factors-competitive"] == true &&
      progress["risk-factors-personnel"] == true &&
      progress["risk-factors-legal"] == true &&
      progress["risk-factors-misc"] == true &&
      progress["financial-condition"] == true &&
      progress["outstanding-security"] == true &&
      progress["background-check"] == true
  ) {
    $('#formc_publish_confirm').modal('show');
  } else {
    Object.keys(progress).forEach((k) => {
      const d = progress[k];
      if(k != 'perks') {
        if(d == false)  {
          $('#formc_publish .'+k).removeClass('collapse');
        } else {
          $('#formc_publish .'+k).addClass('collapse');
        }
      }
    });
    $('#formc_publish').modal('toggle');
  }
};

const snippets = {
  business_loans_or_debt: require('./templates/snippets/business_loans_or_debt.pug'),
  exempt_offering: require('./templates/snippets/exempt_offering.pug'),
  experiences: require('./templates/snippets/experiences.pug'),
  less_offering_express: require('./templates/snippets/less_offering_express.pug'),
  outstanding_securities: require('./templates/snippets/outstanding_securities.pug'),
  positions: require('./templates/snippets/positions.pug'),
  sold_securities_data: require('./templates/snippets/sold_securities_data.pug'),
  transaction_with_related_parties: require('./templates/snippets/transaction_with_related_parties.pug'),
  use_of_net_proceeds: require('./templates/snippets/use_of_net_proceeds.pug'),
};

module.exports = {
  introduction: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id/introduction',

    events: Object.assign({
      'click .save-and-continue': 'submit',
      // 'submit form': 'submit',
      'keyup #full_name': 'changeSign',
      'click #pay-btn': 'stripeSubmit',
      'click .openPdfPreview': 'openPdfPreview',
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, app.helpers.yesNo.events, /*app.helpers.confirmOnLeave.events*/),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.failed_to_comply_choice.dependies = ['failed_to_comply'];

      if(this.model.is_paid === false) {
        this.fields.full_name = { 
          required: true 
        };
      }

      this.listenToNavigate();
    },

    render() {
      let template = require('./templates/introduction.pug');

      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          fullName: app.user.get('first_name') + ' ' + app.user.get('last_name'),
        })
      );

      let eSignForm = this.$('.electronically-sign');
      this.eSignCompanyName = eSignForm.find('#company-name');
      this.eSignFullName = eSignForm.find('#full_name');
      this.eSignPreview = eSignForm.find('.electronically .name');
      this.campaign.updateMenu(this.campaign.calcProgress());

      return this;
    },

    setFormData () {
      this.formData = this.$el.find('form').serializeJSON();
      this.formData.is_paid = this.model.is_paid;
      return this.formData;
    },

    saveEsign() {
      api.makeRequest(
        app.config.esignServer + '/',
        'POST',
        {
          investment_id: this.model.id,
          signature: this.formData.full_name,
          pdf_type: 255
        },
        {}
      )
      .fail( (err) => console.log('esign error: ', err));
    },

    _success(data, newData) {
      if (this.formData && !this.formData.is_paid) {
        this.saveEsign(data);
      }
      this.model.updateMenu(this.model.calcProgress());
      return 1;
    },

    getCurrentDate () {
        const date = new Date();
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    },

    getSuccessUrl() {
      return '/formc/' + this.model.id + '/team-members';
    },

    stripeSubmit(e) {
      e.preventDefault();

      app.helpers.scripts.load('https://js.stripe.com/v2/').then(() => {
        this.setFormData();
        let $stripeForm = $('.payment-block');

        function validateCard(form, selectors) {

          let number = form.find('#' + selectors.number);
          let expMonth = form.find('#' + selectors.expMonth);
          let expYear = form.find('#' + selectors.expYear);
          let cvc = form.find('#' + selectors.cvc);
          let error = 0;

          $('.help-block').remove();
          if (!Stripe.card.validateCardNumber(number.val())) {
            app.validation.invalidMsg({ $: $, $el: $('#content') }, selectors.number, ['Please, check card number.']);
            error = 1;
          }

          if (!Stripe.card.validateExpiry(expMonth.val(), expYear.val())) {
            app.validation.invalidMsg({ $: $, $el: $('#content') }, selectors.expDate, ['Please, check expiration date.']);
            error = 1;
          }

          if (!Stripe.card.validateCVC(cvc.val())) {
            app.validation.invalidMsg({ $: $, $el: $('#content') }, selectors.cvc, ['Please, check CVC.']);
            error = 1;
          }

          if(error == 1) {
            return null;
          }

          return {
            number: number.val(),
            cvc: cvc.val(),
            exp_month: expMonth.val(),
            exp_year: expYear.val(),
          };
        };

        let $payBtn = $(e.target);
        $payBtn.prop('disabled', true);

        var card = validateCard($stripeForm,
          { number: 'card_number',
            expDate: 'card_exp_date_year',
            expMonth: 'card_exp_month',
            expYear: 'card_exp_date_year',
            cvc: 'card_cvc',
          });

        if (!card) {
          $payBtn.prop('disabled', false);
          return;
        }

        if (!this.eSignFullName.val().trim()) {
          app.validation.invalidMsg({ $: $, $el: $('#content'), }, 'full-name', ['Check your name']);
          $payBtn.prop('disabled', false);
          return;
        }

        app.showLoading();

        Stripe.setPublishableKey(app.config.stripeKey);

        Stripe.card.createToken(card, (status, stripeResponse) => {
          if (stripeResponse.error) {
            app.validation.invalidMsg({ $: $, $el: $('#content'), }, 'card_number', [stripeResponse.error.message]);
            $payBtn.prop('disabled', false); // Re-enable submission
            app.hideLoading();
            return;
          }

          app.user.setFormcPaid(this.model.id);
          app.profile.render();

          api.makeRequest(app.config.formcServer + '/' + this.model.id + '/stripe', "PUT", {
            stripeToken: stripeResponse.id
          }).done((formcResponse, statusText, xhr) => {
            if (xhr.status !== 200) {
              app.validation.invalidMsg({'$': $, $el: $('#content'),}, "expiration-block",
                [formcResponse.description || 'Some error message should be here']);

              $payBtn.prop('disabled', false);
              app.hideLoading();
              return;
            }

            //todo; sign data, make request to server
            // let signData = {
            //   type: 'POST',
            //   'company_name': this.eSignCompanyName.val(),
            //   'full_name': this.eSignFullName.val(),
            // };
            //
            // if (this.model.is_paid == false) {
            //   signData.company_name = this.eSignCompanyName.val();
            //   signData.full_name = this.eSignFullName.val();
            // }



            this.model.is_paid = true;
            delete this.fields.full_name;

            $stripeForm.remove();

            this.$('#save-button-block').removeClass('collapse');

            this.$('.save-and-continue').click();
            app.hideLoading();

          }).fail((xhr, ajaxOptions, err) => {
            app.validation.invalidMsg({'$': $}, "expiration-block",
              [xhr.responseJSON && xhr.responseJSON.non_field_errors ? xhr.responseJSON.non_field_errors : 'An error occurred, please, try again later.']);

            $payBtn.prop('disabled', false);
            app.hideLoading();
          });

          return false;
        });
      });
    },

    submit(e) {
      e.preventDefault();

      let $target = $(e.target);
      let $form = $target.closest('form');

      let $submitBtn = $form.find('#pay-btn');
      $submitBtn.prop('disabled', true);

      let data = $form.serializeJSON();
      if (data.certify == 0) {
        delete data.certify;
      }

      return api.submitAction.call(this, e, data);
    },

    changeSign() {
      this.eSignPreview.text(this.eSignFullName.val());
    },

    openPdfPreview(e) {
      let url = e.currentTarget.getAttribute('href');
      url += this.el.querySelector('#full_name').value;
      app.utils.openPdfPreview(url);
      return false;
    },

  }, app.helpers.menu.methods, app.helpers.yesNo.methods, app.helpers.confirmOnLeave.methods)),

  teamMembers: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id/team-members/employers',
    events: Object.assign({
      'click #submitForm': api.submitAction,
      'click .inviteAction': 'repeatInvitation',
      'blur #full_time_employers,#part_time_employers': 'updateEmployees',
      'click .submit_formc': submitFormc,
      'click .delete-member': 'deleteMember',
    }, app.helpers.menu.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.full_time_employers.label = 'Full Time Employees';
      this.fields.part_time_employers.label = 'Part Time Employees';
      this.urlRoot = this.urlRoot.replace(':id', this.model.id);

      this.listenToNavigate();
    },

    _success(data, newData) {
      this.model.updateMenu(this.model.calcProgress());
      return 1;
    },

    getSuccessUrl(data) {
      return '/formc/' + this.model.id + '/related-parties';
    },

    deleteMember(e) {
      e.preventDefault();

      const target = e.currentTarget;
      const userId = target.dataset.id;

      app.dialogs.confirm('Are you sure you would like to delete this team member?').then((confirmed) => {
        if (!confirmed)
          return;

        api.makeRequest(
          this.urlRoot.replace('employers', '') +  userId,
          'DELETE',
          {'role': target.dataset.role }
        ).
        then((data) => {
          let index = this.model.team_members.findIndex((el) => { return el.user_id == userId });
          this.model.team_members.splice(index, 1);
          target.parentElement.parentElement.remove()
          /*
           * ToDo
           * Create right notification error
           *
           if (this.model.team_members.length < 1) {
           this.$el.find('.notification').show();
           this.$el.find('.buttons-row').hide();
           } else {
           this.$el.find('.notification').hide();
           this.$el.find('.buttons-row').show();
           }
           */
        });
      });
    },

    updateEmployees(e) {
      e.preventDefault();
      api.makeRequest(
        this.urlRoot,
        'PATCH',
        {
          'full_time_employers': this.el.querySelector('#full_time_employers').value,
          'part_time_employers': this.el.querySelector('#part_time_employers').value,
        }
      );
    },

    repeatInvitation(e) {
      e.preventDefault();
      api.makeRequest(
        app.config.formcServer + '/' + this.model.id + '/team-members/invitation/' +  e.target.dataset.id,
        'PUT',
      ).then((data) => {
        e.target.innerHTML = '<i class="fa fa-envelope-open-o" aria-hidden="true"></i> Sent';
        e.target.className = 'link-3 invite';
      });
    },

    render() {
      let template = require('./templates/teamMembers.pug');

      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          roles: roles,
          titles: [
            '',
            'CEO/President',
            'Principal Financial Officer/Treasurer',
            'Vice President',
            'Secretary',
            'Controller/Principal Accounting Officer',
          ],
        })
      );
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },

  }, app.helpers.menu.methods, app.helpers.section.methods, app.helpers.confirmOnLeave.methods)),

	teamMemberAdd: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id/team-members',
    doNotExtendModel: true,
    roles: ['shareholder', 'director', 'officer'],
    events: Object.assign({
      'click #submitForm': 'submit',
      'click .submit_formc': submitFormc,
      'click .team-current-date': 'setCurrentDate',
    }, app.helpers.section.events, app.helpers.menu.events, app.helpers.yesNo.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      if(options.user_id != 'new') {
        let t = options.formc.team_members.filter(function(el) { return el.user_id == options.user_id})[0]
        t.formc_id = options.formc.id;
        t.campaign_id = options.formc.campaign_id;
        t.company_id = options.formc.company_id;
        delete t.id;
        this.model = t;
      } else {
        this.model = {
          formc_id: options.formc.id,
          campaign_id: options.formc.campaign_id,
          company_id: options.formc.company_id,
          role: 0
        };
      }
      this.fields = options.fields;
      this.role = options.role;
      this.allFields = options.fields;
      this.fields = options.fields[this.role].fields;
      this.campaign = options.campaign;

      this.allFields.shareholder.fields.voting_power_percent.type = 'percent';

      this.labels = {
        first_name: 'First name',
        last_name: 'Last name',
        email: 'Email',
        dob: 'Date of birth',
        principal_occupation: 'Principal Occupation and Name of Employer',
        employer_principal_businesss: "Employer's Principal Business",
        responsibilities: 'Title',
        number_of_shares: 'Number of Shares',
        class_of_securities: 'Class of Securities',
        voting_power_percent: '% of Voting Power Prior to Offering',
        voting_power: '% of Voting Power Prior to Offering',
        experiences: {
          employer: 'Employer',
          employer_principal: 'Employer Principal',
          title: 'Employer\'s Principal Business',
          responsibilities: 'Title and Responsibilities',
          start_date_of_service: 'Start Date of Service',
          end_date_of_service: 'End Date of Service',
        },
        positions: {
          position: 'Position',
          start_date_of_service: 'Start Date of Service',
          end_date_of_service: 'End Date of Service',
        },
      };
      this.assignLabels();

      this.createIndexes();
      this.buildSnippets(snippets);

      this.listenToNavigate();
    },

    render() {
      let template = null;

      this.urlRoot = this.urlRoot.replace(':id', this.model.formc_id);
      if(this.model.hasOwnProperty('user_id')  && this.model.user_id != '') {
        this.model.id = this.model.formc_id;
        this.urlRoot += '/' +  this.model.user_id;
      } else {
        // this.urlRoot += '/' + this.role;
        this.model.title = [];
      }

      if (this.role == 'director') {
        template = require('components/formc/templates/teamMembersDirector.pug');
        this.buildSnippets(snippets);
      } else if (this.role == 'officer') {
        template = require('components/formc/templates/teamMembersOfficer.pug');
        this.buildSnippets(snippets);
      } else if (this.role == 'shareholder') {
        template = require('components/formc/templates/teamMembersShareHolder.pug');
      }

      require('bootstrap-select/sass/bootstrap-select.scss');
      let selectPicker = require('bootstrap-select');

      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          templates: this.jsonTemplates,
        })
      );
      this.$el.find('.selectpicker').selectpicker();
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },

    _success(data, newData) {
      window.location = '/formc/' + this.model.formc_id + '/team-members';
      /*
      this.model.team_members.push(newData);
      this.undelegateEvents();
      app.routers.navigate(
        '/formc/' + this.model.id + '/team-members',
        { trigger: true, replace: false }
      );
      //return '/campaign/' + this.model.id + '/team-members';
      */
    },

    submit(e) {
      let data = $(e.target).closest('form').serializeJSON();

      if(data.role) {
        // data.role = data.role.reduce((a,b) => { return parseInt(a)+parseInt(b)}, 0);
        // data.role = this.model.role;
        
        let newRole = this.model.role;

        // delete data['experiences'];
        // delete data['positions'];
        // data['number_of_shares'] = 100;
        if(data.voting_shareholder_choice == 1) {
          Object.assign(this.fields, this.allFields.shareholder.fields);
          if((newRole & 1) != 1) {
            newRole += 1;
          }
        } else {
          if((newRole & 1) == 1) {
            newRole -= 1;
          }
          delete data.number_of_shares;
          delete data.class_of_securities;
          delete data.voting_power_percent;
        }
        if(data.individual_director_choice == 1) {
          Object.assign(this.fields, this.allFields.director.fields);
          if((newRole & 2) != 2) {
            newRole += 2;
          }
        } else {
          if((newRole & 2) == 2) {
            newRole -= 2;
          }
          delete data.board_service_start_date__month;
          delete data.board_service_start_date__year;
          delete data.principal_occupation;
          delete data.employer_principal_businesss;
          delete data.employer_start_date__year;
          delete data.employer_start_date__month;
        }
        data.role.forEach((val,i) => { 
          if((newRole & val) != val) {
            newRole += val;
          }
        });
        if(this.model.role != newRole) {
          data.role = newRole;
        }
        else if(this.model.hasOwnProperty('id') == true) {
          delete data.role;
        }
      }

      //process current date in experiences
      // TODO: process current date
      // data.experiences.forEach((exp) => {
      //   if (!exp.end_date_of_service__month && !exp.end_date_of_service__year)
      //     delete this.fields.experiences.schema.end_date_of_service;
      // });
      api.submitAction.call(this, e, data);
    },

    setCurrentDate(e) {
      let $target = $(e.target);
      const isCurrentDate = $target.is(':checked');

      let $container = $target.parent().parent().parent();
      let monthControl = $container.find('select');
      let yearControl = $container.find('input[type=text]');

      monthControl.val('');
      monthControl.prop('disabled', isCurrentDate);

      yearControl.val('');
      yearControl.prop('disabled', isCurrentDate);
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      this.$el.find('.selectpicker').selectpicker('destroy');
    }

  }, app.helpers.section.methods, app.helpers.menu.methods, app.helpers.yesNo.methods, app.helpers.confirmOnLeave.methods)),


  relatedParties: Backbone.View.extend(Object.assign({
    el: '#content',
    urlRoot: app.config.formcServer + '/:id/related-parties',

    events: Object.assign({
      'submit form': 'submit',
      'click .submit_formc': submitFormc,
    }, app.helpers.section.events, app.helpers.menu.events, app.helpers.yesNo.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.campaign = options.campaign;

      this.labels = {
        transaction_with_related_parties: {
          amount_of_interest: 'Amount of Interest',
          nature_of_interest: 'Nature of Interest in Transaction',
          relationship_to_issuer: 'Relationship to Issuer',
          specified_person: 'Specified Person',
        },
      };
      this.assignLabels();

      this.createIndexes();
      this.buildSnippets(snippets);

      this.listenToNavigate();
    },

    submit(e) {
      e.preventDefault();
      let data = $(e.target).serializeJSON();

      if (data.transaction_with_related_parties_choice == false) {
        data.transaction_with_related_parties = this.model.transaction_with_related_parties;
      }

      api.submitAction.call(this, e, data);
    },

    render() {
      let template = require('./templates/relatedParties.pug');

      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          templates: this.jsonTemplates,
        })
      );
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },

    _success(data, newData) {
      this.model.updateMenu(this.model.calcProgress());
      return 1;
    },

    getSuccessUrl(data) {
      return '/formc/' + this.model.id + '/use-of-proceeds';
    },
  }, app.helpers.section.methods, app.helpers.menu.methods, app.helpers.yesNo.methods, app.helpers.confirmOnLeave.methods)),

  useOfProceeds: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id/use-of-proceeds',

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.campaign = options.campaign;

      // this.fields.custom_fn = {fn: (function (value, fn, attr, model, computed) {
      this.fields.less_offering_express.fn = this.fields.use_of_net_proceeds.fn = (function (value, fn, attr, model, computed) {
        if (!this.calculate(null)) {
          throw 'Total Use of Net Proceeds must be equal to Net Proceeds.';
        }
      }).bind(this);

      this.labels = {
        describe: 'Describe your business plan',
        business_plan: 'Please upload your business plan',
        business_plan_file_id: 'Please upload your business plan',
        less_offering_express: {},
        use_of_net_proceeds: {},
      };

      let defaultRows = {
        less_offering_express: ['Commissions and Broker Expenses', 'Misc. Offering Costs (Legal)', 'Misc. Offering Costs (Marketing)', 'Misc. Offering Costs (Admin)'],
        use_of_net_proceeds: ['Salaries, Benefits and Wages', 'Product Development', 'Marketing', 'Operations (Data, Hosting, Fees)', 'Travel, Conferences and Events'],
      };

      for (let key in defaultRows) {
        if (this.model[key].length > 0) continue;
        let titles = defaultRows[key];
        for (let i = 0; i < titles.length; i++) {
          this.model[key].push({max: 0, min: 0, title: titles[i]});
        }
      }

      let less_offering_expense = this.model['less_offering_express'];
      let commission = (less_offering_expense || []).find((item) => {
        return item.title == 'Commissions and Broker Expenses';
      });

      if(commission == null) {
        commission = {};
      }

      commission.min = Math.round(this.campaign.minimum_raise * companyFees.trans_percent / 100);
      commission.max = Math.round(this.campaign.maximum_raise * companyFees.trans_percent / 100);

      this.assignLabels();
      this.createIndexes();
      this.buildSnippets(snippets);

      this.listenToNavigate();
    },

    events: Object.assign({
      'click #submit': api.submitAction,
      'click .submit_formc': submitFormc,
      'change input[type=radio][name=doc_type]': 'changeDocType',
      // 'change .min-expense,.max-expense,.min-use,.max-use': 'calculate',
      'blur .min-expense,.max-expense,.min-use,.max-use': 'calculate',
      'click .add-sectionnew': 'addSectionNew',
      'click .delete-sectionnew': 'deleteRow',
    }, app.helpers.menu.events, app.helpers.confirmOnLeave.events),

    deleteRow(e) {
      this.deleteSectionNew(e);
      this.calculate(null);
    },

    _success(data, newData) {
      this.model.updateMenu(this.model.calcProgress());
      return 1;
    },

    getSuccessUrl() {
      return '/formc/' + this.model.id + '/risk-factors-instruction';
    },

    _getSum(selector) {
        let values = this.$(selector).map(function (e) {
          let result = parseInt($(this).val() ? $(this).val().replace(/[\$\,]/g, '') : 0);
          return result ? result : 0;
        }).toArray();
        if (values.length == 0) values.push(0);
        return values.reduce(function (total, num) { return total + num; });
    },

    calculate(e, warning=true) {
      if (e) {
        let $target = $(e.target);
        // $target.val(app.helpers.format.formatNumber($target.val()));
      }
      let minRaise = this.campaign.minimum_raise;
      let maxRaise = this.campaign.maximum_raise;

      let minNetProceeds = minRaise - this._getSum('.min-expense');
      let maxNetProceeds = maxRaise - this._getSum('.max-expense');

      this.$('.min-net-proceeds').text('$' + app.helpers.format.formatNumber(minNetProceeds));
      this.$('.max-net-proceeds').text('$' + app.helpers.format.formatNumber(maxNetProceeds));

      let minTotalUse = this._getSum('.min-use');
      let maxTotalUse = this._getSum('.max-use');

      this.$('.min-total-use').text('$' + app.helpers.format.formatNumber(minTotalUse));
      this.$('.max-total-use').text('$' + app.helpers.format.formatNumber(maxTotalUse));

      // return true if the table is valid in terms of the calculation, else return false
      let minEqual = minNetProceeds == minTotalUse;
      let maxEqual = maxNetProceeds == maxTotalUse
      let result = minEqual && maxEqual;
      if (warning) {
        if (minEqual) {
          $('.min-net-proceeds,.min-total-use').removeClass('red');
        } else {
          $('.min-net-proceeds,.min-total-use').addClass('red');
        }

        if (maxEqual) {
          $('.max-net-proceeds,.max-total-use').removeClass('red');
        } else {
          $('.max-net-proceeds,.max-total-use').addClass('red');
        }
        this.$('.min-total-use').popover(minEqual ? 'hide' : 'show');
        this.$('.max-total-use').popover(maxEqual ? 'hide' : 'show');
      }
      return result;
    },

    changeDocType(e) {
      if (e.target.value == 'describe') {
        this.$('.describe').show();
        this.$('.doc').hide();
      } else if (e.target.value == 'doc') {
        this.$('.describe').hide();
        this.$('.doc').show();
      }
    },

    submit(e) {
      var $target = $(e.target.currentTarget);
      var data = $target.serializeJSON();
      data.use_of_net_proceeds.forEach(function (elem) {
        elem.min = elem.min.replace(/,/g, '');
        elem.max = elem.max.replace(/,/g, '');
      });
      data.less_offering_express.forEach(function (elem) {
        elem.min = elem.min.replace(/,/g, '');
        elem.max = elem.max.replace(/,/g, '');
      });
      api.submitAction.call(this, e, data);
    },

    render() {
      let template = require('./templates/useOfProceeds.pug');

      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          templates: this.jsonTemplates,
          maxRaise: this.campaign.maximum_raise,
          minRaise: this.campaign.minimum_raise,
          campaignId: this.campaign.id,
          view: this
        })
      );
      this.$('.max-total-use,.min-total-use').popover({
        html: true,
        template: '<div class="popover  divPopover" style="width:160px"  role="tooltip"><span class="popover-arrow"></span> <h3 class="popover-title"></h3> <span class="icon-popover"><i class="fa fa-info-circle" aria-hidden="true"></i></span> <span class="popover-content"> XXX </span></div>'
      });

      this.calculate(null, false);
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    }, 

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      this.$('.max-total-use,.min-total-use').popover('dispose');
    },

  }, app.helpers.menu.methods, app.helpers.section.methods, app.helpers.confirmOnLeave.methods)),

  riskFactorsInstruction: Backbone.View.extend(Object.assign({
    events: Object.assign({
      'submit form': api.submitAction,
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.listenToNavigate();
    },

    render() {
      const template = require('components/formc/templates/riskFactorsInstructions.pug');
      this.$el.html(
        template({
          campaignId: this.model.campaign_id,
          values: this.model,
        })
      );
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },
  }, app.helpers.menu.methods)),

  riskFactorsMarket: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id' + '/risk-factors-market/:index',
    riskType: 'market_and_customer_risk',
    events: Object.assign({
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, riskFactors.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'There is a limited market for the Company’s product or services.',
          risk: 'Although we have identified what we believe to be a need in the market ' +
                'for our products and services, there can be no assurance that ' +
                'demand or a market will develop or that we will be able to create a viable ' +
                'business. Our future financial performance will depend, at least in part, upon ' +
                'the introduction and market acceptance of our products and services. ' +
                'Potential customers may be unwilling to accept, utilize or recommend any of our ' +
                'proposed products or services. If we are unable to commercialize and market ' +
                'such products or services when planned, we may not achieve any market ' +
                'acceptance or generate revenue.',
        },
        1: {
          title: 'We must correctly predict, identify, and interpret changes in consumer ' +
                  'preferences and demand, offer new products to meet those changes, and ' +
                  'respond to competitive innovation.',
          risk: 'Our success depends on our ability to predict, identify, and interpret the ' +
                'tastes and habits of consumers and to offer products that appeal to consumer ' +
                'preferences. If we do not offer products that appeal to consumers, our sales ' +
                'and market share will decrease. If we do not accurately predict which shifts in ' +
                'consumer preferences will be long-term, or if we fail to introduce new and ' +
                'improved products to satisfy those preferences, our sales could decline. ' +
                'If we fail to expand our product offerings successfully across product ' +
                'categories, or if we do not rapidly develop products in faster growing and ' +
                'more profitable categories, demand for our products could decrease, which ' +
                'could materially and adversely affect our product sales, financial condition, ' +
                'and results of operations.',
        },
        2: {
          title: 'We may be adversely affected by cyclicality, volatility or an extended ' +
                  'downturn in the United States or worldwide economy, or in the industries ' +
                  'we serve.',
          risk: 'Our operating results, business and financial condition could be significantly ' +
                'harmed by an extended economic downturn or future downturns, especially in ' +
                'regions or industries where our operations are heavily concentrated. Further, ' +
                'we may face increased pricing pressures during such periods as customers ' +
                'seek to use lower cost or fee services, which may adversely affect our ' +
                'financial condition and results of operations.',
        },
        3: {
          title: 'Failure to obtain new clients or renew client contracts on favorable terms ' +
                  'could adversely affect results of operations.',
          risk: 'We may face pricing pressure in obtaining and retaining our clients.  ' +
                'On some occasions, this pricing pressure may result in lower revenue from ' +
                'a client than we had anticipated based on our previous agreement with ' +
                'that client. This reduction in revenue could result in an adverse effect on ' +
                'our business and results of operations. Further, failure to renew client ' +
                'contracts on favorable terms could have an adverse effect on our business. ' +
                'If we are not successful in achieving a high rate of contract renewals on ' +
                'favorable terms, our business and results of operations could be adversely ' +
                'affected.',
        },
        4: {
          title: 'Our business and results of operations may be adversely affected if we are ' +
                  'unable to maintain our customer experience or provide high quality customer ' +
                  'service.',
          risk: 'The success of our business largely depends on our ability to provide superior ' +
                'customer experience and high quality customer service, which in turn depends ' +
                'on a variety of factors, such as our ability to continue to provide a reliable ' +
                'and user-friendly website interface for our customers to browse and purchase ' +
                'our products, reliable and timely delivery of our products, and superior after ' +
                'sales services. If our customers are not satisfied, our reputation and ' +
                'customer loyalty could be negatively affected.',
        },
      };
      this.labels = labels;
      this.assignLabels();
      this.listenToNavigate();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsMarket.pug');
      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },
  }, app.helpers.menu.methods, app.helpers.section.methods, riskFactors.methods, app.helpers.confirmOnLeave.methods)),

  riskFactorsFinancial: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id' + '/risk-factors-financial/:index',
    riskType: 'financial_risk',
    events: Object.assign({
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, riskFactors.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'The amount of capital the Company is attempting to raise in the Offering ' +
                'is not enough to sustain the Company\'s current business plan.',
          risk: 'In order to achieve the Company\'s near and long-term goals, the Company ' +
                'will need to procure funds in addition to the amount raised in this offering. ' +
                'There is no guarantee the Company will be able to raise such funds on ' +
                'acceptable terms or at all. If we are not able to raise sufficient capital ' +
                'in the future, we will not be able to execute our business plan, our ' +
                'continued operations will be in jeopardy and we may be forced to cease ' +
                'operations and sell or otherwise transfer all or substantially all of our ' +
                'remaining assets.',
        },
        1: {
          title: 'Our company may need additional funding in the future, which may not ' +
                'be available.',
          risk: 'The Company’s operations may require additional capital sooner than currently ' +
                'anticipated.  If the Company is unable to obtain additional capital if needed, ' +
                'in the amount and at the time needed, this may restrict planned or ' +
                'future development; limit our company’s ability to take advantage of ' +
                'future opportunities; negatively affect its ability to implement its business ' +
                'strategies and meet its goals; and possibly limit its ability to continue ' +
                'operations. The company’s working capital requirements may significantly vary ' +
                'from those currently anticipated.',
        },
        2: {
          title: 'Our company may be required to take on debt which could result in limitations ' +
                  'on our business.',
          risk: 'If the Company incurs indebtedness, a portion of its cash flow will have ' +
                'to be dedicated to the payment of principal and interest on such indebtedness. ' +
                'Typical loan agreements also might contain restrictive covenants, which may ' +
                'impair the Company’s operating flexibility. Such loan agreements would also ' +
                'provide for default under certain circumstances, such as failure to meet ' +
                'certain financial covenants. A default under a loan agreement could result in ' +
                'the loan becoming immediately due and payable and, if unpaid, a judgment in ' +
                'favor of such lender which would be senior to the rights of shareholders of ' +
                'the Company. A judgment creditor would have the right to foreclose on any of ' +
                'the Company\'s assets resulting in a material adverse effect on the Company\'s ' +
                'business, operating results or financial condition.',
        },
        3: {
          title: 'The Company has prepared only unaudited financial statements in connection ' +
                  'with this offering, which may not be reliable.',
          risk: 'In addition to the unaudited financial statement presented, we expect to ' +
                'prepare financial statements on a periodic basis. The financial data presented ' +
                'has not been audited or reviewed. In preparing the financial statements, ' +
                'we have made certain assumptions concerning our business and the market which ' +
                'may not be accurate.  Investors are encouraged to review any statements with an ' +
                'independent accountant and should not invest if they believe that they have ' +
                'insufficient information.',
        },
        4: {
          title: 'The Company’s future revenue goals are unpredictable and may fluctuate.',
          risk: 'The Company has forecasted its capitalization requirements based on sales ' +
                'goals and cost containment measures; any changes to these forecasts could make ' +
                'it difficult for the company to achieve its projected growth, which would ' +
                'affect available cash and working capital, ultimately affecting the Company\'s ' +
                'financial condition. This could put the investor at risk of losing their ' +
                'investment.',
        },
        5: {
          title: 'Our operating costs are unpredictable and our operating results may ' +
                'fluctuate due to factors that are difficult to forecast and not within ' +
                'our control.',
          risk: 'In addition to general economic conditions and market fluctuations, significant ' +
                'operating cost increases could adversely affect us due to numerous factors, ' +
                'many of which are beyond our control. Increases in operating costs would likely ' +
                'negatively impact our operating income and could undermine our ability to grow ' +
                'our business.Our past operating results may not be accurate indicators of ' +
                'future performance, and you should not rely on such results to predict our ' +
                'future performance.',
        },
      };

      this.labels = labels;
      this.assignLabels();

      this.listenToNavigate();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsFinancial.pug');
      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },
  }, app.helpers.menu.methods, app.helpers.section.methods, riskFactors.methods, app.helpers.confirmOnLeave.methods)),

  riskFactorsOperational: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id' + '/risk-factors-operational/:index',
    riskType: 'operational_risk',
    events: Object.assign({
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, riskFactors.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'We have a limited operating history upon which you can evaluate ' +
                  'our performance.',
          risk: 'We have a limited history upon which an evaluation of our prospects and ' +
                'future performance can be made. Our proposed operations are subject to all ' +
                'business risks associated with new enterprises. The likelihood of our creation ' +
                'of a viable business must be considered in light of the problems, expenses, ' +
                'difficulties, complications, and delays frequently encountered in connection ' +
                'with the inception of a business, operation in a competitive industry, and the ' +
                'continued development of advertising, promotions, and a corresponding ' +
                'client base.',
        },
        1: {
          title: 'We plan to implement new lines of business or offer new products and service.',
          risk: 'In developing and marketing new lines of business and/or new products and ' +
                'services, we may invest significant time and resources. Initial timetables for ' +
                'the introduction and development of new lines of business and/or new products ' +
                'or services may not be achieved and price and profitability targets may not ' +
                'prove feasible. We may not be successful in introducing new products and ' +
                'services in response to industry trends or developments in technology, or ' +
                'those new products may not achieve market acceptance. As a result, we could ' +
                'lose business, be forced to price products and services on less advantageous ' +
                'terms to retain or attract clients or be subject to cost increases. ' +
                'As a result, our business, financial condition or results of operations may ' +
                'be adversely affected.',
        },
        2: {
          title: 'If the Company fails to achieve certain operational goals it may incur ' +
                  'significant losses and there can be no assurance that the Company will ' +
                  'become a profitable business.',
          risk: 'The Company’s ability to become profitable depends upon successfully executing ' +
                'on operational goals, such as successful marketing efforts and generating ' +
                'cash flow from operations. There can be no assurance that this will occur. ' +
                'Unanticipated operational problems and executional expenses may impact whether ' +
                'the Company is successful.  If the Company sustains losses over an extended ' +
                'period of time, it may be unable to continue in business and may need to make ' +
                'significant modifications to its stated strategies. Although the management ' +
                'team may have had some success in the past, they may be unable to meet future ' +
                'business objectives due to unanticipated operations challenges.',
        },
        3: {
          title: 'Incidents of hacking, identity theft, cyberterrorism or climate change may ' +
                  'adversely impact our operations.',
          risk: 'Our business operations may at times be dependent upon digital technologies, ' +
                'including information systems, infrastructure and cloud applications. ' +
                'The U.S. government has issued public warnings that indicate that such ' +
                'business information technology might be susceptible to cyber security threats, ' +
                'including hacking, identity theft and acts of cyberterrorism. Additionally, ' +
                'our critical systems may be vulnerable to damage or interruption from ' +
                'earthquakes, storms, terrorist attacks, floods, fires, power loss, ' +
                'telecommunications failures, computer viruses, computer denial of service ' +
                'attacks, or other attempts to harm the systems, whether man made or ' +
                'acts of nature. Many of these systems will not be fully redundant, ' +
                'and disaster recovery planning cannot account for all eventualities. ' +
                'As cyber incidents continue to evolve and as severe weather related events ' +
                'become more extreme, we may be required to expend additional resources to ' +
                'modify or enhance our protective measures or to investigate and remediate any ' +
                'vulnerability to cyber incidents or natural disasters.',
        },
        4: {
          title: 'Certain future relationships have not been established and existing ' +
                  'relationships are not guaranteed to endure.',
          risk: 'The Company has established and will establish certain relationships with ' +
                'others. We will need to maintain such relationships and, in some cases, ' +
                'establish new ones or replace existing ones. There will be several agreements ' +
                'and documents that remain to be negotiated, executed, and implemented with ' +
                'respect to certain aspects of our planned operations. In some cases, ' +
                'the parties with whom we would need to establish a relationship may not ' +
                'yet be identified. If we are unable to enter into these agreements or ' +
                'relationships on satisfactory terms, our operations could be delayed or ' +
                'curtailed, expenses could be increased, and profitability and the likelihood ' +
                'of returns to investors could be adversely affected.',
        },
        5: {
          title: 'We may experience defects and system failures which would harm our business ' +
                  'and reputation and expose us to potential liability.',
          risk: 'We may encounter delays when developing new products and services. ' +
                'Alternatively, any new products and services may in the future contain ' +
                'undetected errors or defects when first introduced.  Defects, errors or ' +
                'delays in development of our products or services could result in an ' +
                'interruption of business operations; a delay in market acceptance; ' +
                'additional development and remediation costs; diversion of technical and ' +
                'other resources; a loss of customers; negative publicity; or exposure ' +
                'to liability claims.  Any one or more of the foregoing occurrences could have ' +
                'a material adverse effect on our business, financial condition and results ' +
                'of operations, or could cause our business to fail.',
        },
        6: {
          title: 'Our advertising and marketing efforts may be costly and may not achieve ' +
                  'desired results.',
          risk: 'Although we target our advertising and marketing efforts on current and ' +
                'potential customers who we believe are likely to be in the market for the ' +
                'products we sell, we cannot assure you that our advertising and marketing ' +
                'efforts will achieve our desired results. In addition, we periodically adjust ' +
                'our advertising expenditures in an effort to optimize the return on such ' +
                'expenditures. Any decrease in the level of our advertising expenditures, ' +
                'which may be made to optimize such return could adversely affect our sales.',
        },
      };

      this.labels = labels;
      this.assignLabels();

      this.listenToNavigate();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsOperational.pug');
      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );

      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },

  }, app.helpers.menu.methods, app.helpers.section.methods, riskFactors.methods, app.helpers.confirmOnLeave.methods)),

  riskFactorsCompetitive: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id' + '/risk-factors-competitive/:index',
    riskType: 'competitive_risk',
    events: Object.assign({
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, riskFactors.events, app.helpers.confirmOnLeave.methods),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'The development and commercialization of our services is highly competitive.',
          risk: 'Many of our competitors have significantly greater financial, technical and ' +
                'human resources than we have. Accordingly, our competitors may commercialize ' +
                'products more rapidly or effectively than we are able to, which would adversely ' +
                'affect our competitive position.',
        },
        1: {
          title: 'Many of our competitors have greater brand recognition and more extensive ' +
                  'resources.',
          risk: 'This may place us at a disadvantage in responding to our competitors\' pricing ' +
                'strategies, advertising campaigns, strategic alliances and other initiatives. ' +
                'Consequently, such competitors may be in a better position than the Company ' +
                'to take advantage of customer acquisition and business opportunities ' +
                'and devote greater resources to marketing and sale of their offerings. ' +
                'These competitors may limit our opportunity to acquire customers and facilitate ' +
                'business arrangements.  There is no certainty that the Company will be able ' +
                'to compete successfully. If the Company cannot break through and compete ' +
                'successfully, investors may be at risk of losing their investment.',
        },
        2: {
          title: 'The Company may not be able to create and maintain a competitive advantage.',
          risk: 'The demand for our products or services may change and we may have difficulty ' +
                'maintaining a competitive advantage within our market.  The Company\'s success ' +
                'could depend on the ability of management to respond to changing situations, ' +
                'standards and customer needs on a timely and cost-effective basis. In addition, ' +
                'any failure by the management to anticipate or respond adequately to changes in ' +
                'customer preferences and demand could have a material adverse effect on our ' +
                'financial condition, operating results and cash flow.',
        },
        3: {
          title: 'New competitors may enter our market in a manner that could make it difficult ' +
                  'to differentiate our Company.',
          risk: 'While the Company is aware of certain competitors in the market, there is ' +
                'the possibility that new competitors may enter and that they may be better ' +
                'funded.  To the extent that the market becomes more crowded, this may make it ' +
                'more difficult for us to differentiate our value proposition or to get in front ' +
                'of right partners and customers.  It may be difficult to compete with new ' +
                'entrants if there is pricing pressure or changes in market demand.   ' +
                'The Company may also have a hard time competing against companies who can ' +
                'negotiate for better prices from suppliers, produce goods and services on ' +
                'a large scale more economically, or take advantage of bigger marketing budgets.',
        },
      };

      this.labels = labels;
      this.assignLabels();

      this.listenToNavigate();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsCompetitive.pug');
      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },

  }, app.helpers.menu.methods, app.helpers.section.methods, riskFactors.methods, app.helpers.confirmOnLeave.methods)),

  riskFactorsPersonnel: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id' + '/risk-factors-personnel/:index',
    riskType: 'personnel_and_third_parties_risk',
    events: Object.assign({
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, riskFactors.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'Our company may be unable to retain senior personnel. ',
          risk: 'We believe that our success will depend on the continued employment of our ' +
                'senior management and key personnel. If one or more members of our senior ' +
                'management were unable or unwilling to continue in their present positions, ' +
                'our business and operations could be disrupted and this could put the overall ' +
                'business at risk. ',
        },
        1: {
          title: 'In order for the Company to compete and grow, it must attract, recruit ' +
                  'and develop the new personnel who have the needed experience.',
          risk: 'Recruiting and retaining highly qualified personnel is critical to our success. ' +
                'These demands may require us to hire additional personnel and will require our ' +
                'existing management personnel to develop additional expertise. If we ' +
                'experience difficulties in hiring and retaining personnel in key positions, we ' +
                'could suffer from delays in development, loss of customers and sales and ' +
                'diversion of management resources, which could adversely affect operating ' +
                'results.',
        },
        2: {
          title: 'Although dependent on certain key personnel, the Company does not have any ' +
                'life insurance policies on any such individuals.',
          risk: 'While the Company is dependent on key personnel in order to conduct its ' +
                'operations and execute its business plan, the Company has not purchased any ' +
                'insurance policies with respect to the death or disability of those ' +
                'individuals. Therefore, in the event that any of the Company\'s employees ' +
                'die or become disabled, the Company will not receive any insurance proceeds as ' +
                'compensation for such person\'s absence. The loss of such person could ' +
                'negatively affect the Company and its operations.',
        },
        3: {
          title: 'The Company relies on third-parties over which the Company has little control; ' +
                'third party failures could negatively affect the Company\'s business.',
          risk: 'While the Company intends to implement rigorous standards in selecting third ' +
                'party relationships and vendors, if a third-party fails to meet its obligations ' +
                'or provide the products or services required by the Company, the Company\'s ' +
                'operations and reputation may suffer.',
        },
        4: {
          title: 'We outsource a number of our non-core functions and operations.',
          risk: 'In certain instances, we rely on single or limited service providers and ' +
                'outsourcing vendors because the relationship is advantageous due to quality, ' +
                'price, or lack of alternative sources. If our third party services were ' +
                'interrupted and we were not able to find alternate third-party providers, ' +
                'we could experience disruptions.   Such interruptions could result in damage ' +
                'to our reputation and customer relationships and adversely affect our business. ' +
                'These events could materially and adversely affect our ability to retain and ' +
                'attract customers and have a material negative impact on our operations, ' +
                'business, financial results and financial condition.',
        },
        5: {
          title: 'The Company may not be able to adequately ensure the loyalty and ' +
                  'confidentiality of employees and third parties.',
          risk: 'The Company may rely on nondisclosure and noncompetition agreements with ' +
                'employees, consultants and other parties to protect, in part, trade secrets and ' +
                'other proprietary rights. There can be no assurance that these agreements will ' +
                'adequately protect the Company’s trade secrets and other proprietary rights and ' +
                'will not be breached, that the Company will have adequate remedies for any ' +
                'breach, that others will not independently develop substantially equivalent ' +
                'proprietary information or that third parties will not otherwise gain access ' +
                'to our trade secrets or other proprietary rights.',
        },
      };

      this.labels = labels;
      this.assignLabels();

      this.listenToNavigate();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsPersonnel.pug');
      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },
  }, app.helpers.menu.methods, app.helpers.section.methods, riskFactors.methods, app.helpers.confirmOnLeave.methods)),

  riskFactorsLegal: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id' + '/risk-factors-legal/:index',
    riskType: 'legal_and_regulatory_risk',
    events: Object.assign({
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, riskFactors.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'We rely on various intellectual property rights in order to operate our ' +
                  'business and these rights may be challenged.',
          risk: 'The Company’s intellectual property rights may not be sufficiently broad and ' +
                'may not provide a significant competitive advantage. The steps that the Company ' +
                'has taken to maintain and protect its intellectual property may not prevent ' +
                'it from being challenged, invalidated or circumvented. In some circumstances, ' +
                'enforcement may not be available to us because an infringer has a dominant ' +
                'intellectual property position or for other business reasons. The Company\'s ' +
                'failure to obtain or maintain intellectual property rights that convey ' +
                'competitive advantage, adequately protect its intellectual property or detect ' +
                'or prevent circumvention or unauthorized use of such property, could adversely ' +
                'impact the Company\'s competitive position and results of operations.',
        },
        1: {
          title: 'From time to time, third parties may claim that one or more of our products ' +
                'or services infringe their intellectual property rights.',
          risk: 'Any dispute or litigation regarding future intellectual property could be ' +
                'costly and time-consuming due to the uncertainty of intellectual property ' +
                'litigation and could divert our management and key personnel from our business ' +
                'operations. A claim of intellectual property infringement could force us to ' +
                'enter into a costly or restrictive license agreement, which might not be ' +
                'available under acceptable terms or at all.  This could require us to redesign ' +
                'our products, which would be costly and time-consuming, and/or could subject us ' +
                'to an injunction against development and sale of certain of our products or ' +
                'services. We may have to pay substantial damages, including damages for past ' +
                'infringement if it is ultimately determined that our product candidates ' +
                'infringe a third party’s proprietary rights. Even if these claims are without ' +
                'merit, defending a lawsuit takes significant time, may be expensive and may ' +
                'divert management’s attention from other business concerns. Any public ' +
                'announcements related to litigation or interference proceedings initiated or ' +
                'threatened against as could cause our business to be harmed. Our intellectual ' +
                'property portfolio may not be useful in asserting a counterclaim or ' +
                'negotiating a license, in response to a claim of intellectual property ' +
                'infringement. In certain of our businesses we rely on third party intellectual ' +
                'property licenses and we cannot ensure that these licenses will be available to ' +
                'us in the future on favorable terms or at all.',
        },
        2: {
          title: 'A sizable proportion of the products that we manufacture, source, distribute ' +
                  'or market are required to comply with regulatory requirements.',
          risk: 'To lawfully operate our businesses, we are required to hold permits, licenses ' +
                'and other regulatory approvals from, and to comply with operating and security ' +
                'standards of, governmental bodies. Failure to maintain or renew necessary ' +
                'permits, licenses or approvals, or noncompliance or concerns over noncompliance ' +
                'may result in suspension of our ability to distribute, import or manufacture ' +
                'products, product recalls or seizures, or criminal and civil sanctions and ' +
                'could have an adverse effect on our results of operations and financial ' +
                'condition.',
        },
        3: {
          title: 'There is risk associated with the Company’s indemnification of ' +
                  'affiliated parties.',
          risk: 'Our Directors and executive officers will be relieved of liability to the ' +
                'Company or our Shareholders for monetary damages for conduct as Directors and ' +
                'executive officers. We may also enter into indemnity agreements with our ' +
                'Directors and executive officers. The exculpation provisions contained therein ' +
                'may have the effect of preventing shareholders from recovering damages against ' +
                'our Directors and executive officers caused by poor judgment or other ' +
                'circumstances. The indemnification provisions may require us to use our assets ' +
                'to defend our Directors and executive officers against claims, including claims ' +
                'arising out of negligence, poor judgment, or other circumstances. ' +
                'The indemnification obligations of the Company will be payable from the ' +
                'assets of the Company.',
        },
        4: {
          title: 'Changes in federal, state or local laws and regulations could increase our ' +
                  'expenses and adversely affect our results of operations.',
          risk: 'Our business is subject to a wide array of laws and regulations. The current ' +
                'political environment, financial reform legislation, the current high level of ' +
                'government intervention and activism and regulatory reform may result in ' +
                'substantial new regulations and disclosure obligations and/or changes in the ' +
                'interpretation of existing laws and regulations, which may lead to additional ' +
                'compliance costs as well as the diversion of our management’s time and ' +
                'attention from strategic initiatives. If we fail to comply with applicable laws ' +
                'and regulations we could be subject to legal risk, including government ' +
                'enforcement action and class action civil litigation that could disrupt our ' +
                'operations and increase our costs of doing business. Changes in the regulatory ' +
                'environment regarding topics such as privacy and information security, product ' +
                'safety or environmental protection, including regulations in response to ' +
                'concerns regarding climate change, collective bargaining activities, minimum ' +
                'wage laws and health care mandates, among others, could also cause our ' +
                'compliance costs to increase and adversely affect our business and results ' +
                'of operations.',
        },
      };
      this.labels = labels;
      this.assignLabels();

      this.listenToNavigate();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsLegal.pug');
      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },
  }, app.helpers.menu.methods, app.helpers.section.methods, riskFactors.methods, app.helpers.confirmOnLeave.methods)),

  riskFactorsMisc: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id' + '/risk-factors-misc/:index',
    riskType: 'miscellaneous_risk',
    events: Object.assign({
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, riskFactors.events, app.helpers.confirmOnLeave.events),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {};
      this.labels = labels;
      this.assignLabels();

      this.listenToNavigate();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsMisc.pug');
      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },
  }, app.helpers.menu.methods, app.helpers.section.methods, riskFactors.methods, app.helpers.confirmOnLeave.methods)),

  xeroIntegration: Backbone.View.extend({
    urlRoot: app.config.formcServer + '/:id/financial-condition/xero',

    events: Object.assign({
      'click .xeroConnect': 'xeroConnect',
      'click .xeroGrabData': 'xeroGrabData',
      'click .saveCheckboxValue': 'saveCheckboxValue',
    }),

    initialize(options) {
      this.oldView = options.oldView;
      this.listenToNavigate();

      if(document.location.href.indexOf('oauth_token=') !== -1) {
        app.showLoading();
        this.xeroGrabData();
      }
    },

    render() {
      let template = require('./templates/xeroIntegration.pug');
      this.fields = {
        code: {
          type: 'number',
          required: true
        },
        documents: {
          type: 'json',
          required: true,
          fn: function checkNotEmpty(name, value, attr, data, computed) {
            if(value.length == 0) {
              throw 'Please select at least on document';
            }
          },
        }
      }

      this.$el.html(
        template({
          view: this,
          fields: this.fields
        })
      );
      return this;
    },

    saveCheckboxValue(e) {
      let docs = localStorage.getItem('xero_docs');

      if(docs !== null) {
        docs = JSON.parse(docs);
      } else {
        docs = [];
      }

      if (e.target.checked == true) {
        let index = docs.findIndex((el) => el == e.target.value);
        if (index === -1) {
          docs.push(e.target.value);
        }
      } else {
        let index = docs.findIndex((el) => el == e.target.value);
        if (index !== -1) {
          docs.slice(index-1, 1);
        }
      }

      localStorage.setItem('xero_docs', JSON.stringify(docs));
    },

    xeroConnect(e) {
      api.makeRequest(this.urlRoot.replace(':id', this.model.id)).
        then((data) => {
          localStorage.setItem('xero_docs', '[]');
          localStorage.setItem('xero_credentials', data.credentials);
          this.el.querySelector('#url').href = data.url;
          this.$el.find('#xeroModal').modal('show');
        });
    },

    xeroGrabData(e) {

      if (e) {
        e.preventDefault();
      }

      this.$('.help-block').remove();

      let data = {};
      data.credentials = localStorage.getItem('xero_credentials');
      data.id = this.model.id;
      data.documents = JSON.parse(localStorage.getItem('xero_docs'));
      data.code = app.getParams().oauth_verifier;

      if(!app.validation.validate(this.fields, data, this)) {
        Object.keys(app.validation.errors).forEach((key) => {
          const errors = app.validation.errors[key];
          app.validation.invalidMsg(this, key, errors);
        });
        this.$('.help-block').prev().scrollTo(5);
        e.target.removeAttribute('disabled');
        return false;
      } else {
        api.makeRequest(
            app.config.formcServer + '/' + this.model.id + '/financial-condition/xero',
            'PUT',
            data
        ).then((data) => {

          if (data.length  === 0) {
            app.hideLoading();
            return false;
          }

          localStorage.removeItem('xero_docs');
          localStorage.removeItem('xero_credentials');
          $('#xeroBlock').scrollTo(-25);
          const Folder = require('models/folder.js');
          this.model.fiscal_recent_group_data = data;
          this.model.fiscal_recent_group_id = new Folder(
            this.model.url,
            this.model.fiscal_recent_group_id.id,
            this.model.fiscal_recent_group_data
          );
          var fileFolderDropzone = require('directives/setdropzone/folder.js'); 
          var el = new fileFolderDropzone.FolderDropzone(this.oldView,
            'fiscal_recent_group_id',
            'fiscal_recent_group_data',
            this.oldView.fields.fiscal_recent_group_id
          );
          document.querySelector('.fiscal_recent_group_id').parentElement.innerHTML = el.render().resultHTML;
          app.hideLoading();
          //window.location.reload();
        }).fail((xhr, message) => {
          app.hideLoading();
        });
      }

    },

  }),

  financialCondition: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id/financial-condition',

    events: Object.assign({
      'submit form': api.submitAction,
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, app.helpers.yesNo.events, app.helpers.section.events, /*app.helpers.confirmOnLeave.events*/),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.campaign = options.campaign;
      this.labels = {
        sold_securities_data: {
          taxable_income: "Taxable Income",
          total_income: "Total Income",
          total_tax: "Total Tax",
          total_assets: "Total Assets",
          long_term_debt: "Long Term Debt",
          short_term_debt: "Short Term Debt",
          cost_of_goods_sold: "Cost of Goods Sold",
          account_receivable: "Account Receivable",
          cash_and_equivalents: "Cash Equivalents",
          revenues_sales: "Revenues Sales",
        },
        sold_securities_amount: "How much have you sold within the preceeding 12-month period?",
        fiscal_recent_group_id: "Upload financials for most recent fiscal year",
        fiscal_prior_group_id: "Upload financials for prior fiscal year",
        financials_condition_no: "Please discuss financial milestones and operational, liquidity and other challenges.  Please discuss how the proceeds from the offering will affect your liquidity, whether these funds are necessary to the viability of the business, and how quickly you anticipate using your available cash. Please also discuss other available sources of capital, such as lines of credit or required contributions by shareholders, for example.",
        financials_condition_yes: "Please discuss your historical results for each period for which you provide financial statements.  The discussion should focus on financial milestones and operational, liquidity and other challenges.  Please also discuss whether historical results and cash flows are representative of what investors should expect in the future. Take into account the proceeds of the offering and any other known sources of capital. Please discuss how the proceeds from the offering will affect your liquidity, whether these funds are necessary to the viability of the business, and how quickly you anticipate using your available cash.  Please also discuss other available sources of capital, such as lines of credit or required contributions by shareholders, for example. ",
      };
      this.assignLabels();

      this.createIndexes();
      this.buildSnippets(snippets, {campaign: this.campaign});

      this.listenToNavigate();
    },

    _success(data, newData) {
      this.model.updateMenu(this.model.calcProgress());
      return 1;
    },

    getSuccessUrl() {
      return '/formc/' + this.model.id + '/outstanding-security';
    },

    render() {
      let template = require('./templates/financialCondition.pug');

      const View = require('components/formc/views.js');

      this.$el.html(
        template({
          view: this,
          fields: this.fields,
          values: this.model,
          campaignId: this.campaign.id,
          templates: this.jsonTemplates,
        })
      );
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());

       this.xeroIntegration =  new View.xeroIntegration({
        model: this.model,
        el: this.el.querySelector('#xeroBlock'),
        oldView: this
      });
      this.xeroIntegration.render();
      this.xeroIntegration.delegateEvents();
      return this;
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      if (this.xeroIntegration) {
        this.xeroIntegration.destroy();
        this.xeroIntegration = null;
      }
    },
  }, app.helpers.menu.methods, app.helpers.yesNo.methods, app.helpers.section.methods, app.helpers.confirmOnLeave.methods)),

  outstandingSecurity: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id/outstanding-security',
    events: Object.assign({
      'submit #security_model_form': 'addOutstanding',
      'change #security_type': 'outstandingSecurityUpdate',
      'click #submitForm': 'submit',
      'click .submit_formc': submitFormc,
      'click .newOustanding': 'newOustanding',
      'click .editOutstanding': 'editOutstanding',
      'click .delete-outstanding': 'deleteOutstanding',
    }, app.helpers.section.events, app.helpers.menu.events, app.helpers.yesNo.events, /*app.helpers.confirmOnLeave.events*/),

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.fields.business_loans_or_debt_choice.validate = {};
      this.fields.business_loans_or_debt_choice.validate.choices = {
        1: 'Yes',
        0: 'No',
      };
      this.fields.exempt_offering_choice.validate = {};
      this.fields.exempt_offering_choice.validate.choices = {
        1: 'Yes',
        0: 'No',
      };
      this.fields.outstanding_securities.schema.security_type.type = 'choice';
      this.fields.outstanding_securities.schema.security_type.validate = {};
      this.fields.outstanding_securities.schema.security_type.validate.choices = securityTypeConsts.SECURITY_TYPES;
      this.fields.outstanding_securities.schema.voting_right.type = 'radio';
      this.fields.outstanding_securities.schema.voting_right.validate = {};
      this.fields.outstanding_securities.schema.voting_right.validate.choices = {
        1: 'Yes',
        0: 'No',
      };
      this.fields.outstanding_securities.schema.amount_authorized.type = 'money';
      this.fields.outstanding_securities.schema.amount_authorized.required = true;
      this.fields.outstanding_securities.schema.amount_outstanding.type = 'money';
      this.fields.outstanding_securities.schema.amount_outstanding.required = true;

      this.fields.business_loans_or_debt.schema.interest_rate.type = 'percent';

      this.labels = {
        outstanding_securities: {
          security_type: "Security Type",
          custom_security_type: "Custom Security Type",
          other_rights: "Other Rights",
          amount_authorized: "Amount Authorized",
          amount_outstanding: "Amount Outstanding",
          voting_right: "Voting right",
          terms_and_rights: "Describe all material terms and rights",
        },
        exempt_offering: {
          exemption_relied_upon: 'Exemption Relied upon',
          use_of_proceeds: 'Use of Proceeds',
          offering_date: 'Date of The Offering',
          amount_sold: 'Amount Sold',
          securities_offered: 'Securities Offered',
        },
        business_loans_or_debt: {
          maturity_date: 'Maturity Date',
          outstanding_amount: 'Outstanding Amount',
          interest_rate: 'Interest Rate',
          other_material_terms: 'Other Material Terms',
          creditor: 'Creditor',
        },
        business_loans_or_debt_choice: 'Do you have any business loans or debt?',
        exempt_offering_choice: 'An "exempt offering" is any offering of securities which is exempted from the registration requirements of the Securities Act. Have you conducted any exempt offerings in the past three years?',
        exercise_of_rights: 'How could the exercise of rights held by the principal shareholders affect the purchasers of the securities being offered?',
        risks_to_purchasers: '',
        terms_of_securities: 'How may the terms of the securities being offered be modified? <div class="d-inline-block"><div class="showPopover hidden-xs-down" data-content="What would it take to amend the provisions of the security being offered and is there any minimum amount of consent that would be required to make such an amendment possible (such as a majority of voting power)?" data-original-title="" title=""><i class="fa fa-question-circle text-muted" aria-hidden="true"></i></div></div>',
        security_differences: 'Are there any differences not reflected above between the ' +
                              'securities being offered and each other class of security of ' +
                              'the issuer?',
        rights_of_securities: 'How may the rights of the securities being offered be materially limited, ' +
                              'diluted or qualified by the rights of any other class of security identified above?' +
                              ' <div class="d-inline-block"><div class="showPopover hidden-xs-down" data-content=" Is there any action that common or preferred holders could take against the group of investors in this offering that would limit their rights?  Are there any resolutions that could be passed or votes that could be taken to alter or diminish the rights of the investors in this offering?" data-original-title="" title=""><i class="fa fa-question-circle text-muted" aria-hidden="true"></i></div></div>',
      };
      this.assignLabels();

      this.createIndexes();
      this.buildSnippets(snippets);
      this.listenToNavigate();
    },

    newOustanding(e) {
      e.preventDefault();
      this.el.querySelector('#security_type').selectedIndex = "";
      this.el.querySelector('#terms_and_rights').value = "";
      this.el.querySelector('#amount_authorized').value = "";
      this.el.querySelector('#amount_outstanding').value = "";
      this.el.querySelector('input[name="voting_right"][value="0"]').checked = false;
      this.el.querySelector('input[name="voting_right"][value="1"]').checked = false;
      this.el.querySelector('#custom_security_type').value = '';
      this.el.querySelector('#security_model_form').dataset.update = -1;
      this.el.querySelector('.custom_security_type').style.display = 'none';
      $('#security_modal').modal();
    },

    outstandingSecurityUpdate(e) {
      if (e.target.options[e.target.selectedIndex].value == '5') {
        $('#security_modal #custom_security_type').parent().parent().show();
      } else {
        $('#security_modal #custom_security_type').parent().parent().hide();
      }
    },

    editOutstanding(e) {
      e.preventDefault();
      const data = this.model.outstanding_securities[e.currentTarget.dataset.index];

      if(data.amount_authorized == null || data.amount_authorized == "") {
        data.amount_authorized = 'n/a';
      }

      this.el.querySelector('#security_type').selectedIndex = data.security_type;
      this.el.querySelector('#terms_and_rights').value = data.terms_and_rights;
      this.el.querySelector('#amount_authorized').value = app.helpers.format.formatPrice(data.amount_authorized);
      this.el.querySelector('#amount_outstanding').value = app.helpers.format.formatPrice(data.amount_outstanding);
      this.el.querySelector('input[name="voting_right"][value="' + (+data.voting_right) + '"]').checked = true;
      this.el.querySelector('#custom_security_type').value = data.custom_security_type;
      this.el.querySelector('#security_model_form').dataset.update = e.currentTarget.dataset.index;

      if(data.security_type == 5) {
          this.el.querySelector('.custom_security_type').style.display = 'block';
      }
      $('#security_modal').modal();
    },

    addOutstanding(e) {
      e.preventDefault();
      const data = $(e.target).serializeJSON();

      //work around NaN values in decimal field type serialization
      if (isNaN(data.amount_authorized))
        delete data.amount_authorized;

      if (isNaN(data.amount_outstanding))
        delete data.amount_outstanding;

      const sectionName = e.target.dataset.section;
      const template = require('./templates/snippets/outstanding_securities.pug');

      if(typeof data.amount_authorized == 'string') {
        if(data.amount_authorized.toLocaleLowerCase() == 'n/a' ||
          data.amount_authorized.toLocaleLowerCase() == 'not available' ||
          data.amount_authorized.toLocaleLowerCase() == 'na') {
            data.amount_authorized = null;
        } else {
          data.amount_authorized = Math.round(
            data.amount_authorized.replace(/[\$\,]/g, '') * 100 
          ) / 100;
        }
      }

      if (data.amount_outstanding) {
        data.amount_outstanding = Math.round(
            data.amount_outstanding * 100
        ) / 100;
      }

      if (!app.validation.validate(this.fields.outstanding_securities.schema, data, this)) {
        Object.keys(app.validation.errors).forEach((key) => {
          const errors = app.validation.errors[key];
          app.validation.invalidMsg(this, key, errors);
        });
        this.$('.help-block').prev().scrollTo(5);
        return;
      } else {

        if(e.currentTarget.dataset.update == -1) {
          this.$el.find('.outstanding_securities_block').show();
          $('.' + sectionName + '_container').append(
            template({
              fields: this.fields[sectionName],
              name: sectionName,
              attr: this.fields[sectionName],
              value: data,
              index: this[sectionName + 'Index'],
            })
          );

          this.model[sectionName].push(data);
          this[sectionName + 'Index']++;
        } else {
          this.model[sectionName][e.currentTarget.dataset.update]= data;
        }

        this.el.querySelector('#security_model_form').dataset.update = -1;

        $('#security_modal').modal('hide');

        e.target.querySelectorAll('input').forEach(function(el, i) {
          if (el.type == "radio") el.checked = false; 
          else el.value = '';
        });

        e.target.querySelector('textarea').value = '';
        api.makeRequest(
          this.urlRoot.replace(':id', this.model.id),
          'PATCH',
          {'outstanding_securities': this.model[sectionName]}
        );
      };
    },

    deleteOutstanding(e) {
      e.preventDefault();
      const target = e.currentTarget;
      const sectionName = target.dataset.section;
      const index = target.dataset.index;

      app.dialogs.confirm('Are you sure?').then((confirmed) => {
        if (!confirmed)
          return;

        this.$('.' + sectionName + '_container tr[data-index=' + index + ']').remove();
        this.model[sectionName].splice(index, 1);

        // Reorganize indice
        this.$('.' + sectionName + '_container tr').each(function (idx, elem) {
          $(this).attr('data-index', idx);
          $(this).find('a').attr('data-index', idx);
        });

        // ToDo
        // Fix index counter
        this[sectionName + 'Index']--;
        this.$('.' + sectionName + '_container tr')

        api.makeRequest(
          this.urlRoot.replace(':id', this.model.id),
          'PATCH',
          {'outstanding_securities': this.model[sectionName]}
        );
      });
    },

    _success(data, newData) {
      this.model.updateMenu(this.model.calcProgress());
      return true;
    },

    getSuccessUrl() {
      return '/formc/' + this.model.id + '/background-check';
    },

    render() {
      let template = require('./templates/outstandingSecurity.pug');

      if (this.model.outstanding_securities) {
        this.outstanding_securitiesIndex = Object.keys(this.model.outstanding_securities).length;
      } else {
        this.outstanding_securitiesIndex = 0;
      }

      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
          templates: this.jsonTemplates,
        })
      );
      $('#security_modal #custom_security_type').parent().parent().hide();
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },

    submit(e) {
      e.preventDefault();

      let data = $(e.currentTarget).closest('form').serializeJSON();

      if (data.business_loans_or_debt_choice === false) {
        data.business_loans_or_debt = [];
      }

      if (data.exempt_offering_choice === false) {
        data.exempt_offering = [];
      }

      return api.submitAction.call(this, e, data);
    },
  }, app.helpers.section.methods, app.helpers.menu.methods, app.helpers.yesNo.methods, app.helpers.confirmOnLeave.methods)),

  backgroundCheck: Backbone.View.extend(Object.assign({
    urlRoot: app.config.formcServer + '/:id' + '/background-check',

    initialize(options) {
      this.model = options.formc;
      this.campaign = options.campaign;
      this.fields = options.fields;
      this.labels = {
        company_or_director_subjected_to: 'If Yes, Explain',
        descrption_material_information: '2) If you\'ve provided any information in a format, ' +
            'media or other means not able to be reflected in text or pdf, please include here: ' +
            '(a) a description of the material content of such information; (b) a description of ' +
            'the format in which such disclosure is presented; and (c) in the case of disclosure ' +
            'in video, audio or other dynamic media or format, a transcript or description of ' +
            'such disclosure.',
        material_information: '1) Such further material information, if any, as may be neessary ' +
            'to make the required statments, in the light of the cirsumstances under which they ' +
            'are made, not misleading.',
      };
      this.assignLabels();
      this.listenToNavigate();
    },

    _success(data) {
      app.hideLoading();
      $('body').scrollTo();
      return false;
    },

    events: Object.assign({
      'submit form': api.submitAction,
      'click .submit_formc': submitFormc,
    }, app.helpers.menu.events, app.helpers.yesNo.events, app.helpers.confirmOnLeave.events),

    render() {
      let template = require('./templates/backgroundCheck.pug');
      this.$el.html(
        template({
          fields: this.fields,
          values: this.model,
        })
      );
      app.helpers.disableEnter.disableEnter.call(this);
      this.campaign.updateMenu(this.campaign.calcProgress());
      return this;
    },
  }, app.helpers.menu.methods, app.helpers.yesNo.methods, app.helpers.section.methods, app.helpers.confirmOnLeave.methods)),

  finalReview: Backbone.View.extend({
    urlRoot: app.config.formcServer + '/:id/final-review',

    events: {
      'click .createField': 'createField',
    },

    initialize(options) {
      this.formcId = options.formcId;
      this.fields = options.fields;
      this.campaign = options.model.campaign;

      app.helpers.disableEnter.disableEnter.call(this);
      this.listenToNavigate();
    },

    destroy() {
      Backbone.View.prototype.destroy.call(this);
      $('body').off('click', '.createField');
    },

    _success(data, newData) {
      return 1;
    },

    getSuccessUrl() {
      return  '/formc/' + this.model.id + '/review';
    },

    createField: function (event) {
      event.preventDefault();
      if ($(event.target).hasClass('noactive')) {
          return false;
      }

      let target = event.target;
      let element = '';
      if(target.dataset.type == 'text' || target.dataset.type == 'money') {
        element = document.createElement('input');
        element.name = target.dataset.name;

        if(target.dataset.type == 'money') {
          //element.value = app.helpers.format.unformatPrice(target.innerHTML);
          element.value = target.innerHTML;
        } else {
          element.value = target.innerHTML;
        }

        element.type = target.dataset.type;
        element.dataset.type = target.dataset.type;
        element.onblur = (e) => this.update(e);
        target.parentElement.insertBefore(element, target);
      } else if(target.dataset.type == 'select') {
        element = document.createElement('select');
        element.name = target.dataset.name;
        element.onblur = (e) => this.update(e);

        let v = app.valByKeyReplaceArray(this.fields, target.dataset.name).validate;
        Object.keys(v.choices).forEach((i) => {
          const el = v.choices[i];
          let e = document.createElement('option');
          e.innerHTML = el;
          e.value = i;
          if(i == target.dataset.value) {
            e.setAttribute('selected', true);
          }
          element.appendChild(e);
        });
        target.parentElement.insertBefore(element, target);
      } else if(target.dataset.type == 'textarea') {
        element = document.createElement('textarea');
        element.name = target.dataset.name;
        element.className = 'big-textarea w-100';
        element.innerHTML = target.innerHTML.replace(/\<br\>/g, "\n");
        element.onblur = (e) => this.update(e);
        target.parentElement.insertBefore(element, target);
      }
      element.focus();

      target.remove();
    },

    update(e) {
      let val = e.target.value;
      val = (e.target.dataset.type == 'money') ? app.helpers.format.unformatPrice(val) : val;
      const name = e.target.name;
      const reloadRequiredFields = [
        'corporate_structure',
        'maximum_raise',
        'minimum_raise',
        'security_type',
        'price_per_share',
        'length_days',
      ];

      const fieldDependencies = {
        'maximum_raise': ['minimum_raise'],
        'minimum_raise': ['maximum_raise'],
      };

      function fillDataWithDependencies(data, fieldName, model) {
        let dependencies = fieldDependencies[fieldName];
        if (!dependencies || !dependencies.length)
          return;

        //this method just fill plain dependencies
        dependencies.forEach((dep) => {
          if (data[dep])
            return;

          data[dep] = model[dep];
        });
      }

      e.target.setAttribute(
        'id', name.replace(/\./g, '__').replace(/\[/g ,'_').replace(/\]/g, '_')
      );

      let data = {};
      let url = '';
      let fieldName = '';
      let updateModel = app.user.company;
      let method = 'PATCH';

      if(name.indexOf('company.') !== -1) {
        fieldName = name.split('company.')[1];
        data[fieldName] = val;
        url = app.config.raiseCapitalServer + '/company/' + app.user.company.id;

      } else if(name.indexOf('campaign.') !== -1) {
        fieldName = name.split('campaign.')[1];

        if (fieldName === 'security_type')  {
          val = parseInt(val);
        }

        data[fieldName] = val;
        url = app.config.raiseCapitalServer + '/campaign/' + this.campaign.id;
        updateModel = this.campaign;

      } else if(name.indexOf('formc.') !== -1) {
        fieldName = name.split('formc.')[1];
        url = app.config.formcServer + '/' + this.model.id;

        if(fieldName.indexOf('[') !== -1) {
          let names = fieldName.split('.');
          fieldName = names[0].split('[')[0];
          let index = names[0].split('[')[1].replace(']', '');
          if (name.indexOf('end_date_of_service') >= 0 && (val || '').toLowerCase() == 'current') {
            val = void(0);
          }
          app.setValByKey(app.user, name, val);

          if(fieldName == 'team_members') {
            data = this.model.formc.team_members[index];
            url = app.config.formcServer + '/' + this.model.id + '/team-members/' + data.user_id;
            method = 'PATCH';
          } else if(fieldName.indexOf('risk') !== -1) {
            let riskVar = name.split('.')[2];
            this.model[fieldName][riskVar] = val;
            let riskName = fieldName.split('_')[0];
            riskName = riskName.indexOf('miscellaneous') >= 0 ? 'misc' : riskName;
            url = app.config.formcServer + '/' + this.model.id + '/risk-factors-' + riskName + '/' + index;
            this.model[fieldName][index];
            data = this.model[fieldName][index];
          } else {
            data[names[0].replace(/\[\d+\]/, '')] = this.model[names[0].replace(/\[\d+\]/, '')];
          }
        } else {
          data[fieldName] = val;
        }

        updateModel = this.model;
      }

      fillDataWithDependencies(data, fieldName, updateModel);

      this.$('.form-control-feedback').remove();

      api.makeRequest(url, method, data)
        .then((responseData) => {

          Object.assign(updateModel, data);

          if(reloadRequiredFields.indexOf(fieldName) != -1) {
            this.render();
            return false;
          }

          let input = document.querySelector(
            '#' + name.replace(/\./g, '__').replace(/\[/g ,'_').replace(/\]/g, '_')
          );
          let href = '';
          href = document.createElement('a');
          href.setAttribute('href', '#');
          href.dataset.name = name;

          let realVal = val;
          if(e.target.tagName == 'SELECT') {
            href.dataset.type = 'select';
            let metaData = app.valByKeyReplaceArray(this.fields, name);
            realVal = app.fieldChoiceList(metaData, val);
          } else if(e.target.tagName == "TEXTAREA") {
            href.dataset.type = "textarea";
            realVal = realVal.replace(/\n/g, '<br>');
          } else {
            href.dataset.type = 'text';
            if(e.target.dataset.type == 'money') {
              realVal = app.helpers.format.formatPrice(realVal);
            }
          }

          href.innerHTML = realVal;
          if(e.target.tagName == 'SELECT') {
            href.dataset.value = val;
          } 

          href.className = 'createField show-input link-1';

          document.querySelectorAll('[data-name="' + name + '"]').forEach((sameElement) => {
            if(sameElement.tagName == 'SELECT') {
              sameElement.value = val
            } else {
              sameElement.innerHTML = realVal;
            }
          });

          input.after(href);
          input.remove();
        })
        .fail((response) => {
          Object.keys(response.responseJSON).forEach((key) => {
            let val = response.responseJSON[key];
            val = Array.isArray(val) ? val : [val];
            let errorDiv = document.createElement('div');
            e.target.classList.add('form-control-danger');
            errorDiv.className = 'form-control-feedback';
            errorDiv.innerHTML = val.join(', ');
            e.target.after(errorDiv);
          });
        });
    },

    render() {
      let template = require('./templates/finalReview.pug');
      this.fields.company.industry.validate.choices = require('consts/raisecapital/industry.json').INDUSTRY;
      this.fields.company.founding_state.validate.choices = require('consts/usaStates.json').USA_STATES;
      this.fields.company.state.validate.choices = require('consts/usaStates.json').USA_STATES;
      this.fields.company.corporate_structure.validate.choices = require('consts/raisecapital/corporate_structure.json').CORPORATE_STRUCTURE;
      this.fields.campaign.length_days.validate.choices = require('consts/raisecapital/length_days.json').LENGTH_DAYS;
      this.fields.campaign.security_type.validate.choices = require('consts/raisecapital/security_type.json').SECURITY_TYPE;
      this.fields.campaign.valuation_determination.validate.choices = require('consts/raisecapital/valuation_determination.json').VALUATION_DETERMINATION;
      this.fields.formc.outstanding_securities.schema.security_type.type = 'choice';
      this.fields.formc.outstanding_securities.schema.security_type.validate = {};
      this.fields.formc.outstanding_securities.schema.security_type.validate.choices = securityTypeConsts.SECURITY_TYPES;
      this.fields.formc.outstanding_securities.schema.custom_security_type.validate.choices = securityTypeConsts.SECURITY_TYPES;
      this.fields.formc.outstanding_securities.schema.voting_right.validate.choices = yesNoConsts.YESNO;
      this.fields.formc.business_plan_file_id.label = 'Please upload your business plan';

      this.$el.html(
        template({
          fields: this.fields,
          formcId: this.formcId,
          view: this,
          values: this.model
        })
      );

      $('body').on('click', '.createField', (e) => this.createField(e));

      return this;
    },
  }),

  electronicSignature: Backbone.View.extend({
    el: '#content',
    template: require('./templates/formc_els_company_formc_first.pug'),
    
    initialize(options) {
      this.fields = options.fields;
      this.name = {};
    },

    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),

  electronicSignatureCompany: Backbone.View.extend({
    el: '#content',
    template: require('./templates/formc_els_company_formc.pug'),
    
    initialize(options) {
      this.fields = {};
      this.dob = {};
      this.assignLabels();
    },
    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),

  electronicSignatureCik: Backbone.View.extend({
    el: '#content',
    template: require('./templates/formc_els_cik_code.pug'),
    
    initialize(options) {
      this.fields = {}; //options.fields;
      this.fields.ein = { };
      this.fields.prefer_cik = { };
      this.fields.fiscal_year_end = { };
      this.fields.type_name = {};
      this.labels = {
        ein: 'Please enter your company`s EIN',
        prefer_cik: 'awdaw',
        type_name: 'Please type name here',
      };

      this.assignLabels();
    },
    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),

  electronicSignatureFinancials: Backbone.View.extend({
    el: '#content',
    template: require('./templates/formc_els_financials_certification.pug'),
    
    initialize(options) {
      this.fields = {};
      this.dob = {};
      this.assignLabels();
    },
    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),
};
