define(function () {
    return ` <!-- Home Section -->
        <% let campaign = model.attributes; %>
          <section class="home-section bg-dark-alfa-70 parallax-2 fixed-height-small" style="background-image: url(http://gf-django-dev.us-east-1.elasticbeanstalk.com/static/rhythm/img/bg.jpg)" id="home">
                  <div class="js-height-parent container" style="height: 600px">
                  
                  <!-- Hero Content -->
                  <div class="home-content">
                      <div class="home-text">
                          
                          <h2 class="hs-line-14 font-alt mb-50 mb-xs-30">
                          <%- campaign.company.name %>
                          </h2>
                          <h1 class="hs-line-8 no-transp font-alt mb-50 mb-xs-30">
                          <%- campaign.company.website %>&nbsp;|&nbsp;
                          <%- campaign.company.city %>,&nbsp;
                          <%- campaign.company.state %>&nbsp;|&nbsp;
                          Founded in <%- campaign.company.founding_date %>
                          </h1>
                          
                          <div class="local-scroll">
                              <a href="<%- campaign.video %>" class="big-icon-link" data-toggle="modal" data-target="#videoEmbed">
                                  <span class="big-icon"><i class="fa fa-play"></i></span>
                              </a>

                              <div class="modal fade" id="videoEmbed" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="embed-responsive embed-responsive-16by9">
                                          <iframe class="embed-responsive-item" src="<%- campaign.video %>" allowfullscreen></iframe>
                                        </div>
                                    </div>
                                </div>
                              </div>
                          </div>
                          
                      </div>
                  </div>
                  <!-- End Hero Content -->
                  
              </div>
          </section>
          <!-- End Home Section -->
          <!-- About Section -->
          <section class="campaign-section">
              <div class="container relative">
                  
                  <div class="section-text">
                      <div class="row">
                          <div class="col-md-4 text-center">
                              <blockquote>
                                  <p>
                                      <%- campaign.progress %>% TO GOAL
                                  </p>
                              </blockquote>
                              <small>
                              $<%- campaign.amount_raised %> RAISED
                              </small>
                              <div class="progress tpl-progress-alt">
                                  <div class="progress-bar" role="progressbar" aria-valuenow="<%- campaign.progress %>" aria-valuemin="0" aria-valuemax="100">
                                      funding <span><%- campaign.progress %>% | $<%- campaign.amount_raised %> / <%- campaign.minimum_raise %></span>
                                  </div>
                              </div>
                              <p class="lead">
                                  This is a Preferred Equity Agreement
                              </p>
                          </div>
                          <div class="col-md-8">
                              <div class="count-wrapper">
                                  <div class="row">
                                      
                                      <!-- Counter Item -->
                                      <div class="col-xs-6 col-sm-3">
                                        <div class="count-number2">$<span class="count-number"><%- model.get_premoney_valuation()[0] %></span></div>
                                          <div class="count-descr font-alt">
                                              <span><%- model.get_premoney_valuation()[1] %></span><br><br>
                                              <span class="count-title">PRE MONEY VAULATION</span>
                                          </div>
                                      </div>
                                      <!-- End Counter Item -->
                                  
                                      <!-- Counter Item -->
                                      <div class="col-xs-6 col-sm-3">
                                        <div class="count-number2">$<span class="count-number"><%- model.get_minimum_raise()[0] %></span></div>
                                          <div class="count-descr font-alt">
                                              <span><%- model.get_minimum_raise()[1] %></span><br><br>
                                              <span class="count-title">MINIMUM<br>RAISE</span>
                                          </div>
                                      </div>
                                      <!-- End Counter Item -->
                                      
                                      <!-- Counter Item -->
                                      <div class="col-xs-6 col-sm-3">
                                        <div class="count-number2">$<span class="count-number"><%- model.get_maximum_raise()[0] %></span></div>
                                          <div class="count-descr font-alt">
                                              <span><%- model.get_maximum_raise()[1] %></span><br><br>
                                              <span class="count-title">MAXIMUM<br>RAISE</span>
                                          </div>
                                      </div>
                                      <!-- End Counter Item -->
                                      
                                      <!-- Counter Item -->
                                      <div class="col-xs-6 col-sm-3">
                                          <div class="count-number"><%- model.get_days_to_go %></div>
                                          <div class="count-descr font-alt">
                                              <span>days</span><br><br>
                                              <span class="count-title">ENDS IN</span>
                                          </div>
                                      </div>
                                      <!-- End Counter Item -->
                                      
                                  </div>
                              </div>
                              <div class="row">
                                  <div class="col-md-12 text-center">
                                      <form action="<%- Urls['campaign-invest'](campaign.id) %>" class="form form-horizontal" method="get">
                                          <div class="row">
                                              <div class="col-md-5">
                                                  <h3 class="mt-20">I'D LIKE TO INVEST:</h3>
                                              </div>
                                              <div class="col-md-3">
                                                  <div class="" style="padding: 1em; float: right">
                                                      <input type="text" name="amount" value="<%- campaign.minimum_increment %>" placeholder="I'd Like to Invest" class="form-control input-lg form-inline">
                                                  </div>
                                              </div>
                                              <div class="col-md-4" style="padding-left: 0px">
                                                  <a href="<%- Urls['campaign-invest'](campaign.id).replace('api/', '') %>" 
                                                    class="btn btn-mod btn-t-color btn-large" 
                                                    value="invest" 
                                                    >Invest</a>
                                              </div>
                                          </div>
                                      </form>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  
              </div>
          </section>
          <!-- End About Section -->
          <!-- Section -->
          <section class="campaign-section">
              <div class="container relative">
                  
                  <!-- Row -->
                  <div class="row">
                      
                      <!-- Col -->
                      
                      <div class="col-sm-12">
                          
                          <!-- Nav Tabs -->
                          <div class="align-center mb-40 mb-xs-30">
                              <ul class="nav nav-tabs tpl-minimal-tabs">
                                  
                                  <li class="active">
                                      <a href="#our_company" data-toggle="tab" data-url="out_company">OUR COMPANY</a>
                                  </li>
                                  
                                  <li>
                                      <a href="#why_choose_us" data-toggle="tab" data-url="why_choose_us">WHY CHOOSE US?</a>
                                  </li>
                                  
                                  <li>
                                      <a href="#speak_with_us" data-toggle="tab" data-url="speak_with_us">SPEAK WITH US</a>
                                  </li>
                                  <li>
                                      <a href="#specifics_and_extras" data-toggle="tab" data-url="psecifies_and_extras">SPECIFICS AND EXTRAS</a>
                                  </li>
                              </ul>
                          </div>
                          <!-- End Nav Tabs -->
                          
                          <!-- Tab panes -->
                          <div class="tab-content tpl-minimal-tabs-cont section-text">
                              
                              <div class="tab-pane active text-center" id="our_company">
                              <section class="section-text margin-top-40">
                                  <h3>WHAT YOU ARE INVESTING IN</h3>
                                  <p class="lead">
                                  <%- campaign.description %>
                                  </p>

                                  <hr>

                                  <h3>OUR EDGE</h3>
                                  <p class="lead">
                                  <%- campaign.pitch %>
                                  </p>

                                  <hr>

                                  <h2>PRESS</h2>
                                  <ul class="list-unstyled text-left">
                                      <li class="mix">
                                        <h6><a href="https://www.indiewire.com/2016/06/alamo-drafthouse-tim-league-robot-chicken-fan-owned-studio-will-work-legion-m-1201686785/" target="_blank">Why Tim League and Robot Chicken Team Think a Fan-Owned Studio Will Work</a></h6>
                                      </li>
                                      <li class="mix">
                                        <h6><a href="http://www.thestreet.com/video/13534695/how-legion-m-plans-to-take-down-the-hollywood-studios.html" target="_blank">How Legion M Plans to Take Down the Hollywood Studios - TheStreet
                                        </a></h6>
                                      </li>
                                      <li class="mix">
                                        <h6><a href="http://filmmakermagazine.com/98634-alamo-drafthouse-partners-fan-owned-studio-legion-m/#.V0i4MFe4zjM" target="_blank">Alamo Drafthouse Partners with Fan-Owned Studio Legion M | Filmmaker Magazine</a></h6>
                                      </li>
                                      <li class="mix">
                                        <h6><a href="https://www.indiewire.com/2016/06/alamo-drafthouse-tim-league-robot-chicken-fan-owned-studio-will-work-legion-m-1201686785/" target="_blank">Why Tim League and Robot Chicken Team Think a Fan-Owned Studio Will Work</a></h6>
                                      </li>
                                      <li class="mix">
                                        <h6><a href="http://www.thestreet.com/video/13534695/how-legion-m-plans-to-take-down-the-hollywood-studios.html" target="_blank">How Legion M Plans to Take Down the Hollywood Studios - TheStreet
                                        </a></h6>
                                      </li>
                                      <li class="mix">
                                        <h6><a href="http://filmmakermagazine.com/98634-alamo-drafthouse-partners-fan-owned-studio-legion-m/#.V0i4MFe4zjM" target="_blank">Alamo Drafthouse Partners with Fan-Owned Studio Legion M | Filmmaker Magazine</a></h6>
                                      </li>
                                  </ul>
                            </section>


                                  <!-- Gallery -->
                              <!-- Portfolio Section -->
                              <section class="section-text margin-top-40">
                                <!-- The Bootstrap Image Gallery lightbox, should be a child element of the document body -->
                                <div class=" relative">
                                    <h2>Gallery</h2>
                                    <!-- Works Grid -->
                                    <ul class="list-inline" id="gallery1">
                                        <!-- Work Item -->
                                        <li class="list-inline-item ">
                                          <a href="http://showlovedress.com/wp-content/uploads/2016/03/fashion-models.jpg" class="popupImageLink" data-size="1200x1024" data-pswp-uid="1">
                                              <img width="350" height="280" src="http://showlovedress.com/wp-content/uploads/2016/03/fashion-models.jpg"  />
                                          </a>
                                        </li>
                                        <li class="list-inline-item ">
                                          <a href="http://fashionplace.org/wp-content/uploads/2016/04/DenimFashion.Styleclickcity.com_.jpg" class="popupImageLink" data-size="1200x1024" data-pswp-uid="1">
                                              <img width="350" height="280" src="http://fashionplace.org/wp-content/uploads/2016/04/DenimFashion.Styleclickcity.com_.jpg" />
                                          </a>
                                        </li>
                                        <li class="list-inline-item ">
                                          <a href="http://showlovedress.com/wp-content/uploads/2016/03/fashion-models.jpg" class="popupImageLink" data-size="600x400" data-pswp-uid="1">
                                              <img width="350" height="280" src="http://showlovedress.com/wp-content/uploads/2016/03/fashion-models.jpg" />
                                          </a>
                                        </li>
                                        <li class="list-inline-item ">
                                          <a href="http://careerlaunchsuccess.com/wp-content/uploads/2016/06/Fashion-Photography-by-Diamond-Films.jpg" class="popupImageLink" data-size="1200x1024" data-pswp-uid="1">
                                              <img width="350" height="280" src="http://careerlaunchsuccess.com/wp-content/uploads/2016/06/Fashion-Photography-by-Diamond-Films.jpg" />
                                          </a>
                                        </li>
                                        <li class="list-inline-item ">
                                          <a href="http://cdn.playbuzz.com/cdn/3ee3a1e5-6e79-4a32-87d0-c1ca587d52ce/065f614f-23c8-46bd-b42e-2e8d5e439d74.jpg" class="popupImageLink" data-size="1200x1024" data-pswp-uid="1">
                                              <img width="350" height="280" src="http://cdn.playbuzz.com/cdn/3ee3a1e5-6e79-4a32-87d0-c1ca587d52ce/065f614f-23c8-46bd-b42e-2e8d5e439d74.jpg" />
                                          </a>
                                        </li>
                                        <li class="list-inline-item ">
                                          <a href="http://fashion-design-course.com/blog/wp-content/uploads/2013/02/fashion-designer-fashion-designers-course.jpg" class="popupImageLink" data-size="1200x1024" data-pswp-uid="1">
                                              <img width="350" height="280" src="http://fashion-design-course.com/blog/wp-content/uploads/2013/02/fashion-designer-fashion-designers-course.jpg" />
                                          </a>
                                        </li>
                                        <!-- End Work Item -->
                                    </ul>
                                </div>
                              </section>
                              <!-- End Portfolio Section -->
                                  <!-- /Gallery -->

                                  <!-- Video -->
                              <!-- Portfolio Section -->
                              <section class="section-text margin-top-40">
                                <div class=" relative">
                                    <h2>Videos</h2>
                                    <!-- Works Grid -->
                                    <ul class="list-inline">
                                        <li class="list-inline-item ">
                                            <h4>How To Be a YouTube Star (ft. The Rock)</h4>
                                            <div class="work-img-1">
                                              <iframe width="350" height="230" src="//www.youtube.com/embed/lYbLrteNzOo?hl=en_US&amp;rel=0&autoplay=0" frameborder="0" allowfullscreen></iframe>
                                            </div>
                                        </li>
                                        <li class="list-inline-item ">
                                            <h4>The Arranged Marriage :: A MadTatter Films Short</h4>
                                            <div class="work-img-1">
                                              <iframe width="350" height="230" src="//www.youtube.com/embed/p5q7cjPmpI0?hl=en_US&amp;rel=0&autoplay=0" frameborder="0" allowfullscreen></iframe>
                                            </div>
                                        </li>
                                        <li class="list-inline-item ">
                                            <h4>The Time I Met The Rock!!</h4>
                                            <div class="work-img-1">
                                              <iframe width="350" height="230" src="//www.youtube.com/embed/AkFhwlRZwf4?hl=en_US&amp;rel=0&autoplay=0" frameborder="0" allowfullscreen></iframe>
                                            </div>
                                        </li>
                                        <li class="list-inline-item ">
                                            <h4>The Time I Met The Rock!!</h4>
                                            <div class="work-img-1">
                                              <iframe width="350" height="230" src="//www.youtube.com/embed/AkFhwlRZwf4?hl=en_US&amp;rel=0&autoplay=0" frameborder="0" allowfullscreen></iframe>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                              </section>
                              <!-- End Portfolio Section -->
                                  <!-- /Gallery -->

                              </div>
                              
                              <div class="tab-pane fade" id="why_choose_us">
                                  <div class="text-center">
                                      
                                      <h2>WHY WE ARE RAISING CAPITAL, AND WHAT WE’LL DO WITH IT</h2>
                                      <p class="lead">
                                          <%- campaign.intended_use_of_proceeds %>
                                      </p>
                                  </div>
                                  <hr>
                                  <%- campaign.important_info %>

                                  <%- campaign.members %>
                              </div>

                              <div class="tab-pane fade speak_with_us" id="speak_with_us">

                                  <div class="row section-text">
                                      <div class="col-md-8">

                                          {% if request.user.is_authenticated %}
                                            {% render_comment_form for campaign %}
                                            <div id="chatwizard"></div>
                                          {% else %}
                                          <div class="alert notice">
                                            <i class="fa-lg fa fa-exclamation-triangle"></i> 
                                            In order to be able to ask a questions you have to <a href="{% url 'account_login' %}">login</a>
                                          </div>
                                          <div id="chatwizard"></div>
                                          {% endif %}
                                      </div>
                                      
                                      <div class="col-md-4">
                                          {% if campaign.faq %}
                                          <h2>FAQ</h2>
                                          <hr class="mb-30"/>
                                            {% for elem in campaign.faq %}
                                              {% for k,v in elem.items %}
                                                <h4 class="font-alt">{{ k }}</h4>
                                                <p> {{ v }} </p>
                                                <hr class="mb-30"/>
                                              {% endfor %}
                                            {% endfor %}
                                          {% else %}
                                          <div class="alert">
                                            <i class="fa fa-lg fa-comments-o"></i> Frequently Asked Questions
                                          </div>
                                          {% endif %}

                                      </div>
                                  </div>
                              </div>

                              <div class="tab-pane fade" id="specifics_and_extras">
                                  <div class="row special_extras">
                                      <div class="col-md-8">
                                          <!-- fundraising details -->
                                          <div class="row">
                                              <h2>Fundraising Description</h2>
                                              <div class="col-md-8">
                                                  <dl class="dl-horizontal company_valuation">
                                                      <dt style="display: none">Round Size</dt>
                                          <dd style="display: none">US $<%- campaign.round_size %></dd>
                                                      <dt>Price per share</dt>
                                          <dd>$100</dd>
                                                      <dt>Raised to date</dt>
                                          <dd>$ campaign.get_amount_raised }} </dd>
                                                      <dt>Minimum investment</dt>
                                          <dd>US $ campaign.minimum_increment }}</dd>
                                                      <dt>Target Minimum Raise Amonunt</dt>
                                          <dd>US $ campaign.minimum_raise }}</dd>
                                                      <dt>Maximum Raise Amount</dt>
                                          <dd>US $ campaign.maximum_raise }}</dd>
                                                  </dl>
                                              </div>
                                              <div class="col-md-4">
                                                  <dl>
                                                      <dt>Security Type</dt>
                                          <dd> campaign.get_security_type_display }}</dd>
                                                      <dt>Pre-money valuation</dt>
                                          <dd>US $ campaign.get_premoney_valuation.0 }} {{ campaign.get_premoney_valuation.1 }}</dd>
                                                  </dl>
                                              </div>
                                          </div>
                                          <!-- form c -->
                                          <div class="row">
                                              <h2>RISK AND DISCLOSURES</h2>
                                              <ul class="lead">
                                        <li>A crowdfunding investment involves risk.  You should not invest any funds in this offering unless you can afford to lose your entire investment. </li>
                                        <li>In making an investment decision, investors must rely on their own examination of the issuer and the terms of the offering, including the merits and risks involved.  These securities have not been recommended or approved by any federal or state securities commission or regulatory authority.  Furthermore, these authorities have not passed upon the accuracy or adequacy of this document.</li>
                                        <li>The U.S. Securities and Exchange Commission does not pass upon the merits of any securities offered or the terms of the offering, nor does it pass upon the accuracy or completeness of any offering document or literature.</li>
                                        <li>These securities are offered under an exemption from registration; however, the U.S. Securities and Exchange Commission has not made an independent determination that these securities are exempt from registration.</li>
                                        <li>We are dependent on information technology systems and infrastructure. Any significant breakdown, invasion, destruction or interruption of these systems by employees, others with authorized access to our systems, or unauthorized persons could negatively impact operations. </li>
                                        <li>There is also a risk that we could experience a business interruption, theft of information, or reputational damage as a result of a cyber-attack, such as an infiltration of a data center, or data leakage of confidential information either internally or at our third-party providers.  We conduct a significant part of our coal mining operations on properties that we lease. A title defect or the loss of a lease could adversely affect our ability to mine the associated coal reserves.</li>
                                                  <!--  campaign.formc.first.potential_risks }} -->
                                              </p>
                                          </div>
                                      </div>
                                      <div class="col-md-4">
                                          <!-- investor extras -->
                                          <div class="perks">
                                              <h2 style="margin-bottom: 5px">Investor Extras</h2>
                                      <small style="margin-bottom: 1.3em;display:  block;">Investor Perks are not intended to affect the value of the security and investors should evaluate the merits of each investment without regard to any Investor Perks.</small>
                                      {% for elem in campaign.perks %}
                                        {% for k,v in elem.items %}
                                        <div>
                                          <h3>{{ k }}</h3>
                                          <p>{{ v }} </p> 
                                        </div>
                                        {% endfor %}
                                      {% endfor %}
                                          </div>
                                          <div class="downloadable">
                                              <h2>Downloadable Files</h2>
                                              <div>
                                        <a href="{{ campaign.get_presentation }}" class="btn btn-mod btn-t-color btn-large btn-block" target="_blank">Investor Presentation</a>
                                                  <a href="https://www.sec.gov/Archives/edgar/data/1651835/000167025416000049/0001670254-16-000049-index.htm" target="_blank" class="btn btn-mod btn-t-color btn-large btn-block">Form C</a>
                                                  <a href="/static/finicials.pdf" class="btn btn-mod btn-t-color btn-large btn-block" target="_blank">Financials</a>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              
                          </div>
                      </div>
                      <!-- End Col -->

                      
                  </div>
                  <!-- End Row -->
                  
              </div>
          </section>
          <!-- End Section -->
<!-- Root element of PhotoSwipe. Must have class pswp. -->
<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

    <!-- Background of PhotoSwipe. 
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

        <!-- Container that holds slides. 
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>

        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">

            <div class="pswp__top-bar">

                <!--  Controls are self-explanatory. Order can be changed. -->

                <div class="pswp__counter"></div>

                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                <button class="pswp__button pswp__button--share" title="Share"></button>

                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                <!-- element will get class pswp__preloader--active when preloader is running -->
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>

            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div> 
            </div>

            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
            </button>

            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
            </button>

            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>

        </div>

    </div>

</div>`
});
