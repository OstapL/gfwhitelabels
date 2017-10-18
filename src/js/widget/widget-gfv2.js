function widgetsElement(options) {
  
  var styleNode = document.createElement('style');
  styleNode.type = "text/css";
  var styleCode = '@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);.gf__widget_v1 #gf__widget_invest,.gf__widget_v1 #gf__widget_show{background-color:#fff;border-top:1px solid #3cbdb9;border-bottom:1px solid #3cbdb9;-webkit-transition:opacity 1s;-webkit-box-shadow:0 0 2px 0 rgba(0,0,0,.5);-moz-box-shadow:0 0 2px 0 rgba(0,0,0,.5)}#gf__widget,#gf__widget.gf__widget_v2,.gf__all_widget_wrap h3{font-family:Open Sans,sans-serif}#gf__widget{position:fixed;right:0;bottom:15px;z-index:998}.gf__widget_v1 #gf__widget_invest{width:390px;height:215px;border-radius:3px;border-left:7px solid #3cbdb9;z-index:2;position:relative;opacity:0;transition:opacity 1s ease;box-shadow:0 0 2px 0 rgba(0,0,0,.5);visibility:hidden}@media (max-width:576px){#gf__widget.gf__widget_v1{bottom:1px}.gf__widget_v1 #gf__widget_show{bottom:159px!important}}@media (max-width:360px){.gf__widget_v1 #gf__widget_invest{width:320px}}.gf__widget_v1 #gf__widget_show{position:fixed;bottom:173px;right:0;z-index:1;width:55px;height:55px;border-left:5px solid #3cbdb9;text-align:center;transition:opacity 1s;cursor:pointer;box-shadow:0 0 2px 0 rgba(0,0,0,.5)}.gf__widget_v1 #gf__widget_show:hover{cursor:pointer}.gf__widget_v1 #gf__widget_show img{width:30px;margin:18px auto auto}#gf__widget_invest .gf__close_widget{float:right;color:#777;font-size:20px;position:absolute;right:15px;top:10px;font-weight:700; text-decoration: none}#gf__widget_invest .gf__close_widget:hover{color:#949494}.gf__widget_v1 .gf__widget_header{padding:15px}#gf__widget_invest .gf__all_widget_wrap{text-align:center}#gf__widget .gf__all_widget_wrap .gf__btn_widget{padding:15px 35px;color:#fff;font-size:13px;background-color:#39b2af;text-decoration:none;text-transform:uppercase;border-radius:30px;letter-spacing:1.3px;cursor:pointer;font-weight:700;-webkit-box-shadow:0 0 2px 0 rgba(0,0,0,.5);-moz-box-shadow:0 0 2px 0 rgba(0,0,0,.5);box-shadow:0 0 2px 0 rgba(0,0,0,.5)}.gf__all_widget_wrap h3{font-size:18px;margin-top:0;margin-bottom:0;font-weight:300}.gf__all_widget_wrap .gf__company_name{font-weight:700;font-family:Open Sans,sans-serif}.gf__all_widget_wrap img{width:190px;text-align:center;margin:20px auto 30px;display:block}#gf__widget.gf__widget_v2{position:fixed;right:15px;bottom:15px}.gf__widget_v2 .gf_widget_wrap{width:324px;height:186px;background-image:url(https://alpha.growthfountain.com/staticdata/img/generals/gbi-widget.png);background-repeat:no-repeat;-webkit-transition:opacity 1s;transition:opacity 1s;opacity:0}@media (max-width:360px){.gf__widget_v2 .gf_widget_wrap{width:300px;background-size:100%;background-position:center center}#gf__widget.gf__widget_v2{bottom:15px}.gf__widget_v2 .gf__content_widgets{max-width:248px!important}}.gf__widget_v2 .gf__widget_header{padding-top:25px;padding-left:25px;padding-right:25px}.gf__widget_v2 .gf__widget_header .gf__close_widget{float:right;color:#777;font-size:20px;right:25px!important;top:15px!important;font-weight:700}.gf__widget_v2 .gf__content_widgets{max-width:268px;margin:0 auto;text-align:left}.gf__widget_v2 .gf__content_widgets p{color:#747474;font-size:15px;line-height:22px;margin-top:10px}.gf__widget_v2 h3{display:inline-block;font-weight:700;vertical-align:middle;margin-top:0;margin-bottom:0}.gf__widget_v2 .gf__img_wrap{width:34px;height:34px;display:inline-block;vertical-align:middle;border-radius:100px;-webkit-box-shadow:0 0 2px 0 rgba(0,0,0,.4);-moz-box-shadow:0 0 2px 0 rgba(0,0,0,.4);box-shadow:0 0 2px 0 rgba(0,0,0,.4);background-color:#fff;position:relative;margin-right:10px}.gf__widget_v2 .gf__img_wrap img{width:23px;margin:0;transform:translate(-50%,-50%);top:50%;left:50%;position:absolute}.gf__widget_v2 .gf__btn_widget{padding:15px 35px;color:#fff;font-size:13px;background-color:#39b2af;text-decoration:none;text-transform:uppercase;border-radius:30px;letter-spacing:1.3px;float:right;margin-top:10px;font-weight:700;-webkit-box-shadow:0 0 2px 0 rgba(0,0,0,.5);-moz-box-shadow:0 0 2px 0 rgba(0,0,0,.5);box-shadow:0 0 2px 0 rgba(0,0,0,.5)}'
  if(!!(window.attachEvent && !window.opera)) {
    styleNode.styleSheet.cssText = styleCode;
  } else {
    var styleText = document.createTextNode(styleCode);
    styleNode.appendChild(styleText);
  }
  document.getElementsByTagName('head')[0].appendChild(styleNode);

  var widget = document.querySelector("#gf__widget_invest");
  var widgetShow = document.querySelectorAll('#gf__widget_show');
  var buttonStyle = document.querySelector('.gf__btn_widget');

  buttonStyle.style.background = options.buttonBackground || 'rgb(60, 189, 185)';
  buttonStyle.style.color = options.buttonColor || '#fff';
  buttonStyle.style.padding = options.buttonPadding || '12px 33px';
  buttonStyle.style.borderRadius = options.buttonRadius || '50px';
  widget.style.borderColor = options.borderColors || 'rgb(60, 189, 185)';
  
  setTimeout(function() {
    widget.style.visibility = "visible";
    widget.style.opacity = 1;
  }, options.timeOut || 4000);

  function hide(event) {
    event.stopPropagation();
    event.preventDefault()
    widget.style.visibility = "hidden";
    widget.style.opacity = 0;
  };
  function show(event) {
    event.stopPropagation();
    event.preventDefault()
    widget.style.visibility = "visible";
    widget.style.opacity = 1;
  };
  document.querySelector('#gFcloseWidget').addEventListener('click', hide);
  if (widgetShow.length != 0) {
    document.querySelector('#gf__widget_show').addEventListener('click', show);
    document.querySelector('#gf__widget_show').style.borderColor = options.borderColors || 'rgb(60, 189, 185)';
  };
}