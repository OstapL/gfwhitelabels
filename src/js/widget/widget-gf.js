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
    widget.style.display = 'block';
  }, 5000);

  function hide(event) {
    event.stopPropagation();
    widget.style.display = 'none';
  };
  function show(event) {
    event.stopPropagation();
    widget.style.display = 'block';
  };
  document.querySelector('#gFcloseWidget').addEventListener('click', hide);
  if (widgetShow.length != 0) {
    document.querySelector('#gf__widget_show').addEventListener('click', show);
  };
}