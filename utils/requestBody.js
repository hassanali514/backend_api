function checkMissingAttributes(requestBody, attributes) {
    for (let i = 0; i < attributes.length; i++) {
      if (requestBody[attributes[i]] == undefined) return attributes[i];
    }
    return null;
}
  
function checkEmptyAttributes(requestBody, attributes) {
    for (let i = 0; i < attributes.length; i++) {
      if (requestBody[attributes[i]] === '') {
        return attributes[i];
      }
    }
    return null;
}

module.exports.checkMissingAttributes = checkMissingAttributes;
module.exports.checkEmptyAttributes = checkEmptyAttributes;