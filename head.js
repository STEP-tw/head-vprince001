const {
  classifyDetails,
  getFileData
  } = require('./src/lib.js');

const fs = require('fs');

const head = function(usrInput) {
  let content = [];

  let details = classifyDetails(usrInput);
  let file = details[0];

  for(let count=0; count<file.length; count++) {
    if(file.length > 1) {
      console.log("==>"+file[count]+"<==");
    }
    console.log(getFileData(fs.readFileSync(file[count],'utf8'), details[1], details[2]));
  }
}
head(process.argv.slice(2));
