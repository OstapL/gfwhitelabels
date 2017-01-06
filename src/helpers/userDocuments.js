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
  getUserDocumentsByName(userId, objectId, docName) {
    const type = typeOfDocuments[docName];
    return global.esignServer + `/pdf-doc/investors/${userId}/${objectId}/${type}`;
  },
  getUserDocumentsByType(userId, objectId, type) {
    // const type = documentTypes[type];
    return global.esignServer + `/pdf-doc/investors/${userId}/${objectId}/${type}`;
  },
};