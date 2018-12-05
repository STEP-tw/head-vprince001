const retrieveFileNames = (x=>x.filter(file => file.includes('.')));

const retrieveTypeAndLength = (x=>x.filter(file => !file.includes('.')));

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

const classifyDetails = function(usrInput) { 
  let fileName = retrieveFileNames(usrInput);
  let numberOfLines = getNumOfLines(retrieveTypeAndLength(usrInput));
  let type = extractType(retrieveTypeAndLength(usrInput));
  return [fileName, numberOfLines, type];
};

const getFileData = function(data, type='n', length=10) {
  if(type == 'n') {
    return data.split('\n').slice(0,length).join('\n');
  }
  return data.split('').slice(0,length).join('');
};

module.exports = { classifyDetails, getFileData };
