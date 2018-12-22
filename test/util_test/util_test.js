const assert = require("assert");

const {
  isFileExists,
  addHeading,
  readFile,
  reverseString
} = require("../../src/util_lib/util.js");

//====================================================================================================

const files = {
  file1: "line1",
  file2: "line1\nline2",
  file3: "line1\nline2\nline3",
  file4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].join("\n"),
  file5: "line1\nline2\n\n\n"
};

const fs = {
  readFileSync: function(fileName) {
    return files[fileName];
  },
  existsSync: function(fileName) {
    return files.hasOwnProperty(fileName);
  }
};

//====================================================================================================

describe("isFileExists", () => {
  it("should return true if file exists", () => {
    assert.deepEqual(isFileExists(fs, "file1"), true);
  });

  it("should return false if file does not exist", () => {
    assert.deepEqual(isFileExists(fs, "file"), false);
  });
});

//====================================================================================================

describe("addHeading", function() {
  it("should return file name with side arrows for given file name", function() {
    assert.equal(addHeading("file1"), "==> file1 <==");
  });

  it("should return side arrows with space in between for empty string", function() {
    assert.equal(addHeading(""), "==>  <==");
  });
});

//====================================================================================================

describe("readFile", () => {
  it("should return trimmed file data for existing file", () => {
    assert.equal(readFile(fs, "file5"), "line1\nline2");
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
