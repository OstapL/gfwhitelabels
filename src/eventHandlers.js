function paralaxScrollHandler() {
  const $paralax = $(".scroll-paralax .background");
  if (!$paralax || !$paralax.length)
    return;

  const st = $(window).scrollTop() /15;
  $paralax.css({
    "transform" : "translate3d(0px, " + st /2 + "%, .01px)",
    "-o-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
    "-webkit-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
    "-moz-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
    "-ms-transform" : "translate3d(0px, " + st /2 + "%, .01px)",
  });
}        

// show bottom logo while scrolling page
function bottomLogoScrollHandler() {
  const $bottomLogo = $('#fade_in_logo');
  const $window = $(window);
  const offsetTopBottomLogo = $bottomLogo.offset().top;

  if (($window.scrollTop() + $window.height() >= offsetTopBottomLogo) && !$bottomLogo.hasClass('fade-in'))
    $bottomLogo.addClass('fade-in');
}
// для скролл шапки та разшерениях меньше 991px класс "sticky-active" - меняет цвет шапки
function stickyScrollHandler() {
  const $header = $('header');
  if ($(window).scrollTop() > 70) {
    if (!$header.hasClass('sticky-active'))
      $header.addClass("sticky-active");
  } else {
    $('header').removeClass("sticky-active");
  }
}

function scrollLogoHandler() {
  let $bottomLogo = $('#fade_in_logo');
  let offsetTopBottomLogo = $bottomLogo.offset().top;
  let $window = $(window);
  if (($window.scrollTop() + $window.height() >= offsetTopBottomLogo)
    && !$bottomLogo.hasClass('fade-in')) {
    $bottomLogo.addClass('fade-in');
  }
}

function scrollAnimateHandler() {
  const defaultAnimateClasses = ['animated', 'fadeInLeft'];
  const animateSelector = '[data-animate-class]';

  const animateElements = document.querySelectorAll(animateSelector);
  if (!animateElements || !animateElements.length)
    return;

  animateElements.forEach((element) => {
    if (!app.isElementInView(element, 0)) {
      return;
    }
    const animateClasses = element.dataset.animateClass
      ? element.dataset.animateClass.split('|')
      : defaultAnimateClasses;

    animateClasses.forEach((animateClass) => {
      if (!element.classList.contains(animateClass))
        element.classList.add(animateClass);
    });
  });
}

function hideOtherPopovers(popoverElement) {
  // hide other popovers
  const $popoverElements = $('.showPopover');
  $popoverElements.each((idx, elem) => {
    if (elem != popoverElement) {
      const $elem = $(elem);
      if ($elem.attr('aria-describedby')) {
        $(elem).popover('hide');
      }
    }
  });
}

function scrollToTopHandler() {
  function showScrollToTop() {
    const $w = $(window);
    const windowTop = $w.scrollTop();
    return windowTop >= $w.height();
  }

  const scrollToTopElem = document.getElementById('scroll-to-top').parentNode;

  if (showScrollToTop()) {
    scrollToTopElem.classList.remove('collapse');
  } else {
    scrollToTopElem.classList.add('collapse');
  }
}

const popoverTemplate = '<div class="popover  divPopover"  role="tooltip"><span class="popover-arrow"></span> <h3 class="popover-title"></h3> <span class="icon-popover"><i class="fa fa-info-circle" aria-hidden="true"></i></span> <span class="popover-content"> XXX </span></div>';

function initPopover(elem, options={}) {
  if (!elem)
    return;

  if (elem.getAttribute('aria-describedby'))
    return;

  const $popoverElem = $(elem);
  $popoverElem.popover({
    html: true,
    template: options.template || popoverTemplate,
    placement: 'top',
    trigger: 'hover',
  });
  $popoverElem.on('show.bs.popover', (e) => {
    hideOtherPopovers(elem);
  });

  $popoverElem.popover('show');
}

// show bottom logo while scrolling page
$(window).on('scroll', function(e) {
  scrollLogoHandler(e);
  // scrollMenuItemsHandler(e);
  scrollAnimateHandler(e);
  scrollToTopHandler(e);
  paralaxScrollHandler(e);
  stickyScrollHandler(e);
  bottomLogoScrollHandler(e);
});

//attach global event handlers
$('body').on('mouseout', '.showPopover', function () {
  //$(this).popover('hide');
}).on('focusout', '.showPopover', function() {
  //hide all popovers
  hideOtherPopovers();
}).on('mouseover', 'div.showPopover', function () {
  initPopover(this);
}).on('focus', 'input.showPopover', function () {
  initPopover(this, {
    template: popoverTemplate.replace('divPopover', 'inputPopover'),
  })
}).on('focus', 'textarea.showPopover', function () {
  initPopover(this, {
    template: popoverTemplate.replace('divPopover', 'textareaPopover'),
  });
}).on('focus', 'i.showPopover', function () {
  initPopover(this, {
    template: popoverTemplate.replace('divPopover', 'textareaPopover'),
  });
});
$(window).scroll(function () {
});

// Money field auto correction
$('body').on('keyup', '[type="money"]', (e) => {
  app.helpers.format.formatMoneyInputOnKeyup(e);
}).on('focus', '[type="money"]', function (e) {
  // var valStr = e.target.value.replace(/[\$,]/g, '');
  // var val = parseFloat(valStr);
  // if (isNaN(val) || !val)
  //   e.target.value = '';
}).on('blur', '[type="money"]', function (e) {
  // var valStr = e.target.value.replace(/[\$\,]/g, '');
  // if (!e.target.value) {
  //   e.target.value = '$0';
  // }
});

$('body').on('keyup', '[type=percent]', (e) => {
  app.helpers.format.formatPercentFieldOnKeyUp(e);
}).on('focus', '[type=percent]', (e) => {
  const input = e.target;
  const numberValue = input.value.replace(/[^0-9\-\.]/g, '');
  const number = Number(numberValue);
  if (isNaN(number) || number === 0) {
    input.value = '';
    return;
  }
  input.value = number + '%';
  const cursorPosition = input.value.length - 1;
  setTimeout(() => {
    input.setSelectionRange(cursorPosition, cursorPosition);
  }, 100);
});//.on('blur', '[type=percent]', (e) => {
  // const value = e.target.value;
  // const numberValue = value.replace(/[^0-9\.\-]/g, '');
  // let number = Number(numberValue);
  // if (isNaN(number) || !number)
  //   e.target.value = '0%';
  // else
  //   e.target.value = number + '%';
//});

// для показа биографии на стр. pg/team
$('body').on('click', '.team-member-list article', function () {
  var targetTextId = $(this).css('z-index') == 2 && $(this).data('id-text-xs') ? $(this).data('id-text-xs') : $(this).data('id-text');

  if ($(targetTextId).hasClass('open')) {
    $(targetTextId).removeClass('open').slideUp();
  } else {
    $(this).closest('.team-member-list').find('.biography-text.open').removeClass('open').hide();
    $(targetTextId).addClass('open').slideDown();
  }
});

// scripts for mobile menu
$('body').on('click', '#toggle_mobile_menu', function () {
  const $html = $('html');
  const cssClass = 'show-menu';
  $html.toggleClass(cssClass);
  //const preventBodyScroll = $html.hasClass(cssClass);
  //app.preventBodyScrolling(preventBodyScroll);
});

$('html').on('click', function () {
  if ($('header').hasClass('no-overflow')) {
    $('header').removeClass('no-overflow');
  }
});

$('body').on('click', '.notification-bell', function () {
  event.preventDefault()
  if ($('.navbar-toggler:visible').length !== 0) {
    $('html').removeClass('show-menu');
    $('header').toggleClass('no-overflow-bell');
  }

  return false;
});

$('body').on('click', '#menuList .nav-item, #menuList .mobile-signup', function (event) {
  var href = $(event.target).closest('a').attr('href');

  if ($('.navbar-toggler:visible').length !== 0) {
    $(this).find('#menuList').slideToggle();

    if (href && href.indexOf('/') != -1) {
      $('html').toggleClass('show-menu');
    }
  }
});

$('body').on('click', 'a', (event) => {
  const href = event.currentTarget.getAttribute('href');

  if (href === (window.location.pathname + window.location.search || '')) {
    // if (href && href.startsWith(window.location.pathname)) {
    // if (href == window.location.pathname) {
    window.location.reload();
    return;
  }

  if (href == '#') {
    event.preventDefault();
    return false;
  }

  //process click on menu item
  if (href && href.startsWith('#')) {
    let $target = $(event.currentTarget);
    let $leftMenu = $(' .pages-left-menu');
    if (!$leftMenu.length)
      return true;

    let $activeItem = $target.closest('li');
    let $menuItems = $activeItem.siblings();
    $menuItems.each((_, elem) => $(elem).removeClass('active'));
    $activeItem.addClass('active');
    return true;
  }

  if (!href ||
    href.startsWith('http') ||
    href.startsWith('ftp') ||
    href.startsWith('javascript:') ||
    event.currentTarget.getAttribute('target')) {
    return;
  }

  if (href.startsWith('mailto:')) {
    event.preventDefault();
    window.location = href;
    return false;
  }

  event.preventDefault();
  // If we already have that url in cache - we will just update browser location
  // and set cache version of the page
  // overise we will trigger app router function
  var url = href;

  // Clear page
  // $('#content').undelegate();
  // $('form').undelegate();
  // $('.popover').remove();
  //
  // $('.modal-backdrop').remove();
  // $('.modal-open').removeClass('modal-open');

  if (app.cache.hasOwnProperty(url) == false) {
    //fix for comments
    //when content is scrolled to one comment there user should be available scroll to other comment via direct link
    if (url.indexOf('#comment') >= 0) {
      const hashIdx = url.indexOf('#');
      const randomQueryIdx = url.indexOf('?r=');
      const r = ('?r=' + Math.random());
      url = (randomQueryIdx >= 0)
        ? url.substring(0, randomQueryIdx) + r + url.substring(hashIdx)
        : url.substring(0, hashIdx) + r + url.substring(hashIdx);
    }
    app.routers.navigate(
      url, {trigger: true, replace: false}
    );
  } else {
    $('#content').html(app.cache[url]);
    app.routers.navigate(
      url, {trigger: false, replace: false}
    );
  }
});

$('#page').on('click', '.showVideoModal', (e) => app.helpers.video.showVideoModal(e));

$('#scroll-to-top').on('click', e => $('body').scrollTo(0, 350));
