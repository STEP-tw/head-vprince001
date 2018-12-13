const {
  tail
} = require("./src/lib.js");

const fs = require("fs");

const main = function(usrInput, readFile) {
  console.log(tail(usrInput, readFile));
};

main(process.argv.slice(2), fs);