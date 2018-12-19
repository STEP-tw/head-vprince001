const assert = require("assert");

const {
  isFileExists,
  addHeading,
  readFile,
  reverseString
} = require("../../src/util_lib/util.js");

const reader = function(unicode, file) {
  return file;
};
const readFileSync = reader.bind(null, "utf8");
const existsSync = file => true;
const fs = { readFileSync, existsSync };

//====================================================================================================

describe("isFileExists", () => {
  let fsTrue = {
    existsSync: file => {
      return true;
    }
  };

  it("should return true if file exists", () => {
    assert.deepEqual(isFileExists(fsTrue, "file1"), true);
  });

  let fsFalse = {
    existsSync: file => {
      return false;
    }
  };

  it("should return false if file does not exist", () => {
    assert.deepEqual(isFileExists(fsFalse, "file2"), false);
  });
});

//====================================================================================================

describe("addHeading", function() {
  it("should return file name with side arrows for given file name", function() {
    assert.equal(addHeading("lib.js"), "==> lib.js <==");
  });

  it("should return side arrows with space in between for empty string", function() {
    assert.equal(addHeading(""), "==>  <==");
  });
});

//====================================================================================================

describe("readFile", () => {
  it("should return trimmed file data for existing file", () => {
    assert.equal(readFile(fs, "file1"), "file1");
  });
});

//=====================================================================================================

describe("reverseString", () => {
  it("should return empty string for empty string", () => {
    assert.equal(reverseString(""), "");
  });

  it("should return reverse string for strings without spaces as input", () => {
    assert.equal(reverseString("Something"), "gnihtemoS");
  });

  it("should return reverse string for strings with spaces as input", () => {
    assert.equal(reverseString("two words"), "sdrow owt");
  });
});
