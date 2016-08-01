define(function () {
    return {
        login: `<div class="container">
                    <div class="row text_block">
                        <div class="col-sm-12 main_text">
                            <h1>
                                Sign Up
                            </h1>
                        </div>
                    </div>
                </div>

                <!-- main content of sighn up/login -->
                <section class="authorization container">

                    <div class="row">

                        <div class="col-lg-6">

                            <div class="embed-responsive embed-responsive-16by9 boxshadow">
                                <iframe class="embed-responsive-item" src="https://player.vimeo.com/video/170651597?title=0&amp;byline=0&amp;portrait=0" data-webkitallowfullscreen="" data-mozallowfullscreen="" data-allowfullscreen="">
                                </iframe>
                             </div>
                        </div>

                        <div class="forms-block">

                            <div class="col-lg-6">

                                <!-- Nav Tabs -->
                                <div class="row">
                                    <div class="col-lg-offset-3 col-lg-9 col-sm-offset-3">
                                        
                                        <ul class="nav nav-tabs login-tabs">

                                            <li class="nav-item " aria-expanded="false">
                                                <a href="#mini-one"  data-toggle="tab" class="active nav-link " aria-expanded="true">Login</a>
                                            </li>
                                            <li class="nav-item">
                                                <a href="#mini-two" data-toggle="tab" class="nav-link " aria-expanded="true">Sign Up</a>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                                <!-- End Nav Tabs -->

                                <!-- Tab panes -->
                                <div class="tab-content authorization-tabs-content ">

                                    <div class="tab-pane fade in active" id="mini-one" aria-expanded="true">

                                        <!-- Login Form -->
                                        <div class="row">

                                            <section class="form-section">

                                                <form class="login-form" action="" method="post">

                                                    <div class="clearfix">

                                                        <!-- Username -->
                                                        <input type="hidden" name="next" value="">

                                                        <div class="form-group clearfix">
                                                          
                                                            <div class="col-lg-3 col-sm-3  text-md-right">
                                                              <label for="id_email">Email</label>
                                                            </div>

                                                            <div class="col-md-6 col-lg-7">
                                                              <input autofocus="autofocus" class=" input-md form-control" id="id_email" name="email" placeholder="E-mail" type="email">
                                                              
                                                              <span class="help-block"></span>
                                                            </div>
                                                          
                                                        </div> 

                                                        <div class="form-group clearfix">

                                                            <div class=" col-lg-3 col-sm-3 text-md-right">
                                                                <label for="id_password">Password</label>
                                                            </div>

                                                            <div class="col-md-6 col-lg-7">
                                                                <input class=" input-md form-control" id="id_password" name="password" placeholder="Password" type="password">
                                                              
                                                              <span class="help-block"></span>
                                                            </div>

                                                        </div> 

                                                        <div class="socialaccount_ballot clearfix">
                                                            <div class=" col-lg-3 col-sm-6 col-xs-5 text-sm-right">
                                                                <p>Or login with</p>
                                                            </div>

                                                            <div class="col-sm-6 col-xs-7 col-lg-6">
                                                                <ul class="social-icons list-inline clearfix">
                                                                    <li>
                                                                        <a class="fa fa-facebook social-icon-color facebook" data-original-title="facebook" href="/accounts/facebook/login/?process=login"></a>
                                                                    </li>
                                                                    <li>
                                                                        <a class="fa fa-google-plus social-icon-color googleplus" data-original-title="Google Plus" href="/accounts/google/login/?process=login"></a>
                                                                    </li>
                                                                    <li>
                                                                        <a class="fa fa-linkedin social-icon-color linkedin" data-original-title="Linkedin" href="/accounts/linkedin_oauth2/login/?process=login"></a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                         </div>

                                                    </div>

                                                    <div class="form-group clearfix">

                                                        <div class=" col-lg-6 col-xs-6 text-md-right">
                                                            <a href="/accounts/password/reset/" id="forget-password" class="forget-password">Forgot Password?</a>
                                                        </div>

                                                        <div class="col-xs-6">
                                                            <button class="pull-md-left  pull-xs-right bg-inverse submit-btn btn btn-lg" id="login-btn">Login</button>
                                                        </div>

                                                    </div>
                                                </form>
                                            </section>
                                        </div>
                                        <!-- End Login Form -->
                                    </div>
                                    
                                    <div class="tab-pane fade" id="mini-two" aria-expanded="false">

                                        <!-- Registry Form -->
                                        <div class="row">
                                            <section class="form-section">

                                            <form class="form-horizontal no-gutter-right" action="/accounts/signup/" method="post">

                                                    <div class="form-group clearfix">
                                                      
                                                        <div class="col-lg-3 col-sm-3  text-md-right">
                                                          <label for="id_first_name">First Name</label>
                                                        </div>

                                                        <div class="col-md-6 col-lg-7">
                                                          <input class=" input-md form-control" id="id_first_name" maxlength="30" name="first_name" placeholder="First Name" type="text">
                                                          
                                                          <span class="help-block"></span>
                                                        </div>
                                                      
                                                    </div> 

                                                    <div class="form-group wpcf7-form-control-wrap   last_name clearfix">
                                                      
                                                        <div class="col-lg-3 col-sm-3  text-md-right">
                                                          <label for="id_last_name">Last Name</label>
                                                        </div>

                                                        <div class="col-md-6 col-lg-7">
                                                          <input class=" input-md form-control" id="id_last_name" maxlength="30" name="last_name" placeholder="Last Name" type="text">
                                                          
                                                          <span class="help-block"></span>
                                                        </div>
                                                      
                                                    </div>

                                                    <div class="form-group wpcf7-form-control-wrap   email clearfix">
                                                      
                                                        <div class="col-lg-3 col-sm-3  text-md-right">
                                                          <label for="id_email">E-mail</label>
                                                        </div>
                                                        <div class="col-md-6 col-lg-7">
                                                          <input class=" input-md form-control" id="id_email" name="email" placeholder="E-mail адрес" type="email">
                                                          
                                                          <span class="help-block"></span>
                                                        </div>
                                                      
                                                    </div> 

                                                    <div class="form-group wpcf7-form-control-wrap   password1 clearfix">
                                                      
                                                        <div class="col-lg-3 col-sm-3  text-md-right">
                                                          <label for="id_password1">Пароль</label>
                                                        </div>

                                                        <div class="col-md-6 col-lg-7">
                                                          <input class=" input-md form-control" id="id_password1" name="password1" placeholder="Пароль" type="password">
                                                          
                                                          <span class="help-block"></span>
                                                        </div>
                                                      
                                                    </div> 

                                                    <div class="form-group wpcf7-form-control-wrap   password2 clearfix">
                                                      
                                                        <div class="col-lg-3 col-sm-3  text-md-right">
                                                          <label for="id_password2">Пароль (еще раз)</label>
                                                        </div>

                                                        <div class="col-md-6 col-lg-7">
                                                          <input class=" input-md form-control" id="id_password2" name="password2" placeholder="Пароль (еще раз)" type="password">
                                                          
                                                          <span class="help-block"></span>
                                                        </div>
                                                      
                                                    </div> 

                                                    <div class="form-group   signature clearfix">
                                                      <div class="col-sm-12">
                                                          <label for="id_signature" class="pseudo-checkbox">
                                                              <input id="id_signature" name="signature" type="checkbox">
                                                              I consent to electronic signature and electronic delivery of documentation
                                                          </label>
                                                      </div>
                                                    </div>

                                                    <div class="form-group terms_conditions clearfix">
                                                        <div class="col-sm-12">
                                                          <label for="id_terms_conditions" class="pseudo-checkbox">
                                                              <input id="id_signature" name="terms_conditions" type="checkbox">
                                                              I consent to the <a href="/pages/terms/" target="_blank">Terms of Use</a> and <a href="/pages/privacy" target="_blank">Privacy Policy</a>
                                                          </label>
                                                      </div>
                                                    </div>

                                                    <div class="form-group form-actions text-sm-center">
                                                        <div class="col-lg-10 col-md-9 col-xs-12 clearfix">
                                                            <button type="submit" id="register-submit-btn" class="bg-inverse pull-right btn-primary submit-btn btn btn-lg  uppercase">Submit</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </section>
                                        </div>
                                        <!-- End Registry Form -->
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>`,
        profile: `<section class="header_title">
        <div class="container">
        <div class="row">
            <div class="col-sm-6">
                <h2>Account</h2>
            </div>
            <div class="col-sm-6 text-sm-right">
                <a href="/">Home</a>
                <span>/</span>
                <a href="">About Us</a>
                <span>/</span>
                <span class="curent">Account</span>
            </div>
        </div>
    </section>

    <div class="container profile">
        <div class="row">
            <div class="col-md-9 col-md-offset-3 col-sm-12 col-sm-offset-0">

                <!-- account tabs -->
                <ul class="nav nav-tabs profile-tabs">
                    <li class="nav-item " aria-expanded="false">
                        <a href="#account_info"  data-toggle="tab" role="tab" class="active nav-link uppercase" aria-expanded="true">Account information</a>
                    </li>
                    <li class="nav-item ">
                        <a href="#financial_info" data-toggle="tab" role="tab" class=" nav-link uppercase" aria-expanded="true">Financial information</a>
                    </li>
                    <li class="nav-item">
                        <a href="#investment_preferences" data-toggle="tab" role="tab" class=" nav-link uppercase" aria-expanded="true">Investment preferences</a>
                    </li>
                </ul>

            </div>
        </div>

        <!-- Tab panes -->
        <div class="tab-content profile-tabs-content ">

            <div class="tab-pane fade active in" id="account_info" aria-expanded="true">

                <div class="row">

                    <section class="form-section clearfix">
                        <form class="form" method="post" action="/user/update_profile/" role="form">
                            <div class="form-body clearfix">

                                <div class="col-sm-4 col-md-3">
                                    <aside class="left-block">

                                        <h5 class="widget-title font-alt"><%= model.get_full_name() %></h5>

                                        <div class="dropzone__image drop-photo dz-clickable dropzone"></div>

                                        <input type="hidden" name="image" id="id_image" value="80">
                                        
                                        <div class="drop-image-title text-xs-center">
                                            <span>
                                                Drop your profile picture here
                                            </span>
                                            <div></div>
                                            <i class="fa fa-camera"></i>
                                        </div>

                                    </aside>
                                </div>


                                <div class="col-md-9 col-sm-8">
                                    <section class="right-block">

                                        <input type="hidden" name="csrfmiddlewaretoken" value="yESg0wjxGit5mThFEPpr4H7OH5sbUIFB">

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right">
                                                <label for="id_first_name">First name</label>
                                            </div>

                                            <div class="col-md-8">
                                                <input class="form-control" id="id_first_name" name="first_name" placeholder="First name" type="text" value="<%= user.first_name %>">
                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right">
                                                <label for="id_last_name">Last name</label>
                                            </div>

                                            <div class="col-md-8">
                                                <input class="   form-control" id="id_last_name" name="last_name" placeholder="Last name" type="text" value="<%= user.last_name %>">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right">
                                                <label for="id_street_address_1">Street Address 1</label>
                                            </div>

                                            <div class="col-md-8">
                                                <input class="   form-control" id="id_street_address_1" name="street_addres_1" placeholder="Street Address 1" type="text" value="">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row clearfix street_address_2">

                                            <div class="col-md-3 text-md-right ">
                                                <label for="id_street_address_2">Street Address 2</label>
                                            </div>
   
                                            <div class="col-md-8">
                                                <input class="   form-control" id="id_street_address_2" name="street_addres_2" placeholder="Street Address 2" type="text" value="">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="row">
    
                                            <div class="col-md-12 col-lg-6">
                                                <div class="form-group row clearfix ">
                                                    <div class="col-lg-6 col-md-3 text-md-right">
                                                        <label for="id_zip_code">Zip Code</label>
                                                    </div>
                                                    <div class="col-lg-6 col-md-8">
                                                        <input class="form-control" id="id_zip_code" name="zip_code" placeholder="Zip Code" type="text" value="">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12 col-lg-6">
                                                <div class="form-group row clearfix city_state">
                                                    <div class="col-lg-4 col-md-3 col-xs-4  text-md-right">
                                                        <label for="id_city_state">City/State</label>
                                                    </div>
                                                    <div class="col-lg-6 col-md-8 col-xs-8">
                                                        <span class="change_state_city" data-input-id='id_city_state'>
                                                            <span  class="input-value">City/State</span>
                                                            <i class="fa fa-pencil-square-o"></i>
                                                        </span>
                                                        <input class="form-control" id="id_city_state" name="city_state" placeholder="City/State" type="text" value="">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-12 col-lg-6">
                                                <div class="form-group row phone clearfix ">
                                                    <div class="col-lg-6 col-md-3 text-md-right">
                                                        <label for="id_phone">Phone</label>
                                                    </div>
                                                    <div class="col-lg-6 col-md-8">
                                                        <input class="form-control" id="id_phone" name="phone" placeholder="Phone" type="text" value="<%- user.phone %>">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12 col-lg-6">
                                                <div class="form-group row clearfix ">
                                                    <div class="col-lg-4 col-md-3 text-md-right">
                                                        <label for="id_date_of_birth">Date of Birth</label>
                                                    </div>
                                                    <div class="col-lg-6 col-md-8">
                                                        <input class="form-control" id="id_date_of_birth" name="date_of_birth"  type="date" value="">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        
             
                                        <div class="form-group row clearfix">
                                            <div class="col-md-11">
                                                <div class="controls ">
                                                    <button type="submit" class="bg-inverse btn btn-secondary btn-lg pull-right"> Save </button>
                                                </div>
                                            </div>
                                        </div>

                                    </section>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>

            </div>

            <!-- financial information -->
            <div class="tab-pane fade" id="financial_info" aria-expanded="true">

                <div class="row">

                    <section class="form-section clearfix">
                        <form class="" method="post" action="/user/update_profile/" role="form">
                            <div class="form-body clearfix">

                                <div class="col-sm-4 col-md-3">
                                    <aside class="left-block">

                                        <h5 class="widget-title font-alt">Mariya Kravchuk</h5>

                                        <div class="dropzone__image drop-photo dz-clickable dropzone"></div>

                                        <input type="hidden" name="image" id="id_image" value="80">
                                        
                                        <div class="selected-area-info text-xs-left">
                                            <i class="fa fa-info-circle"></i>
                                            <span>The selected area will be displayed on your dashboard</span>
                                        </div>

                                        <div class="drop-image-title text-xs-center">
                                            <span>
                                                Drop your profile picture here
                                            </span>
                                            <div></div>
                                            <i class="fa fa-camera"></i>
                                        </div>

                                    </aside>
                                </div>


                                <div class="col-md-9 col-sm-8">
                                    <section class="right-block">

                                        <input type="hidden" name="csrfmiddlewaretoken" value="yESg0wjxGit5mThFEPpr4H7OH5sbUIFB">

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right">
                                                <label for="id_first_name">Bank Name</label>
                                            </div>

                                            <div class="col-md-8">
                                                <input class=" form-control" id="id_first_name" name="first_name" placeholder="Firs name" type="text" value="">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right">
                                                <label for="id_last_name">Bank Address</label>
                                            </div>

                                            <div class="col-md-8">
                                                <input class="   form-control" id="id_last_name" name="last_name" placeholder="Last name" type="text" value="">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="row">
    
                                            <div class="col-md-12 col-lg-6">
                                                <div class="form-group row clearfix ">
                                                    <div class="col-lg-6 col-md-3 text-md-right">
                                                        <label for="id_zip_code">Zip Code</label>
                                                    </div>
                                                    <div class="col-lg-6 col-md-8">
                                                        <input class="form-control" id="id_zip_code" name="zip_code" placeholder="Zip Code" type="text" value="">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-12 col-lg-6">
                                                <div class="form-group row clearfix city_state">
                                                    <div class="col-lg-4 col-md-3 col-xs-4 text-md-right">
                                                        <label for="id_city_state">City/State</label>
                                                    </div>
                                                    <div class="col-lg-6 col-md-8 col-xs-8">
                                                        <span class="change_state_city" data-input-id='id_city_state'>
                                                            <span  class="input-value">City/State</span>
                                                            <i class="fa fa-pencil-square-o"></i>
                                                        </span>
                                                        <input class="form-control" id="id_city_state" name="city_state" placeholder="City/State" type="text" value="">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right">
                                                <label for="id_account_number">Account Number</label>
                                            </div>

                                            <div class="col-md-8">
                                                <input class="form-control" id="id_account_number" name="account_number" placeholder="Account Number" type="text" value="">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row clearfix ">

                                            <div class="col-md-3 text-md-right ">
                                                <label for="id_re-enter">Re-Enter</label>
                                            </div>
   
                                            <div class="col-md-8">
                                                <input class="form-control" id="id_re-enter" name="re-enter" placeholder="Re-Enter" type="text" value="">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right ">
                                                <label for="id_routing_number">Routing Number</label>
                                            </div>
   
                                            <div class="col-md-8">
                                                <input class="form-control" id="id_routing_number" name="routing_number" placeholder="Routing Number" type="text" value="">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row">
                                            <div class="col-md-3 col-xs-5 text-xs-right ">
                                                <label for="">Acount Type</label>
                                            </div>

                                            <div class="col-md-8">

                                                <label class="radio-inline">
                                                    <input type="radio" name="account_type" id="account_type_1" value="">
                                                    Checking
                                                </label>

                                                <label class="radio-inline">
                                                    <input type="radio" name="account_type" id="account_type_2" value="">
                                                    Saving
                                                </label>

                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <div class="col-md-3 col-xs-5 text-xs-right ">
                                                <label for="">Check Type</label>
                                            </div>

                                            <div class="col-md-8">

                                                <label class="radio-inline">
                                                    <input type="radio" name="check_type" id="check_type_1" value="">
                                                    Checking
                                                </label>

                                                <label class="radio-inline">
                                                    <input type="radio" name="check_type" id="check_type_2" value="">
                                                    Saving
                                                </label>

                                            </div>
                                        </div>

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right ">
                                                <label for="id_name_on_bank_account">Name on Bank Account</label>
                                            </div>
   
                                            <div class="col-md-8">
                                                <input class="form-control" id="id_name_on_bank_account" name="name_on_bank_account" placeholder="Name on Bank Account" type="text" value="">

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row clearfix">

                                            <div class="col-md-3 text-md-right ">
                                                <label for="id_ssn">SSN</label>
                                            </div>
   
                                            <div class="col-md-8">
                                                <input class="form-control" id="id_ssn" name="ssn" placeholder="XXX-XX-7495" type="text" value="" >

                                                <span class="help-block"></span>
                                            </div>

                                        </div> 

                                        <div class="form-group row">
                                            <div class="col-sm-11">
                                                <div class="investors-warning">
                                                    <i class="fa fa-exclamation-triangle"></i>
                                                    <span class="warning-text">
                                                        Investors are limited to 12 month investment totals ranging from $2,000 - $100,000 based on income and net worth. Please update your financial information to see your limit.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="range-lines">
                                            <div class="form-group row">
                                                <div class="col-md-3 text-md-right ">
                                                    <label for="">Annual income</label>
                                                </div>

                                                <div class="col-md-8">
                                                    <input class=" input-md form-control" id="id_annual_income" min="0" name="annual_income" placeholder="Annual income" type="number" value="0" data-value="0" >
                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <div class="col-md-3 text-md-right ">
                                                    <label for="">Net worth</label>
                                                </div>
                                                <div class="col-md-8">
                                                    <input class=" input-md form-control" id="id_net_worth" min="0" name="net_worth" placeholder="Net worth" type="number" value="0" data-value="0">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row clearfix">
                                            <div class="col-md-11">
                                                <div class="controls ">
                                                    <button type="submit" class="bg-inverse btn btn-secondary btn-lg pull-right"> Save </button>
                                                </div>
                                            </div>
                                        </div>

                                    </section>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>

            </div>

            <!-- investment preferences -->
            <div class="tab-pane  fade" id="investment_preferences" aria-expanded="true">

                <div class="row">

                    <section class="form-section clearfix">
                        <form class="" method="post" action="" role="form">
                            <div class="form-body clearfix">

                                <div class="col-sm-4 col-md-3">
                                    <aside class="left-block">

                                        <h5 class="widget-title font-alt">Mariya Kravchuk</h5>

                                        <div class="dropzone__image drop-photo dz-clickable dropzone"></div>

                                        <input type="hidden" name="image" id="id_image" value="">
                                        
                                        <div class="drop-image-title text-xs-center">
                                            <span>
                                                Drop your profile picture here
                                            </span>
                                            <div></div>
                                            <i class="fa fa-camera"></i>
                                        </div>

                                    </aside>
                                </div>


                                <div class="col-md-9 col-sm-8">
                                    <section class="right-block">

                                        <div class="form-group row clearfix">

                                            <div class="col-md-11 col-md-offset-1 ">
                                                <label for="id_where_grow_up">Where did you grow up?</label>
                                            </div>

                                            <div class="col-md-10 col-md-offset-1 col-lg-8">
                                                <textarea name="" id="id_where_grow_up" class="form-control" rows="1"></textarea>

                                                <!-- <span class="help-block"></span> -->
                                            </div>

                                        </div> 

                                        <div class="form-group row clearfix">

                                            <div class="col-md-11 col-md-offset-1">
                                                <label for="id_where_go_college">Where did you go to college?</label>
                                            </div>

                                            <div class="col-md-10 col-md-offset-1 col-lg-8">
                                                <textarea name="" id="id_where_go_college" class="form-control" rows="1"></textarea>

                                                <!-- <span class="help-block"></span> -->
                                            </div>

                                        </div>

                                        <div class="form-group row clearfix select-group">

                                            <div class="col-md-11 col-md-offset-1">
                                                <label for="id_select_industries">Please, select all the industries  that interest you.</label>
                                            </div>

                                            <div class="col-md-10 col-md-offset-1 col-lg-8">
                                                <select name="select_industries" id="id_select_industries" class="c-select form-control">
                                                    <option>Metal</option>
                                                    <option>Wood</option>
                                                    <option>Machine</option>
                                                    <option>IT</option>
                                                    <option>Nature</option>
                                                </select>

                                                <!-- <span class="help-block"></span> -->
                                            </div>

                                        </div>

                                        <div class="form-group row clearfix select-group">

                                            <div class="col-md-11 col-md-offset-1">
                                                <label for="id_select_industries">Please, select geographic areas you are most interested in.</label>
                                            </div>

                                            <div class="col-md-10 col-md-offset-1 col-lg-8">
                                                <select name="select_industries" id="id_select_industries" class="c-select form-control">
                                                    <option>Asia</option>
                                                    <option>North America</option>
                                                    <option>Europe</option>
                                                    <option>Australia</option>
                                                    <option>Ukraine</option>
                                                </select>

                                                <!-- <span class="help-block"></span> -->
                                            </div>

                                        </div>

                                        <div class="form-group row clearfix">

                                            <div class="col-md-11 col-md-offset-1">
                                                <label for="id_have_ever_invested">Have you ever invested in any of the following?</label>
                                            </div>

                                            <div class="col-md-10 col-md-offset-1 col-lg-8">
                                                <textarea name="have_ever_invested" id="id_have_ever_invested" class="form-control" rows="1"></textarea>

                                                <!-- <span class="help-block"></span> -->
                                            </div>

                                        </div>

                                        <div class="form-group row clearfix">

                                            <div class="col-md-11 col-md-offset-1">
                                                <label for="id_yours_investment_goals">What are yours investment goals?</label>
                                            </div>

                                            <div class="col-md-10 col-md-offset-1 col-lg-8 ">
                                                <textarea name="yours_investment_goals" id="id_yours_investment_goals" class="form-control" rows="1"></textarea>

                                                <!-- <span class="help-block"></span> -->
                                            </div>

                                        </div>

                                        <div class="form-group row clearfix">

                                            <div class="col-md-11 col-md-offset-1">
                                                <label for="id_important_attributes">What are the most important attributes you consider before investing?</label>
                                            </div>

                                            <div class="col-md-10 col-md-offset-1 col-lg-8">
                                                <textarea name="important_attributes" id="id_important_attributes" class="form-control" rows="1"></textarea>

                                                <!-- <span class="help-block"></span> -->
                                            </div>

                                        </div>
             
                                        <div class="form-group row clearfix">
                                            <div class="col-md-11 col-lg-9">
                                                <div class="controls ">
                                                    <button type="submit" class="bg-inverse btn btn-secondary btn-lg pull-right"> Save </button>
                                                </div>
                                            </div>
                                        </div>

                                    </section>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>

            </div>
        </div>

        <!-- popover content for ssn field -->
        <div class="popover-content-ssn">
            <i class="fa fa-info-circle"></i>
            <span>Why do we need this? I know it seems terribly invasive but we are required to obtain your socialsecurity number for two reasons, 1) regulators require we comply with know your customer and anti-money laundering rules and; 2) companies will need to provide you with tax information based on your investment.  Don’t worry, we’re obsessive about your privacy.</span>
        </div>

    </div>`
    }
});
