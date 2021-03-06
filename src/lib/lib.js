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

  if (isNaN(classifiedDetails.count)) {
    return getTailIllegalOffsetMsg(classifiedDetails.count);
  }

  count = Math.abs(classifiedDetails.count);
  classifiedDetails.count = count;
  let output = runCommand(classifiedDetails, fs, "tail");
  //return output.join("\n");
  return output;
};

const getFileData = function(data, length = 10, type = "n") {
  if (type == "c") {
    return data
      .split("")
      .slice(0, length)
      .join("");
  }
  return data
    .split("\n")
    .slice(0, length)
    .join("\n");
};

const runCommand = function(classifiedDetails, fs, commandType) {
  const { type, count, fileNames } = classifiedDetails;
  let desiredContent = [];
  let newLine = "";

  for (let index = 0; index < fileNames.length; index++) {
    let fileStatus = isFileExists(fs, fileNames[index]);

    if (!fileStatus) {
      return getNoFileErrorMsg(commandType, fileNames[index]);
    }

    if (fileNames.length > 1) {
      desiredContent.push(newLine + addHeading(fileNames[index]));
    }
    newLine = "\n";

    let data = readFile(fs, fileNames[index]);

    if (commandType == "tail") {
      data = reverseString(data);
    }

    desiredContent.push(getFileData(data, count, type));

    if (commandType == "tail") {
      desiredContent.pop();
      desiredContent.push(reverseString(getFileData(data, count, type)));
    }
  }
  return desiredContent;
};

const getHeadParameters = function(headParameters) {
  if (headParameters[0] == "-n" || headParameters[0] == "-c") {
    return {
      type: headParameters[0][1],
      count: headParameters[1],
      fileNames: headParameters.slice(2)
    };
  }

  if (!isNaN(Math.abs(headParameters[0]))) {
    return {
      type: "n",
      count: Math.abs(headParameters[0]),
      fileNames: headParameters.slice(1)
    };
  }

  return {
    type: headParameters[0][1],
    count: headParameters[0].slice(2),
    fileNames: headParameters.slice(1)
  };
};

const classifyDetails = function(userInput) {
  if (userInput[0][0] == "-") {
    return getHeadParameters(userInput);
  }
  return {
    type: "n",
    count: 10,
    fileNames: userInput
  };
};

const head = function(userInput, fs) {
  let classifiedDetails = classifyDetails(userInput);

  if (classifiedDetails.count < 1 || isNaN(classifiedDetails.count)) {
    return getHeadIllegalCountMsg(
      classifiedDetails.type,
      classifiedDetails.count
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
