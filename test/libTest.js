const {equal, deepEqual} = require('assert');

const { 
  classifyDetails,
  extractLines
} = require('../src/lib.js'); 

let returnConstant = function(constant){ return constant; }; 

describe('classifyDetails categories the input according to characteristics', () => {
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

describe('extractLines returns lines of given text as per the given input', () => {
  it('should return empty string for 0 length input', () => {
    deepEqual(extractLines(0,'first line\nsecond line'),'');
  });

  it('should return one line for length as input 1', () => {
    deepEqual(extractLines(1,'first line\nsecond line'),'first line');
  });

  it('should return empty line for invalid length(negative)', () => {
    deepEqual(extractLines(-1,'first line\nsecond line'),'');
  });

  it('should return number of lines as per the given length', () => {
    deepEqual(extractLines(2,'first line\nsecond line'),'first line\nsecond line');
    deepEqual(extractLines(4,'first\nline\nsecond\nline'),'first\nline\nsecond\nline');
  });
});
