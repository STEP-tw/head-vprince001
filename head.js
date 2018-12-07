const {
  classifyDetails,
  getFileData,
  addHeading,
  head
} = require("./src/lib.js");

const fs = require("fs");

const main = function(usrInput, readFile) {
  console.log(head(usrInput, readFile));
};

main(process.argv.slice(2), fs);
