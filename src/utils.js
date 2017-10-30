let _uniqCounter = 0;

module.exports = {
  uniqueId(prefix) {
    const id = ++_uniqCounter + '';
    return prefix 
      ? prefix + id
      : id;
  },
  isNull(val) {
    return val === null;
  },
  isUndefined(val) {
    return typeof(val) === 'undefined';
  },
  isBoolean(val) {
    return val == 0 || val == 1 || val == true || val == false;
  },
  isString(val) {
    return typeof(val) === 'string';
  },
  isNumber(val) {
    return typeof(val) === 'number';
  },
  last(arr) {
    if (!Array.isArray(arr) || !arr || !arr.length)
      return void 0;

    return arr[arr.length - 1];
  },
  isEmpty(obj) {
    if (!obj)
      return true;

    if (Array.isArray(obj))
      return !obj.length;
    
    return !Object.keys(obj).length;
  },
  pick(obj, props) {
    const res = {};
    if (typeof(obj) !== 'object' || !Array.isArray(props))
      return res;

    props.forEach((prop) => {
      if (typeof(prop) !== 'string' || !prop || !(prop in obj))
        return;
      
      res[prop] = obj[prop];
    });

    return res;
  },
  omit(obj, props) {
    const res = {};
    if (typeof(obj) !== 'object' || !obj || !Array.isArray(props) || !props.length)
      return res;

    Object.keys(obj).forEach((key) => {
      if (!props.includes(key))
        res[key] = obj[key];
    });

    return res;
  },
  openPdfPreview(url) {
    let form = document.getElementById('pdfPreviewForm');

    if (form === null) {
      form = document.createElement('form');
      form.setAttribute('id', 'pdfPreviewForm');

      form.setAttribute('target', '_blank');
      form.method = 'POST';
      form.style.height = 0;
      form.style.width = 0;
      form.style.display = 'none';

      let jwtInput = document.createElement('input');
      jwtInput.setAttribute('name', 'token');
      jwtInput.value = app.user.token;
      form.appendChild(jwtInput);
      document.body.appendChild(form);
    }

    form.action = app.config.esignServer + url;
    form.submit();
  },
  base64Encode(str) {
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "", i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
  },
};
