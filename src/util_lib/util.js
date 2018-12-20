const readFile = function(fs, fileName) {
  return fs.readFileSync(fileName, "utf-8").trim();
};

const addHeading = function(head) {
  return "==> " + head + " <==";
};

const isFileExists = function(fs, fileName) {
  return fs.existsSync(fileName);
};

const reverseString = function(data) {
  return data
    .split("")
    .reverse()
    .join("");
};

module.exports = {
  isFileExists,
  addHeading,
  readFile,
  reverseString
};
