define(function () {
    return {
        investment: `
        <section class="header_title">
            <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <h2>Investment</h2>
                </div>
                <div class="col-lg-6 text-lg-right">
                    <a href="/">Home</a>
                    <span>/</span>
                    <a href="">Explore</a>
                    <span>/</span>
                    <a href=""><%- campaign.company.name %></a>
                    <span>/</span>
                    <span class="curent">Invest in <%- campaign.company.name %></span>
                </div>
            </div>
        </section>

<div class="container investment">
<form action="" method="POST" class="form-section clearfix">
<div class="col-md-6">
        <section class="section-text">
            <h3 class="text-uppercase">Investment</h3>

            <div class="form-group row required amount clearfix">
                <div class="col-md-4 text-md-right">
                    <label for="id_amount">Investment Amount</label>
                </div>
                <div class="col-md-8">
                    <input class="form-control" id="id_amount" name="amount" placeholder="Min 100" type="number" value="2,500">
                    <span class="help-block"></span>
                    <small>$10 commission</small>
                </div>
            </div>
        </section>

        <section class="section-text">
            <h3 class="text-uppercase">Personal Information</h3>
            <div class="form-group row required name clearfix">
                <div class="col-md-4 text-md-right">
                    <label for="id_name">Full Legal Name</label>
                </div>
                <div class="col-md-8">
                    <input class="form-control" id="id_name" name="name" placeholder="Full Legal Name" type="text" value="">
                    <span class="help-block"></span>
                </div>
            </div>
            <div class="form-group row required phone clearfix">
                <div class="col-md-4 text-md-right">
                    <label for="id_phone">Phone number</label>
                </div>
                <div class="col-md-8">
                    <input class="form-control" id="id_phone" name="phone" placeholder="Phone number" type="text" value="">
                    <span class="help-block"></span>
                </div>
            </div>
            <div class="form-group row required address clearfix">
                <div class="col-md-4 text-md-right">
                    <label for="id_address">Street Address 1</label>
                </div>
                <div class="col-md-8">
                    <input class="form-control" id="id_address" name="address" placeholder="Street Address 1" type="text" value="">
                    <span class="help-block"></span>
                </div>
            </div>
            <div class="form-group row required clearfix street_address_2">
                <div class="col-md-4 text-md-right ">
                    <label for="id_street_address_2">Street Address 2</label>
                </div>

                <div class="col-md-8">
                    <input class="   form-control" id="id_street_address_2" name="street_addres_2" placeholder="Street Address 2" type="text" value="">
                    <span class="help-block"></span>
                </div>
            </div> 

            <div class="row required">
                <div class="form-group zip_code col-md-12 col-lg-6">
                    <div class="form-group row clearfix ">
                        <div class="col-lg-6 col-md-4 text-md-right">
                            <label for="id_zip_code">Zip Code</label>
                        </div>
                        <div class="col-lg-6 col-md-8">
                            <input class="form-control" id="id_zip_code" name="zip_code" placeholder="Zip Code" type="text" value="">
                            <span class="help-block"></span>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-lg-6">
                    <div class="form-group row required clearfix city_state">
                        <div class="col-lg-4 col-md-3 col-xs-4  text-md-right">
                            <label for="id_city_state">City/State</label>
                        </div>
                        <div class="col-lg-6 col-md-8 col-xs-8">
                            <span class="change_state_city" data-input-id='id_city_state'>
                                <!-- <span  class="input-value">City/State</span> <i class="fa fa-pencil-square-o"></i> -->
                                <input class="form-control" id="id_city" name="city" placeholder="City/State" type="text" >
                                <span class="help-block"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12 col-lg-6">
                    <div class="form-group row required dob clearfix ">
                        <div class="col-lg-4 col-md-3 text-md-right">
                            <label for="id_dob">Date of Birth</label>
                        </div>
                        <div class="col-lg-10 col-md-9">
                            <input class="form-control" id="id_dob" name="dob"  type="date" value="">
                            <span class="help-block"></span>
                        </div>
                    </div>
                </div>
                <div class="col-md-12 col-lg-6">
                    <div class="form-group row required ssn clearfix ">
                        <div class="col-lg-6 col-md-3 text-md-right">
                            <label for="id_ssn">SSN</label>
                        </div>
                        <div class="col-lg-6 col-md-8">
                            <input class="form-control" id="id_ssn" name="ssn" placeholder="XXX-XX-XXXX" type="text" value="">
                            <span class="help-block"></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section-text">
            <h3 class="text-uppercase">Payment Information</h3>
            <small>Link your bank account or manually enter your bank acount detail</small>

            <div class="form-group row bank_name required clearfix">
                <label class="col-md-4 align-right control-panel" for="id_bank_name">Bank Name</label>
                <div class="col-md-8">
                  <input class="input-md form-control" id="id_bank_name" name="bank_name" placeholder="Bank Name" type="text">
                  <span class="help-block"></span>
                </div>
            </div> 

            <div class="form-group row required routing_number clearfix">
                <label class="col-md-4 align-right control-panel" for="id_routing_number">Routing Number</label>
                <div class="col-md-8">
                  <input class="input-md form-control" id="id_routing_number" name="routing_number" placeholder="Routing Number" type="text">
                  <span class="help-block"></span>
                </div>
            </div> 
                        
            <div class="form-group row required account_number clearfix">
                <label class="col-md-4 align-right control-panel" for="id_account_number">Account Number</label>
                <div class="col-md-8">
                  <input class="input-md form-control" id="id_account_number" name="account_number" placeholder="Account Number" type="text">
                  <span class="help-block"></span>
                </div>
            </div> 
        </section>

        <section class="section-text">
            <h3 class="text-uppercase">Verification</h3>

            <div class="form-group row required is_required_edu_material clearfix">
                <div class="col-md-1 text-md-right ">
                    <input id="id_is_reviewed_edu_material" name="is_reviewed_edu_material" type="checkbox">
                </div>

                <div class="col-md-11">
                    <label for="id_is_reviewed_edu_material">I have reviewed and understand the education material on GrowthFountain. I understand that GrowthFountain does not offer investment advice or recommendations, and that I have made my own investment decision.</label>
                    <span class="help-block"></span>
                </div>
            </div> 

            <div class="form-group row required is_understand_terms clearfix">
                <div class="col-md-1 text-md-right ">
                    <input id="id_is_understand_terms" name="is_understand_terms" type="checkbox">
                </div>

                <div class="col-md-11">
                    <label for="id_is_understand_terms">I understand that there are restrictions on my ability to cancel an investment commitment and obtain a return of my investment.</label>
                    <span class="help-block"></span>
                </div>
            </div> 

            <div class="form-group row required is_resell_difficult clearfix">
                <div class="col-md-1 text-md-right ">
                    <input id="id_is_resell_difficult" name="is_resell_difficult" type="checkbox">
                </div>

                <div class="col-md-11">
                    <label for="id_is_resell_difficult">I understand that it may be difficult to resell securities purchased on GrowthFountain.</label>
                    <span class="help-block"></span>
                </div>
            </div> 

            <div class="form-group row required is_startup_risk clearfix">
                <div class="col-md-1 text-md-right ">
                    <input id="id_is_startup_risk" name="is_startup_risk" type="checkbox">
                </div>

                <div class="col-md-11">
                    <label for="id_is_startup_risk">I understand that investing in start-ups and small businesses listed on GrowthFountain is very risky, and that I should not invest any funds unless I can afford to lose my entire investment.</label>
                    <span class="help-block"></span>
                </div>
            </div> 

            <div class="form-group row requied subscription_agreement clearfix">
                <div class="col-md-1 text-md-right ">
                    <input id="id_subscription_agreement" name="subscription_agreement" type="checkbox">
                </div>

                <div class="col-md-11">
                    <h3><a href="">Subscription agreement</a></h3>
                    <label for="id_subscription_agreement">I agree to the terms of the Subscription Agreement specific to this issuer.</label>
                    <span class="help-block"></span>
                </div>
            </div> 
            <div class="form-group row clearfix">
                <div class="col-md-11">
                    <div class="controls ">
                        <button type="submit" class="bg-inverse btn btn-secondary btn-lg pull-right"> Invest </button>
                    </div>
                </div>
            </div>
        </section>
</div>
<div class="col-md-6">
<h2 class="text-uppercase">Perks</h2>
<small>Small text</small>
<%- campaign.perks %>
<h2 class="text-uppercase">Investment Summary</h2>
raising: <%- campaign.minimum_raise %> - <%- campaign.maximum_raise %> <br />
commited: <%- campaign.amount_raised %> <br />
Offering deadline: Sep 14, 2016 <br />
Type of security: <%- campaign.get_security_type_display %>
</div>
</form>
        </div>`,
    thankyou: `
        <section class="header_title">
        <div class="container">
        <div class="row">
            <div class="col-lg-6">
                <h2>Congratulations!</h2>
            </div>
            <div class="col-lg-6 text-lg-right">
                <a href="/">Home</a>
                <span>/</span>
                <a href="">Explore</a>
                <span>/</span>
                <a href=""><%- campaign.company.name %></a>
                <span>/</span>
                <span class="curent">Invest in <%- campaign.company.name %></span>
            </div>
        </div>
    </section>
    <div class="container">
        <h4> thumb, You have invested <%- investment.amount %> in <%- campaign.company.name %></h4>
        <hr />
        <ul>
            <li>Transaction ID: <b><%- investment.campaign_api_key %><%- investment.id %></b></li>
            <li>Amount of Shares: <b><%- investment.amount_of_shares %></b></li>
            <li>Perk: <b><% investment %></b></li>
            <li>Investment Terms: <b><% investment %></b></li>
        </ul>

        <a href="<%- Urls['user:investor_dashboard']() %>" class="btn btn-sm">Investor dashboard</a>
    </div>`
   }
});
