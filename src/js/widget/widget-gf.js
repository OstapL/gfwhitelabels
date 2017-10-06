function widgetsElement() {
  var headID = document.getElementsByTagName('head')[0];
    // link to css
    var linkCss = document.createElement('link');
    linkCss.type = 'text/css';
    linkCss.rel = 'stylesheet';
    linkCss.href = 'https://alpha.growthfountain.com/js/widget/widget-gf.css';
    headID.appendChild(linkCss);

  var widget = document.querySelector("#widget-gf");
  setTimeout(function() {
    widget.style.display = 'block';
  }, 4000);

  function hide(event) {
    event.stopPropagation();
    widget.style.display = 'none';
  };
  document.querySelector('#close-widget').addEventListener('click', hide);
}