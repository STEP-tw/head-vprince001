const {
  readFile,
  addHeading,
  isFileExists,
  reverseString
} = require("../util_lib/util.js");

const {
  getTailIllegalOffsetMsg,
  getHeadIllegalCountMsg,
  getNoFileErrorMsg
} = require("./error_handler.js");

const tail = function(userInput, fs) {
  let classifiedDetails = classifyDetails(userInput);

  if (isNaN(classifiedDetails.numberOfLines)) {
    return getTailIllegalOffsetMsg(classifiedDetails.numberOfLines);
  }

  numberOfLines = Math.abs(classifiedDetails.numberOfLines);
  classifiedDetails.numberOfLines = numberOfLines;
  let output = runCommand(classifiedDetails, fs, "tail");
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

const runCommand = function(classifiedDetails, fs, commandType) {
  let { type, numberOfLines, fileNames } = classifiedDetails;
  let desiredContent = [];
  let newLine = "";

  fileNames.forEach(fileName => {
    let fileStatus = isFileExists(fs, fileName);

    if (!fileStatus) {
      return getNoFileErrorMsg(commandType, fileName);
    }

    if (fileNames.length > 1) {
      desiredContent.push(newLine + addHeading(fileName));
    }
    newLine = "\n";

    let data = readFile(fs, fileName);

    if (commandType == "tail") {
      data = reverseString(data);
    }

    desiredContent.push(data);
    if (fileStatus) {
      desiredContent.pop();
      desiredContent.push(getFileData(data, numberOfLines, type));

      if (commandType == "tail") {
        desiredContent.pop();
        desiredContent.push(
          reverseString(getFileData(data, numberOfLines, type))
        );
      }
    }
  });

  return desiredContent;
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

const classifyDetails = function(userInput) {
  if (userInput[0][0] == "-") {
    return getHeadParameters(userInput);
  }
  return {
    type: "n",
    numberOfLines: 10,
    fileNames: userInput
  };
};

const head = function(userInput, fs) {
  let classifiedDetails = classifyDetails(userInput);

  if (
    classifiedDetails.numberOfLines < 1 ||
    isNaN(classifiedDetails.numberOfLines)
  ) {
    return getHeadIllegalCountMsg(
      classifiedDetails.type,
      classifiedDetails.numberOfLines
    );
  }

  let output = runCommand(classifiedDetails, fs, "head");
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
