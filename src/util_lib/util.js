const readFile = function(fs, fileName) {
  if (isFileExists(fs, fileName)) {
    return fs.readFileSync(fileName, "utf-8").trim();
  }
  return "head: " + fileName + ": No such file or directory";
};

const addHeading = function(head) {
  return "==> " + head + " <==";
};

const isFileExists = function(fs, fileName) {
  return fs.existsSync(fileName);
};

const reverseData = function(data) {
  return data
    .split("")
    .reverse()
    .join("");
};

module.exports = {
  isFileExists,
  addHeading,
  readFile,
  reverseData
};
