const classifyDetails = function(usrInput) { 
  if(usrInput.length == 0) {
    return [];
  }
  let fileName = retrieveFileNames(usrInput);
  let numberOfLines = getNumOfLines(retrieveTypeAndLength(usrInput));
  let type = extractType(retrieveTypeAndLength(usrInput));
  return [fileName, numberOfLines, type];
};

const retrieveTypeAndLength = (x=>x.filter(file => !file.includes('.')));

const retrieveFileNames = (x=>x.filter(file => file.includes('.')));

const extractType = function(input) {
  input = input.join('');
  if(input.includes('-c')) { return 'c';}
  return 'n';
}

const getNumOfLines = function(args) {
  let string = args.join('');
  let index=0;
  while(!parseInt(string) && index < args.join('').length) {
    index++;
    string = args.join('');
    string = string.slice(index);
  }
  return Math.abs(parseInt(string));
}

const getFileData = function(data, length=10, type='n') {
  if(type == 'n') {
    return data.split('\n').slice(0,length).join('\n');
  }
  return data.split('').slice(0,length).join('');
};

module.exports = { classifyDetails, getFileData };
