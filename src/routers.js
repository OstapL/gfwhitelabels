const payBackShareCalculator = require('components/payBackShareCalculator/route');
const capitalRaiseCalculator = require('components/capitalRaiseCalculator/route');
const whatMyBusinessWorthCalc = require('components/whatMyBusinessWorthCalculator/route');
const campaignRoute = require('components/campaign/route');
const pageRoute = require('components/pg/route');
const raiseFunds = require('components/raiseFunds/route');
const anonymousAccount = require('components/anonymousAccount/route');
const accountProfile = require('components/accountProfile/route');
const establishedBusinessCalc = require('components/establishedBusinessCalculator/route');
const formc = require('components/formc/route');
const blog = require('components/blog/route');

Backbone.Router.execute = function (callback, args, name) {
  if (name == '/company/create' && !app.user.ensureLoggedIn(name))
    return false;

  if (callback) callback.apply(this, args);
};

let appRoutes = Backbone.Router.extend({
  routes: {
    '*notFound': function () {
      var notFound = require('./templates/404.pug');
      $('#content').html(notFound);
      app.hideLoading();
    }
  },

  execute(callback, args, name) {
    console.debug('/src/routers.js');

    const slashAtTheEnd= /\/$/;
    const isSlashAtTheEnd = slashAtTheEnd.test(Backbone.history.fragment);
    
    if (isSlashAtTheEnd) {
      let fragment = Backbone.history.fragment.replace(slashAtTheEnd, '');
      this.navigate(fragment, {trigger: true, replace: true});
    } else if (callback) {
      callback.apply(this, args)
    };
  },

  initialize() {
    const copyRoutes = (router) => {
      _.each(router.routes, (funcName, path) => this.routes[path] = r1[funcName]);
      return router;
    };

    // add routes of components
    // ToDo
    // So messy code
    
    let r1  = new payBackShareCalculator;
    copyRoutes(r1);
    
    let r2  = new capitalRaiseCalculator;
    copyRoutes(r2);
    
    let r3  = new campaignRoute;
    copyRoutes(r3);
    
    let r4  = new pageRoute;
    copyRoutes(r4);
    
    let r5  = new raiseFunds;
    copyRoutes(r5);
    
    let r6  = new anonymousAccount;
    copyRoutes(r6);
    
    let r7  = new accountProfile;
    copyRoutes(r7);
    
    let r8  = new whatMyBusinessWorthCalc;
    copyRoutes(r8);
    
    let r9  = new establishedBusinessCalc;
    copyRoutes(r9);
    
    let r10  = new formc;
    copyRoutes(r10);
    
    let r11  = new blog;
    copyRoutes(r11);
  },

  back: function (e) {
    // Create requirements and do clean up before
    // running view function
    // Undelegate and clear all popovers
    $('#content').off('submit');
    $('#content').off('click');
    //$('form').undelegate();
    $('.popover').popover('hide');
  },

});

app.on('userLoaded', function (data) {

  app.routers = new appRoutes();
  app.user.url = serverUrl + Urls['rest_user_details']();
  Backbone.history.start({ pushState: true });

  window.addEventListener('popstate', app.routers.back);

  // if user is not authenticated - add login/sign up popup
  // if (data.id == '') {
  //   $('body').after(
  //     `<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
  //     <div class="modal-dialog" role="document">
  //     <div class="modal-content">
  //     <div class="modal-header">
  //     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
  //     <span aria-hidden="true">&times;</span>
  //     </button>
  //     <h4 class="modal-title" id="loginModalLabel">Login</h4>
  //     </div>
  //     <div class="modal-body">
  //     <form>
  //     <div class="clearfix"><div class="form-group row email"><div class="col-lg-3 col-md-3 text-md-right"><label for="email">email</label></div><div class="col-lg-7 col-md-7"><input class="form-control" id="email" name="email" placeholder="email" type="email" value=""><span class="help-block"> </span></div></div><div class="form-group row password"><div class="col-lg-3 col-md-3 text-md-right"><label for="password">password</label></div><div class="col-lg-7 col-md-7"><input class="form-control" id="password" name="password" placeholder="password" type="password" value=""><span class="help-block"> </span></div></div><div class="socialaccount_ballot clearfix"><div class="col-lg-12 col-sm-12 col-xs-12 text-sm-left"><p>Or login with</p></div><div class="col-sm-12 col-xs-12 col-lg-12"><ul class="social-icons list-inline clearfix text-lg-left"><li><a class="fa fa-facebook social-icon-color facebook" data-original-title="facebook" href="/accounts/facebook/login/?process=login"> </a></li><li><a class="fa fa-google-plus social-icon-color googleplus" data-original-title="Google Plus" href="/accounts/google/login/?process=login"></a></li><li><a class="fa fa-linkedin social-icon-color linkedin" data-original-title="Linkedin" href="/accounts/linkedin_oauth2/login/?process=login"></a></li></ul></div></div></div>
  //     </form>
  //     </div>
  //     <div class="modal-footer">
  //     <button type="button" class="btn btn-primary">Login</button>
  //     </div>
  //     </div>
  //     </div>
  //     </div>
  //     `
  //     );
  // }

  let menu = require('components/menu/views.js');
  app.menu = new menu.menu({
    el: '#menuList',
  });
  app.menu.render();
  let i = new menu.footer({
    el: '.footer_new',
  });
  i.render();

  app.notification = new menu.notification({
    el: '#menuNotification',
  });
  app.notification.render();
  app.profile = new menu.profile({
    el: '#menuProfile',
  });
  app.profile.render();
  app.trigger('menuReady');
});

$(document).ready(function () {

  // show bottom logo while scrolling page
  $(window).scroll(function () {
    var $bottomLogo = $('#fade_in_logo');
    var offsetTopBottomLogo = $bottomLogo.offset().top;

    if (($(window).scrollTop() + $(window).height() >= offsetTopBottomLogo) &&
      !$bottomLogo.hasClass('fade-in')) {
      $bottomLogo.addClass('fade-in');
    }
  });

});
