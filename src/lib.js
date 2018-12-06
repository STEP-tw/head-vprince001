const head = function(usrInput, readFile) {
  let output = "";
  let newLine = "";
  let details = classifyDetails(usrInput);
  let fileNames = details[0];

  for(let count=0; count<fileNames.length; count++) {
    if(fileNames.length > 1) {
      output += newLine + addHeading(fileNames[count]);
      newLine = "\n";
    }
    output += (getFileData(readFile(fileNames[count],'utf8'), details[1], details[2]));
    output += newLine;
  }
  return output;
};

const classifyDetails = function(usrInput) { 
  if(usrInput.length == 0) {
    return [];
  }
  let type = extractType(retrieveTypeAndLength(usrInput));
  let numberOfLines = getNumOfLines(retrieveTypeAndLength(usrInput));
  let fileName = retrieveFileNames(usrInput);
  return [fileName, numberOfLines, type];
};

const extractType = function(input) {
  input = input.join('');
  if(input.includes('-c')) { return 'c';}
  return 'n';
};

const retrieveTypeAndLength = (x=>x.filter(file => !file.includes('.')));

const getNumOfLines = function(args) {
  let string = args.join('');
  let index=0;
  while(!parseInt(string) && index < args.join('').length) {
    index++;
    string = args.join('');
    string = string.slice(index);
  }
  return Math.abs(parseInt(string)) || 10;
};

const retrieveFileNames = (x=>x.filter(file => file.includes('.')));

const getFileData = function(data, length=10, type='n') {
  if(type == 'n') {
    return data.split('\n').slice(0,length).join('\n');
  }
  return data.split('').slice(0,length).join('');
};

const addHeading = function(head) {
  return "==> "+head+" <==";
};

module.exports = {
  classifyDetails, getFileData, head,
  retrieveTypeAndLength, addHeading,
  getNumOfLines
};
