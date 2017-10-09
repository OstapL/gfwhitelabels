function widgetsElement() {
  //document.body.onload = widgetsElement;
  var headID = document.getElementsByTagName('head')[0];
    // link to css
    var linkCss = document.createElement('link');
    linkCss.type = 'text/css';
    linkCss.rel = 'stylesheet';
    linkCss.href = 'widget.css';
    headID.appendChild(linkCss);

  var widget = document.querySelector("#gf__widget_invest");
  var widgetShow = document.querySelector('#gf__widget_show');

  setTimeout(function() {
    widget.style.display = 'block';
    widgetShow.style.display = 'block';
  }, 3000);

  function hide(event) {
    event.stopPropagation();
    widget.style.display = 'none';
  };
  function show(event) {
    event.stopPropagation();
    widget.style.display = 'block';
  };
  document.querySelector('#gFcloseWidget').addEventListener('click', hide);
  document.querySelector('#gf__widget_show').addEventListener('click', show);
}