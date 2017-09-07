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
      return false;

    if (Array.isArray(obj))
      return !!obj.length;
    
    return !!Object.keys(obj).length;
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
};