const getHeadIllegalCountMsg = function(type, count) {
  let property = "line";
  if (type == "c") {
    property = "byte";
  }
  return "head: illegal " + property + " count -- " + count;
};

const getTailIllegalOffsetMsg = function(count) {
  return "tail: illegal offset -- " + count;
};

const getNoFileErrorMsg = function(commandType, fileName) {
  return commandType + ": " + fileName + ": No such file or directory";
};

module.exports = {
  getHeadIllegalCountMsg,
  getTailIllegalOffsetMsg,
  getNoFileErrorMsg
};
