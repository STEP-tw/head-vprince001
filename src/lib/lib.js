const head = function(usrInput, fs) {
  let { type, numberOfLines, fileNames } = classifyDetails(usrInput);

  if (numberOfLines < 1 || isNaN(numberOfLines)) {
    return getIllegalCountErrorHead(type, numberOfLines);
  }

  let output = runHead(type, numberOfLines, fileNames, fs);
  return output.join("\n");
};

const getIllegalCountErrorHead = function(type, numberOfLines) {
  let property = "line";
  if (type == "c") {
    property = "byte";
  }
  return "head: illegal " + property + " count -- " + numberOfLines;
};

const runHead = function(type, numberOfLines, fileNames, fs) {
  let output = [];
  let newLine = "";

  for (let count = 0; count < fileNames.length; count++) {
    let fileStatus = isFileExists(fs, fileNames[count]);

    if (fileNames.length > 1 && fileStatus) {
      output.push(newLine + addHeading(fileNames[count]));
    }
    newLine = "\n";

    let data = readFile(fs, fileNames[count]);
    output.push(data);
    if (fileStatus) {
      output.pop();
      output.push(getFileData(data, numberOfLines, type));
    }
  }
  return output;
};

const tail = function(usrInput, fs) {
  let { type, numberOfLines, fileNames } = classifyDetails(usrInput);

  if (isNaN(numberOfLines)) {
    return "tail: illegal offset -- " + numberOfLines;
  }

  numberOfLines = Math.abs(numberOfLines);
  let output = runTail(type, numberOfLines, fileNames, fs);
  return output.join("\n");
};

const runTail = function(type, numberOfLines, fileNames, fs) {
  let output = [];
  let newLine = "";

  for (let count = 0; count < fileNames.length; count++) {
    let fileStatus = isFileExists(fs, fileNames[count]);

    if (fileNames.length > 1 && fileStatus) {
      output.push(newLine + addHeading(fileNames[count]));
    }
    newLine = "\n";
    let data = reverseData(readFile(fs, fileNames[count]));
    if (!fileStatus) {
      data = showFileNotFoundError(fileNames[count]);
    }

    output.push(data);
    if (fileStatus) {
      output.pop();
      output.push(reverseData(getFileData(data, numberOfLines, type)));
    }
  }
  return output;
};

const reverseData = function(data) {
  return data
    .split("")
    .reverse()
    .join("");
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

const isFileExists = function(fs, fileName) {
  return fs.existsSync(fileName);
};

const addHeading = function(head) {
  return "==> " + head + " <==";
};

const readFile = function(fs, fileName) {
  if (isFileExists(fs, fileName)) {
    return fs.readFileSync(fileName, "utf-8").trim();
  }
  return "head: " + fileName + ": No such file or directory";
};

const showFileNotFoundError = function(fileName) {
  return "tail: " + fileName + ": No such file or directory";
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

module.exports = {
  head,
  getIllegalCountErrorHead,
  runHead,
  tail,
  runTail,
  reverseData,
  classifyDetails,
  getFileData,
  addHeading,
  isFileExists,
  getHeadParameters,
  readFile,
  showFileNotFoundError
};
