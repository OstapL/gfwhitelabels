define(function() {
    let r = {
        model: Backbone.Model.extend({
            urlRoot: serverUrl + '/api/investment',
            validation: {
              amount: {
                required: true,
                pattern: 'number',
                fn: function(value, attr, computedState) {
                    console.log('hit validate function');
                    if(value > this.get('max_invest_amount')) {
                        if(this.investorView.attemps < 2) {
                            netincomePopup.show();
                        }
                        setTimeout(() => {
                            this.investorView.attemps = 0;
                            //$(window).scrollTop($('#id_amount').position().top);
                        }, 500);
                        return 'Amount is too high, you can invest ' + this.get('max_invest_amount');
                    }
                }
              },
              bank_name: {
                required: true,
                minLength: 2,
              },
              account_number: {
                required: true,
                minLength: 2,
                maxLength: 17,
              },
              routing_number: {
                required: true,
                pattern: 'digits',
              },
              ssn: {
                required: true,
                minLength: 9,
              },
              name: {
                required: true,
                minLength: 2,
              },
              phone: {
                required: true,
                minLength: 7,
              },
              address: {
                required: true,
                minLength: 7,
              },
              zip_code: {
                required: true,
                minLength: 5,
              },
              city: {
                required: true,
                minLength: 2,
              },
              dob: {
                required: true,
              },
              is_reviewed_edu_material: {
                required: true,
                msg: 'It is required that you acknowledge the above'
              },
              is_understand_terms: {
                required: true,
                msg: 'It is required that you acknowledge the above'
              },
              is_resell_difficult: {
                required: true,
                msg: 'It is required that you acknowledge the above'
              },
              subscription_agreement: {
                required: true,
                msg: 'It is required that you acknowledge the above'
              },
              is_startup_risk: {
                required: true,
                msg: 'It is required that you acknowledge the above'
              },
            },
        }),
    }
    return r;
});
