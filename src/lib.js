const head = function(usrInput, fs) {
  let output = "";
  let newLine = "";
  let {type, numberOfLines, fileNames} = classifyDetails(usrInput);

  if(numberOfLines < 1 || isNaN(numberOfLines)) {
    return "head: illegal line count -- " + numberOfLines;
  }

  for(let count=0; count<fileNames.length; count++) {
    if(fileNames.length > 1) {
      output += newLine + addHeading(fileNames[count]) + "\n";
      newLine = "\n";
    }
    output += (getFileData(readFile(fs, fileNames[count]), numberOfLines, type));
    output += newLine;
  }
  return output;
};

const readFile = function(fs, file){
  if(fs.existsSync(file)){
    return fs.readFileSync(file,'utf-8');
  }
  return "head: "+ file +": No such file or directory";
}

const classifyDetails = function(usrInput) { 
  if(usrInput[0][0] == '-') {
    return getHeadParameters(usrInput);
  }
  return {
    type : 'n', numberOfLines : 10, fileNames : usrInput
  };
};

const getHeadParameters = function(headParameters){
  if(headParameters[0] == '-n' || headParameters[0] == '-c'){
    return {
      type : headParameters[0][1], numberOfLines : headParameters[1], fileNames : headParameters.slice(2)
    };
  }

  if(!isNaN(Math.abs(headParameters[0]))){
    return {
      type : 'n', numberOfLines : Math.abs(headParameters[0]), fileNames : headParameters.slice(1)
    };
  }

  return {
    type : headParameters[0][1], numberOfLines : headParameters[0].slice(2), fileNames : headParameters.slice(1)
  };
};

const extractType = function(input) {
  input = input.join('');
  if(input.includes('-c')) { return 'c';}
  return 'n';
};

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

const retrieveFileNames = (x=>x.filter(file => file));

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
  addHeading, getNumOfLines
};
