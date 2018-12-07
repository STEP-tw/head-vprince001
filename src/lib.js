const head = function(usrInput, fs) {
  let output = [];
  let newLine = "";
  let {type, numberOfLines, fileNames} = classifyDetails(usrInput);

  if(numberOfLines < 1 || isNaN(numberOfLines)) {
    let property = "line";
    if(type == "c") { property = "byte"; };
    return "head: illegal " + property + " count -- " + numberOfLines;
  }

  for(let count=0; count<fileNames.length; count++) {
    let fileStatus = isFileExists(fs, fileNames[count]); 
    if(fileNames.length > 1 && fileStatus) {
      output.push( newLine + addHeading(fileNames[count]) );
    }
    newLine = "\n";

    let data = readFile(fs, fileNames[count]);
    output.push(data);
    if(fileStatus){
      output.pop();
      output.push(getFileData(data, numberOfLines, type));
    }
  }
  return output.join('\n');
};

const isFileExists = function(fs, fileName) {
  return fs.existsSync(fileName);
};


const readFile = function(fs, fileName){
  if(isFileExists(fs, fileName)) {
    return fs.readFileSync(fileName,'utf-8').trim();
  }
  return "head: "+ fileName +": No such file or directory";
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
  addHeading, getNumOfLines,
  isFileExists, getHeadParameters
};
