module.exports = {
  format: require('./helpers/formatHelper.js'),
  phone: require('./helpers/phoneHelper.js'),
  section: require('./helpers/addSectionHelper.js'),
  calculator: require('./helpers/calculatorHelpers.js'),
  calculatorValidation: require('./helpers/calculatorValidationHelper.js'),
  capitalraiseData: require('./helpers/capitalraiseCalculatorData.js'),
  date: require('./helpers/dateHelper.js'),
  disableEnter: require('./helpers/disableEnterHelper.js'),
  errorPage: require('./helpers/errorPageHelper.js'),
  fileList: require('./helpers/fileList.js'),
  location: require('./helpers/getCityStateByZipCode.js'),
  icons: require('./helpers/iconsHelper.js'),
  confirmOnLeave: require('./helpers/leavingConfirmationHelper.js'),
  menu: require('./helpers/menuHelper.js'),
  role: require('./helpers/roleHelper.js'),
  text: require('./helpers/textHelper.js'),
  userDocuments: require('./helpers/userDocuments.js'),
  yesNo: require('./helpers/yesNoHelper.js'),
  usaStates: require('./helpers/usaStates.js'),
  social: require('./helpers/socialLinks.js'),
  scripts: require('./helpers/scriptLoader.js'),
  video: require('./helpers/playVideo.js'),
  previewPdf: Backbone.View.extend({
    el: 'body',
    initialize(slug, rawData) {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE workaround
        var byteCharacters = atob(app.utils.base64Encode(rawData));
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {type: 'application/pdf'});
        window.navigator.msSaveOrOpenBlob(blob, slug + ' esignature.pdf');
      } else {
        const iframe = document.createElement('iframe');
        document.title = slug + ' esignature';
        document.body.appendChild(iframe);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        iframe.setAttribute("height", "100%");
        iframe.setAttribute("width", "100%");
        iframe.setAttribute("type", "application/pdf");
        iframe.setAttribute('style', "position: fixed; display:block; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999; overflow-y: auto; -webkit-overflow-scrolling:touch;");
        iframe.setAttribute('src', "data:application/pdf;base64," + app.utils.base64Encode(rawData));
      }
      app.hideLoader();
    }
  }),
};
