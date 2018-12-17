const { tail } = require("./src/lib/lib.js");

const fs = require("fs");

const main = function() {
  let userInput = process.argv.slice(2);
  console.log(tail(userInput, fs));
};

main();
