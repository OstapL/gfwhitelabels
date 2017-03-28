const typeOfDocuments = require('consts/typeOfDocuments.json');
const documentTypes = (() => {
  var res = {};
  for (let key in typeOfDocuments) {
    let val = typeOfDocuments[key];
    res[val] = key;
  }
  return res;
})();

module.exports = {
  getUserDocumentsByName(objectId, docName) {
    const type = typeOfDocuments[docName];
    return `${app.config.esignServer}/pdf-doc/investors/${objectId}/${type}`;
  },
  getUserDocumentsByType(objectId, type) {
    // const type = documentTypes[type];
    return `${app.config.esignServer}/pdf-doc/investors/${objectId}/${type}`;
  },
};