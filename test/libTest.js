const {equal, deepEqual} = require('assert');

const { 
  classifyDetails, extractLines,
  extractCharacters, readFile
} = require('../src/lib.js'); 

let returnConstant = function(constant){ return constant; }; 

describe('classifyDetails', () => {
  it('should return empty array for empty array', () => {
    deepEqual(classifyDetails([]), []);
  });

  it('should return array of assigned details of file 1', () => {
    let expectedOutput = [['file1.txt'],5,'n'];
    deepEqual(classifyDetails(['-n','5','file1.txt']), expectedOutput);
  });

  it('should return array of assigned details with more than one file', () => {
    let expectedOutput = [['file1.txt','file2.txt'],5,'n'];
    deepEqual(classifyDetails(['-n','5','file1.txt','file2.txt']), expectedOutput);
  });
});
