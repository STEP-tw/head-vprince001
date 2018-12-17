const { equal, deepEqual } = require("assert");

const {
  head,
  getIllegalCountErrorHead,
  runHead,
  tail,
  runTail,
  reverseData,
  classifyDetails,
  addHeading,
  isFileExists,
  getHeadParameters,
  readFile,
  showFileNotFoundError
} = require("../../src/lib/lib.js");

//====================================================================================================

const reader = function(unicode, file) {
  return file;
};
const readFileSync = reader.bind(null, "utf8");
const existsSync = file => true;
const fs = { readFileSync, existsSync };

describe("head", function() {
  const data = "line1\nline2\nline3";

  it("should return first 2 lines of file for -n2 and file as input", function() {
    let userArgs = ["-n2", data];
    deepEqual(head(userArgs, fs), "line1\nline2");
  });

  it("should return first 4 characters of file for -c, 4 and file as input", function() {
    let userArgs = ["-c", "4", data];
    deepEqual(head(userArgs, fs), "line");
  });

  it("should return illegal line count error msg for -n0 and file as input", function() {
    let errorMsg = "head: illegal line count -- 0";
    let userArgs = ["-n0", data];
    deepEqual(head(userArgs, fs), errorMsg);
  });

  it("should return illegal byte count error msg for -c0 and file as input", function() {
    let errorMsg = "head: illegal byte count -- 0";
    let userArgs = ["-c0", data];
    equal(head(userArgs, fs), errorMsg);
  });

});

//=====================================================================================================

describe("getIllegalCountErrorHead", function() {

  it("should return illegal line count error msg for n and 0 as input", function() {
    let errorMsg = "head: illegal line count -- 0";
    deepEqual(getIllegalCountErrorHead("n", 0), errorMsg);
  });

  it("should return illegal byte count error msg for c and 0 as input", function() {
    let errorMsg = "head: illegal byte count -- 0";
    deepEqual(getIllegalCountErrorHead("c", 0), errorMsg);
  });
  
});

//=====================================================================================================

describe("runHead", function() {
    const file1 = "line1\nline2";
    const file2 = "line1";
    const file3 = "line1\nline2\nline3";

  it("should return first 6 characters of files with headings for c, 6 and 2 files as input", function() {
    let expectedOutput = [
      "==> line1\nline2 <==",
      "line1\n",
      "\n==> line1 <==",
      "line1"
    ];
    deepEqual(runHead("c", 6, [file1, file2], fs), expectedOutput);
  });

  it("should return first 2 lines of files with headings for n, 2 and 3 files as input", function() {
    let expectedOutput = [
      "==> line1\nline2 <==",
      "line1\nline2",
      "\n==> line1 <==",
      "line1",
      "\n==> line1\nline2\nline3 <==",
      "line1\nline2"
    ];

    deepEqual(runHead("n", 2, [file1, file2, file3], fs), expectedOutput);
  });

});

//====================================================================================================

describe("tail", function() {

  const data = "line1\nline2\nline3";

  it("should return last 2 lines of file for -n2 and file as input", function() {
    let userArgs = ["-n2", data];
    let expectedOutput = "line2\nline3";
    deepEqual(tail(userArgs, fs), expectedOutput);
  });

  it("should return last 7 characters of file for -c, 7 and file as input", function() {
    let userArgs = ["-c", "7", data];
    deepEqual(tail(userArgs, fs), "2\nline3");
  });

  it("should return illegal offset error msg for -np and file as input", function() {
    let errorMsg = "tail: illegal offset -- p";
    let userArgs = ["-np", data];
    equal(tail(userArgs, fs), errorMsg);
  });

  it("should return empty string for -n0 and file as input", function() {
    let expectedOutput = "";
    let userArgs = ["-n0", data];
    equal(tail(userArgs, fs), expectedOutput);
  });

});

//=====================================================================================================

describe("runTail", function() {

  const file1 = "line1";
  const file2 = "line1\nline2";
  const file3 = "line1\nline2\nline3"

  it("should return last 3 characters of files with headings for c, 3 and 2 files as input", function() {
    let expectedOutput = [ "==> line1 <==", "ne1", "\n==> line1\nline2 <==", "ne2" ];

    deepEqual(runTail("c", 3, [file1, file2], fs), expectedOutput);
  });

  it("should return last 2 lines of files with headings for n, 2 and 3 files as input", function() {
    let expectedOutput = [ "==> line1 <==", "line1", "\n==> line1\nline2 <==", "line1\nline2", "\n==> line1\nline2\nline3 <==", "line2\nline3" ];

    deepEqual(runTail("n", 2, [file1, file2, file3], fs), expectedOutput);
  });

  it("should return no such file error msg for n, 2 and non existing file", () => {
    let existsSync = file => false;
    let fs = { existsSync };

    let expectedOutput = "tail: file1: No such file or directory";
    equal(runTail("n", 2, ["file1"], fs), expectedOutput);
  });

});

//=====================================================================================================

describe("reverseData", () => {

  it("should return empty string for empty string", () => {
    equal(reverseData(""), "");
  });

  it("should return reverse string for strings without spaces as input", () => {
    equal(reverseData("Something"), "gnihtemoS");
  });

  it("should return reverse string for strings with spaces as input", () => {
    equal(reverseData("two words"), "sdrow owt");
  });

});

//====================================================================================================

describe("getHeadParameters", () => {

  it("should return type, numberOfLines and fileNames in an object for -n1 and file as input", () => {
    let input = ["-n1", "file.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -n1 and 2 files as input", () => {
    let input = ["-n1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -n, 1 and 1 file as input", () => {
    let input = ["-n", "1", "file1.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -n, 1 and 2 files as input", () => {
    let input = ["-n", "1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for 1 and 2 files as input", () => {
    let input = ["1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -c1, and 1 file as input", () => {
    let input = ["-c1", "file1.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -c1, and 2 files as input", () => {
    let input = ["-c1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -c, 1 and 1 file as input", () => {
    let input = ["-c", "1", "file1.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -c, 1 and 2 files as input", () => {
    let input = ["-c", "1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

});

//=====================================================================================================

describe("classifyDetails", () => {

  it("should return type, numberOfLines and fileNames in an object for -n, 5 and file as input", () => {
    let expectedOutput = {
      type: "n",
      numberOfLines: 5,
      fileNames: ["file1.txt"]
    };
    deepEqual(classifyDetails(["-n", "5", "file1.txt"]), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -n, 5 and 2 files as input", () => {
    let expectedOutput = {
      type: "n",
      numberOfLines: 5,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(
      classifyDetails(["-n", "5", "file1.txt", "file2.txt"]),
      expectedOutput
    );
  });

  it("should return type, numberOfLines and fileNames in an object for -c, 5 and 2 files as input", () => {
    let expectedOutput = {
      type: "c",
      numberOfLines: 5,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(
      classifyDetails(["-c", "5", "file1.txt", "file2.txt"]),
      expectedOutput
    );
  });

  it("should return type, numberOfLines and fileNames in an object for n, 5 and file as input", () => {
    let expectedOutput = {
      type: "n",
      numberOfLines: 10,
      fileNames: ["n", "5", "file1.txt"]
    };
    deepEqual(classifyDetails(["n", "5", "file1.txt"]), expectedOutput);
  });

});

//====================================================================================================

describe("addHeading", function() {

  it("should return file name with side arrows for given file name", function() {
    equal(addHeading("lib.js"), "==> lib.js <==");
  });

  it("should return side arrows with space in between for empty string", function() {
    equal(addHeading(""), "==>  <==");
  });

  it("should return undefined with side arrows for no input", function() {
    equal(addHeading(), "==> undefined <==");
  });

});

//====================================================================================================

describe("isFileExists", () => {
  let fsTrue = {
    existsSync: file => {
      return true;
    }
  };

  it("should return true if file exists", () => {
    deepEqual(isFileExists(fsTrue, "file1"), true);
  });

  let fsFalse = {
    existsSync: file => {
      return false;
    }
  };

  it("should return false if file does not exist", () => {
    deepEqual(isFileExists(fsFalse, "file2"), false);
  });

});

//====================================================================================================

describe("readFile", () => {

  let fileName = "file1";
  let fs = {
    existsSync: function(fileName) {
      return false;
    }
  };

  it("should return no such file found head error for non existing file", () => {
    equal(readFile(fs, "file1"), "head: file1: No such file or directory");
  });

});

//====================================================================================================

describe("showFileNotFoundError", () => {

  it("should return no such file found tail error for non existing file", () => {
    let expectedOutput = "tail: file1: No such file or directory";
    equal(showFileNotFoundError("file1"), expectedOutput);
  });

});
