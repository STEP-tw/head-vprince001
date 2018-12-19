const {
  readFile,
  addHeading,
  isFileExists,
  reverseData
} = require("../util_lib/util.js");

const {
  getTailIllegalOffsetMsg,
  getHeadIllegalCountMsg,
  getNoFileErrorMsg
} = require("./error_handler.js");

const tail = function(usrInput, fs) {
  let { type, numberOfLines, fileNames } = classifyDetails(usrInput);

  if (isNaN(numberOfLines)) {
    return getTailIllegalOffsetMsg(numberOfLines);
  }

  numberOfLines = Math.abs(numberOfLines);
  let commandType = "tail";
  let output = runCommand(type, numberOfLines, fileNames, fs, commandType);
  return output.join("\n");
};

const getFileData = function(data, length = 10, type = "n") {
  if (type == "n") {
    return data
      .split("\n")
      .slice(0, length)
      .join("\n");
  }
  return data
    .split("")
    .slice(0, length)
    .join("");
};

const runCommand = function(type, numberOfLines, fileNames, fs, commandType) {
  let output = [];
  let newLine = "";

  fileNames.forEach(fileName => {
    let fileStatus = isFileExists(fs, fileName);

    if (fileNames.length > 1 && fileStatus) {
      output.push(newLine + addHeading(fileName));
    }
    newLine = "\n";

    let data = readFile(fs, fileName);

    if (commandType == "tail") {
      data = reverseData(data);
    }

    if (!fileStatus) {
      data = getNoFileErrorMsg(commandType, fileName);
    }

    output.push(data);
    if (fileStatus) {
      output.pop();
      if (commandType == "head") {
        output.push(getFileData(data, numberOfLines, type));
      } else {
        output.push(reverseData(getFileData(data, numberOfLines, type)));
      }
    }
  });

  return output;
};

const getHeadParameters = function(headParameters) {
  if (headParameters[0] == "-n" || headParameters[0] == "-c") {
    return {
      type: headParameters[0][1],
      numberOfLines: headParameters[1],
      fileNames: headParameters.slice(2)
    };
  }

  if (!isNaN(Math.abs(headParameters[0]))) {
    return {
      type: "n",
      numberOfLines: Math.abs(headParameters[0]),
      fileNames: headParameters.slice(1)
    };
  }

  return {
    type: headParameters[0][1],
    numberOfLines: headParameters[0].slice(2),
    fileNames: headParameters.slice(1)
  };
};

const classifyDetails = function(usrInput) {
  if (usrInput[0][0] == "-") {
    return getHeadParameters(usrInput);
  }
  return {
    type: "n",
    numberOfLines: 10,
    fileNames: usrInput
  };
};

const head = function(usrInput, fs) {
  let { type, numberOfLines, fileNames } = classifyDetails(usrInput);

  if (numberOfLines < 1 || isNaN(numberOfLines)) {
    return getHeadIllegalCountMsg(type, numberOfLines);
  }

  let commandType = "head";
  let output = runCommand(type, numberOfLines, fileNames, fs, commandType);
  return output.join("\n");
};

module.exports = {
  tail,
  getFileData,
  runCommand,
  getHeadParameters,
  classifyDetails,
  head
};
