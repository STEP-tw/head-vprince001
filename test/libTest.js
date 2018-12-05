const {equal, deepEqual} = require('assert');

const { 
  classifyDetails, extractLines,
  extractCharacters, readFile
} = require('../src/lib.js'); 

let returnConstant = function(constant){ return constant; }; 

describe('classifyDetails', () => {
  it('should return empty object for no input', () => {
    deepEqual(classifyDetails(),{});
  });

  it('should return object of assigned details of file 1', () => {
    let expectedOutput = { option : '-n', length : 1, files : ['file1'] }
    deepEqual(classifyDetails(['-n','1','file1']),expectedOutput);
  });

  it('should return object of assigned details with more than one file', () => {
    let expectedOutput = { option : '-n', length : 1, files : ['file1','file2','file3'] }
    deepEqual(classifyDetails(['-n','1','file1','file2','file3']),expectedOutput);
  });
});

describe('readFile', () => {
  it('should return same output as per the input', () => {
    deepEqual(readFile(returnConstant,[0,0,0]),[0,0,0]);
    deepEqual(readFile(returnConstant,['a','a','a']),['a','a','a']);
  });
});
