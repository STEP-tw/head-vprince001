const {equal, deepEqual} = require('assert');

const { 
  classifyDetails, retrieveTypeAndLength,
  addHeading
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

describe('retrieveTypeAndLength', () => {
  it('should return empty array for empty array', () => {
    deepEqual(retrieveTypeAndLength([]), []);
  });

  it('should return array consisting type and length for given type and length', () => {
    let expectedOutput = ['-n', 5];
    deepEqual(retrieveTypeAndLength(['-n','5','file1.txt']), expectedOutput);
  });

});
    
describe('addHeading', function(){

  it('should create a head line using a file name', function(){
    equal(addHeading('lib.js'),'==> lib.js <==');
    equal(addHeading('createHead.js'),'==> createHead.js <==');
  });

  it('should create a head line when file name is empty', function(){
    equal(addHeading(''), '==>  <==');
  });

  it('should create a head line when no file name is given', function(){
    equal(addHeading(), '==> undefined <==');
  });

});
