const getHeadIllegalCountMsg = function(type, numberOfLines) {
  let property = "line";
  if (type == "c") {
    property = "byte";
  }
  return "head: illegal " + property + " count -- " + numberOfLines;
};

const getTailIllegalOffsetMsg = function(numberOfLines) {
  return "tail: illegal offset -- " + numberOfLines;
};

const getNoFileErrorMsg = function(commandType, fileName) {
  return commandType + ": " + fileName + ": No such file or directory";
};

module.exports = {
  getHeadIllegalCountMsg,
  getTailIllegalOffsetMsg,
  getNoFileErrorMsg
};
