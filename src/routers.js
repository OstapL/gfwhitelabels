const payBackShareCalculator = require('components/payBackShareCalculator/route');
const capitalRaiseCalculator = require('components/capitalRaiseCalculator/route');
const whatMyBusinessWorthCalc = require('components/whatMyBusinessWorthCalculator/route');
const campaignRoute = require('components/campaign/route');
const pageRoute = require('components/pg/route');
const raiseFunds = require('components/raiseFunds/route');
const anonymousAccount = require('components/anonymousAccount/route');
const accountProfile = require('components/accountProfile/route');
const establishedBusinessCalc = require('components/establishedBusinessCalculator/route');

Backbone.Router.execute = function (callback, args, name) {
  console.log('asdfasfdasd ', callback, args, name);
  if (name == '/company/create' && !app.user.is_anonymouse()) {
    const template = require('components/anonymousAccount/templates/popupLogin.pug');
    require.ensure([], function() {
      $('body').append(
        template({
          next: name,
        })
      );
      $('#sign_up').modal();
    });
    return false;
  }
  if (callback) callback.apply(this, args);
};

let appRoutes = Backbone.Router.extend({
  routes: {},
  initialize() {
    // add routes of components
    // ToDo
    // So messy code
    let r1  = new payBackShareCalculator;
    _.each(r1.routes, (funcName, path) => {
      this.routes[path] = r1[funcName];
    });
    let r2  = new capitalRaiseCalculator;
    _.each(r2.routes, (funcName, path) => {
      this.routes[path] = r2[funcName];
    });
    let r3  = new campaignRoute;
    _.each(r3.routes, (funcName, path) => {
      this.routes[path] = r3[funcName];
    });
    let r4  = new pageRoute;
    _.each(r4.routes, (funcName, path) => {
      this.routes[path] = r4[funcName];
    });
    let r5  = new raiseFunds;
    _.each(r5.routes, (funcName, path) => {
      this.routes[path] = r5[funcName];
    });
    let r6  = new anonymousAccount;
    _.each(r6.routes, (funcName, path) => {
      this.routes[path] = r6[funcName];
    });
    let r7  = new accountProfile;
    _.each(r7.routes, (funcName, path) => {
      this.routes[path] = r7[funcName];
    });
    let r8  = new whatMyBusinessWorthCalc;
    _.each(r8.routes, (funcName, path) => {
      this.routes[path] = r8[funcName];
    });
    let r9  = new establishedBusinessCalc;
    _.each(r9.routes, (funcName, path) => {
      this.routes[path] = r8[funcName];
    });
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
  if (data.id == '') {
    $('body').after(
      `<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
      <div class="modal-content">
      <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
      <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title" id="loginModalLabel">Login</h4>
      </div>
      <div class="modal-body">
      <form>
      <div class="clearfix"><div class="form-group row email"><div class="col-lg-3 col-md-3 text-md-right"><label for="email">email</label></div><div class="col-lg-7 col-md-7"><input class="form-control" id="email" name="email" placeholder="email" type="email" value=""><span class="help-block"> </span></div></div><div class="form-group row password"><div class="col-lg-3 col-md-3 text-md-right"><label for="password">password</label></div><div class="col-lg-7 col-md-7"><input class="form-control" id="password" name="password" placeholder="password" type="password" value=""><span class="help-block"> </span></div></div><div class="socialaccount_ballot clearfix"><div class="col-lg-12 col-sm-12 col-xs-12 text-sm-left"><p>Or login with</p></div><div class="col-sm-12 col-xs-12 col-lg-12"><ul class="social-icons list-inline clearfix text-lg-left"><li><a class="fa fa-facebook social-icon-color facebook" data-original-title="facebook" href="/accounts/facebook/login/?process=login"> </a></li><li><a class="fa fa-google-plus social-icon-color googleplus" data-original-title="Google Plus" href="/accounts/google/login/?process=login"></a></li><li><a class="fa fa-linkedin social-icon-color linkedin" data-original-title="Linkedin" href="/accounts/linkedin_oauth2/login/?process=login"></a></li></ul></div></div></div>
      </form>
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-primary">Login</button>
      </div>
      </div>
      </div>
      </div>
      `
      );
  }

  let menu = require('components/menu/views.js');
  app.menu = new menu.menu({
    el: '#menuList',
  });
  app.menu.render();

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
