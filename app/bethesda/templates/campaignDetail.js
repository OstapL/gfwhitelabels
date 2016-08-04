define(function () {
    return `
  <section class="home-section bg-dark-alfa-70 parallax-2 fixed-height-small" data-background="https://s3.amazonaws.com/growthfountain-development/filer_public/60/0e/600e5642-6b02-4a9b-b901-c651f2f62b5b/1.jpg" id="home" style="background-image: url(&quot;https://s3.amazonaws.com/growthfountain-development/filer_public/60/0e/600e5642-6b02-4a9b-b901-c651f2f62b5b/1.jpg&quot;);">
    <div class="js-height-parent container" style="height: 600px">
      <!-- Hero Content -->
      <div class="home-content">
                <div class="home-text">
          <h2 class="hs-line-14 font-alt margin-bottom-50 mb-xs-30">Pia</h2>
          <h1 class="hs-line-8 no-transp font-alt margin-bottom-50 mb-xs-30">
          http://pia.io&nbsp;|&nbsp;
          New York,&nbsp;
          NY&nbsp;|&nbsp;
          Founded in Jan. 1, 2015
          </h1>
          <div class="local-scroll">
            <a href="https://www.youtube.com/watch?v=eE-zAcJusWU" class="big-icon-link lightbox-gallery-1 mfp-iframe">
              <span class="big-icon"><i class="fa fa-play"></i></span>
            </a>
          </div>
        </div>
      </div>
      <!-- End Hero Content -->
    </div>
  </section>

  <section class="campaign-section">
    <div class="container relative">
      <div class="section-text">
        <div class="row">
          <div class="col-lg-4 text-center padding-top-30">
            <h2>10% TO GOAL</h2>
            <small>$20000 RAISED</small>
            <div class="progress tpl-progress-alt">
              <div class="progress-bar" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style="width: 10%;">funding <span>10% | $20000 / 200000</span>
              </div>
            </div>
            <p>This is a Preferred Equity Agreement</p>
          </div>
          <div class="col-lg-8">
            <div class="count-wrapper">
              <div class="row">
                <!-- Counter Item -->
                <div class="col-xs-6 col-sm-3">
                  <div class="count-number">5</div>
                  <div class="count-descr font-alt">
                    <span>Million $</span><br><br>
                    <span class="count-title">PRE MONEY VAULATION</span>
                  </div>
                </div>
                <!-- End Counter Item -->
                
                <!-- Counter Item -->
                <div class="col-xs-6 col-sm-3">
                  <div class="count-number">200</div>
                  <div class="count-descr font-alt">
                    <span>Thousand $</span>
                    <br>
                    <br>
                    <span class="count-title">MINIMUM<br>RAISE</span>
                  </div>
                </div>
                <!-- End Counter Item -->

                <!-- Counter Item -->
                <div class="col-xs-6 col-sm-3">
                  <div class="count-number">0</div>
                  <div class="count-descr font-alt">
                    <span> $</span>
                    <br>
                    <br>
                    <span class="count-title">MAXIMUM<br>RAISE</span>
                  </div>
                </div>
                <!-- End Counter Item -->

                <!-- Counter Item -->
                <div class="col-xs-6 col-sm-3">
                  <div class="count-number">120</div>
                  <div class="count-descr font-alt">
                    <span>days</span>
                    <br>
                    <br>
                    <span class="count-title">ENDS IN</span>
                  </div>
                </div>
                <!-- End Counter Item -->
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 text-center">
                <form action="/api/campaign/<%= model.id %>/invest" class="form form-horizontal margin-bottom-20" method="get">
                  <div class="row">
                    <div class="col-md-5">
                      <h3 class="margin-top-20">I'D LIKE TO INVEST:</h3>
                    </div>
                    <div class="col-md-3">
                      <div class="padding-1em">
                        <input type="text" name="invest" value="1000" placeholder="I&#39;d Like to Invest" class="form-control input-lg form-inline invest_input">
                      </div>
                    </div>
                    <div class="col-md-4 nopadding">
                      <input type="submit" class="btn light_blue btn-mod text-uppercase pull-md-left invest_btn" value="invest">
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

  <!-- Section -->
  <section class="campaign-section">
    <div class="container relative profile">
      <!-- Row -->
      <div class="row">
        <!-- Col -->
        <div class="col-sm-12">
          <!-- Nav Tabs -->
            <ul class="nav nav-tabs profile-tabs"  role="tablist">
              <li class="nav-item">
                <a class="nav-link uppercase" href="#mini-one" data-toggle="tab" aria-expanded="false">OUR COMPANY</a>
              </li>
              <li class="nav-item">
                <a class="nav-link uppercase" href="#mini-two" data-toggle="tab" role="tab">WHY CHOOSE US?</a>
              </li>
              <li class="nav-item">
                <a class="nav-link uppercase active" href="#mini-three" data-toggle="tab" role="tab">SPEAK WITH US</a>
              </li>
              <li class="nav-item">
                <a class="nav-link uppercase" href="#mini-four" data-toggle="tab" role="tab">SPECIFICS AND EXTRAS</a>
              </li>
            </ul>
          <!-- End Nav Tabs -->

          <!-- Tab panes -->
          <div class="tab-content">
            <div class="tab-pane text-center" id="mini-one">
              <h2>WHAT YOU ARE INVESTING IN</h2>
              <p>Becky's Bakery is a Pittsburgh bakery. Its gluten free cupcakes and 100+ sinful sweets have been a tradition for the last 40 years. In fact, there's been a bakery in continuous operation at the flagship Shadyside store for over 100 years.</p>
              <hr>
              <h2>OUR EDGE</h2>
              <p>Becky's Bakery has become the premiere purveyor of gluten free cupcakes, specialty cakes and more in the Greater Puyallup area and beyond. Being a small business, we love to give back through donating to worthy causes and growing our team to provide jobs for more people. Each year we donate thousands of cupcakes to help our community and we have grown our team from just two when we started to a team of 13 today. We can't wait to be able to serve more people in the near future, but we need YOUR help.</p>
              <hr>
            </div>
            <div class="tab-pane" id="mini-two">
              <div class="text-center">
                <h2>WHY WE ARE RAISING CAPITAL, AND WHAT WE’LL DO WITH IT</h2>
                <p>We're raising money to be able to purchase some additional commercial restaurant equipment, an espresso machine, grinders, blenders, tables, chairs and more. (THAT'S RIGHT - WE'RE ADDING A FULL COFFEE LINEUP TO OUR BUSINESS - YOU ASKED FOR IT AND WE ARE NOW MAKING IT A REALITY).  We will be transforming the entire look and feel of the space to make it warm, inviting and comfortable.  We want you to relax, spend some time with friends, jump on the free wi-fi, enjoy your favorite latte and try some new desserts.  Your help will allow us to transform Becky's Bakery and take it to new heights!</p>
              </div>
              <hr>
            </div>
            <div class="tab-pane speak_with_us active in" id="mini-three">
              <div class="row section-text">
                <div class="col-md-8">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="section-text text-lg-center">
                        <form id="comment_form" class="form margin-bottom-20" action="http://192.168.99.100:8000/comments/post/" method="post" onsubmit="return false;">
                          <input type="hidden" name="csrfmiddlewaretoken" value="H0dz4xum2FdaaMB2W3M92tg0ylaJMk6m">
                          <input id="id_object_pk" name="object_pk" type="hidden" value="1">
                          <input id="id_timestamp" name="timestamp" type="hidden" value="1468936787">
                          <input id="id_security_hash" maxlength="40" name="security_hash" type="hidden" value="88e20a45236049a814c3d1dac9ce371f1c3f0ae8">
                          <input id="id_honeypot" name="honeypot" type="text">
                          <input id="id_content_type" name="content_type" type="hidden" value="campaigns.campaign">
                          <div class="wpcf7-form-control-wrap your-message">
                            <textarea class=" wpcf7-form-control wpcf7-textarea" cols="40" id="id_comment" name="comment" placeholder="Comment" rows="10"></textarea>
                          </div>
                          <div class="wpcf7-form-control-wrap your-message">
                            <div class="text-left">
                              <input id="id_disclosure" name="disclosure" type="checkbox">
                              I am acting on behalf of the company
                            </div>
                          </div>
                          <br>
                          <div class="control-group text-lg-right padding-top-10 clearfix">
                            <div class="controls">
                              <button type="submit" class="light_blue btn">Ask Question</button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div id="chatwizard">
                    <hr class="mb-30">
                    <p id="c24"></p>
                    <div>
                      <b>Dmirty Admin5</b>
                      <small>asked a question on June 15, 2016, 6:52 p.m.</small>
                    </div>
                    <div class="company_repres">Company representative</div>
                    asdg asdg<br>asdgadsg<br>asdg<p></p>
                    <div class="col-md-offset-2">
                      <dl id="comments"></dl>
                    </div>
                    <hr class="mb-30">
                    <p id="c7"></p>
                    <div>
                      <b>Dmirty Admin5</b>
                      <small>asked a question on June 14, 2016, 8:16 p.m.</small>
                    </div>
                    adgdasg<br>ASdg
                    <p></p>
                    <div class="col-md-offset-2">
                      <dl id="comments"></dl>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="alert alert-info">
                    <i class="fa fa-lg fa-comments-o"></i>
                    Frequently Asked Questions
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane" id="mini-four">
              <div class="row">
                <div class="col-md-8">
                  <!-- fundraising details -->
                  <div class="row">
                    <h2>Fundraising Description</h2>
                    <div class="col-md-6">
                      <dl class="dl-horizontal">
                        <dt>Round Size</dt>
                        <dd>US $</dd>
                        <dt>Raised to date</dt>
                        <dd>Dec. 30, 2016</dd>
                        <dt>Minimum investment</dt>
                        <dd>US $100</dd>
                        <dt>Target Minimum Raise Amonunt</dt>
                        <dd>US $200000</dd>
                        <dt>Maximum Raise Amount</dt>
                        <dd>US $1000000</dd>
                      </dl>
                    </div>
                    <div class="col-md-6">
                      <dl>
                        <dt>Security Type</dt>
                        <dd>Preferred Equity</dd>
                        <dt>Pre-money valuation</dt>
                        <dd>US $5.0 Million</dd>
                      </dl>
                    </div>
                  </div>
                  <!-- form c -->
                  <div class="row">
                    <h2>SMARTMART RISK AND DISCLOSURES</h2>
                    <ul>
                      <li>A crowdfunding investment involves risk.  You should not invest any funds in this offering unless you can afford to lose your entire investment. </li>
                      <li>In making an investment decision, investors must rely on their own examination of the issuer and the terms of the offering, including the merits and risks involved.  These securities have not been recommended or approved by any federal or state securities commission or regulatory authority.  Furthermore, these authorities have not passed upon the accuracy or adequacy of this document.</li>
                      <li>The U.S. Securities and Exchange Commission does not pass upon the merits of any securities offered or the terms of the offering, nor does it pass upon the accuracy or completeness of any offering document or literature.</li>
                      <li>These securities are offered under an exemption from registration; however, the U.S. Securities and Exchange Commission has not made an independent determination that these securities are exempt from registration.</li>
                      <li>We are dependent on information technology systems and infrastructure. Any significant breakdown, invasion, destruction or interruption of these systems by employees, others with authorized access to our systems, or unauthorized persons could negatively impact operations. </li>
                      <li>There is also a risk that we could experience a business interruption, theft of information, or reputational damage as a result of a cyber-attack, such as an infiltration of a data center, or data leakage of confidential information either internally or at our third-party providers.  We conduct a significant part of our coal mining operations on properties that we lease. A title defect or the loss of a lease could adversely affect our ability to mine the associated coal reserves.</li>
                      <!--  -->
                      <p></p>
                    </ul>
                  </div>
                </div>
                <div class="col-md-4">
                  <!-- investor extras -->
                  <div class="perks">
                    <h2>Investor Extras</h2>
                    <small>Investor Perks are not intended to affect the value of the security and investors should evaluate the merits of each investment without regard to any Investor Perks.</small>
                  </div>
                  <div class="downloadable">
                    <h2>Downloadable Files</h2>
                    <div>
                      <a href="http://192.168.99.100:8000/static/ir_presentation.pdf" class="btn text-uppercase btn_huge light_blue" target="_blank">Investor Presentation</a>
                      <a href="https://www.sec.gov/Archives/edgar/data/1651835/000167025416000049/0001670254-16-000049-index.htm" target="_blank" class="btn text-uppercase btn_huge light_blue">Form C</a>
                      <a href="http://192.168.99.100:8000/static/finicials.pdf" class="btn text-uppercase btn_huge light_blue" target="_blank">Financials</a>
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
    <script src='/js/bootstrap.js'>
    <script src='/js/jquery.appear.js'>
        $(".count-number").appear(function(){
                                var count = $(this);
                                count.countTo({
                                    from: 0,
                                    to: count.html(),
                                    speed: 1300,
                                    refreshInterval: 60,
                               });
        });
    </script>

</div>

</div>

    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.js"></script> 
    `
});
