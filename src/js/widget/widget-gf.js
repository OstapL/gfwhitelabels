function widgetsElement() {
  //document.body.onload = widgetsElement;
  var headID = document.getElementsByTagName('head')[0];
    // link to css
    var linkCss = document.createElement('link');
    linkCss.type = 'text/css';
    linkCss.rel = 'stylesheet';
    linkCss.href = 'https://alpha.growthfountain.com/js/widget/widget-gf.css';
    headID.appendChild(linkCss);

  var widget = document.querySelector("#gf__widget_invest");
  var widgetShow = document.querySelectorAll('#gf__widget_show');
  //document.querySelector('.content-widgets').innerHTML += "<a href='#' class='btn-widget-gf'> invest now</a>";

  setTimeout(function() {
    widget.style.visibility = "visible";
    widget.style.opacity = 1;
    widget.style.transition = "opacity 1s ease";
  }, 4000);

  function hide(event) {
    event.stopPropagation();
    widget.style.visibility = "hidden";
    widget.style.opacity = 0;
    widget.style.transition = "opacity 0.5s ease";
  };
  function show(event) {
    event.stopPropagation();
    widget.style.visibility = "visible";
    widget.style.opacity = 1;
    widget.style.transition = "opacity 0.5s ease";
  };
  document.querySelector('#gFcloseWidget').addEventListener('click', hide);
  if (widgetShow.length != 0) {
    document.querySelector('#gf__widget_show').addEventListener('click', show);
  };
}