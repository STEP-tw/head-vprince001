const assert = require("assert");

const {
  runTail,
  tail,
  runHead,
  getIllegalCountErrorHead,
  getHeadParameters,
  classifyDetails,
  head
} = require("../../src/lib/lib.js");

const reader = function(unicode, file) {
  return file;
};
const readFileSync = reader.bind(null, "utf8");
const existsSync = file => true;
const fs = { readFileSync, existsSync };

//=====================================================================================================

describe("runTail", function() {
  const file1 = "line1";
  const file2 = "line1\nline2";
  const file3 = "line1\nline2\nline3";

  it("should return last 3 characters of files with headings for c, 3 and 2 files as input", function() {
    let expectedOutput = [
      "==> line1 <==",
      "ne1",
      "\n==> line1\nline2 <==",
      "ne2"
    ];

    assert.deepEqual(runTail("c", 3, [file1, file2], fs), expectedOutput);
  });

  it("should return last 2 lines of files with headings for n, 2 and 3 files as input", function() {
    let expectedOutput = [
      "==> line1 <==",
      "line1",
      "\n==> line1\nline2 <==",
      "line1\nline2",
      "\n==> line1\nline2\nline3 <==",
      "line2\nline3"
    ];

    assert.deepEqual(
      runTail("n", 2, [file1, file2, file3], fs),
      expectedOutput
    );
  });

  it("should return no such file error msg for n, 2 and non existing file", () => {
    let existsSync = file => false;
    let fs = { existsSync };

    let expectedOutput = "tail: file1: No such file or directory";
    assert.equal(runTail("n", 2, ["file1"], fs), expectedOutput);
  });
});

//====================================================================================================

describe("tail", function() {
  const data = "line1\nline2\nline3";

  it("should return last 2 lines of file for -n2 and file as input", function() {
    let userArgs = ["-n2", data];
    let expectedOutput = "line2\nline3";
    assert.equal(tail(userArgs, fs), expectedOutput);
  });

  it("should return last 7 characters of file for -c, 7 and file as input", function() {
    let userArgs = ["-c", "7", data];
    assert.equal(tail(userArgs, fs), "2\nline3");
  });

  it("should return illegal offset error msg for -np and file as input", function() {
    let errorMsg = "tail: illegal offset -- p";
    let userArgs = ["-np", data];
    assert.equal(tail(userArgs, fs), errorMsg);
  });

  it("should return empty string for -n0 and file as input", function() {
    let expectedOutput = "";
    let userArgs = ["-n0", data];
    assert.equal(tail(userArgs, fs), expectedOutput);
  });
});

//=====================================================================================================

describe("runHead", function() {
  const file1 = "line1\nline2";
  const file2 = "line1";

  it("should return first 8 characters of file without heading for c, 8 and 1 file as input", function() {
    let expectedOutput = ["line1\nli"];
    assert.deepEqual(runHead("c", 8, [file1], fs), expectedOutput);
  });

  it("should return all data for c, number of chars more than all file chars and 1 file as input", function() {
    let expectedOutput = ["line1\nline2"];
    assert.deepEqual(runHead("c", 15, [file1], fs), expectedOutput);
  });

  it("should return first 6 characters of files with headings for c, 6 and multiple files as input", function() {
    let expectedOutput = [
      "==> line1\nline2 <==",
      "line1\n",
      "\n==> line1 <==",
      "line1"
    ];
    assert.deepEqual(runHead("c", 6, [file1, file2], fs), expectedOutput);
  });

  it("should return first line of file without heading for n, 1 and 1 file as input", function() {
    let expectedOutput = ["line1"];
    assert.deepEqual(runHead("n", 1, [file1], fs), expectedOutput);
  });

  it("should return all data for n, number of lines more than all file lines and 1 file as input", function() {
    let expectedOutput = ["line1\nline2"];

    assert.deepEqual(runHead("n", 3, [file1], fs), expectedOutput);
  });

  it("should return first 2 lines of files with headings for n, 2 and multiple files as input", function() {
    let expectedOutput = [
      "==> line1\nline2 <==",
      "line1\nline2",
      "\n==> line1 <==",
      "line1"
    ];

    assert.deepEqual(runHead("n", 2, [file1, file2], fs), expectedOutput);
  });
});

//=====================================================================================================

describe("getIllegalCountErrorHead", function() {
  it("should return illegal line count error msg for n and 0 as input", function() {
    let errorMsg = "head: illegal line count -- 0";
    assert.deepEqual(getIllegalCountErrorHead("n", 0), errorMsg);
  });

  it("should return illegal line count error msg for n and -5 as input", function() {
    let errorMsg = "head: illegal line count -- -5";
    assert.deepEqual(getIllegalCountErrorHead("n", -5), errorMsg);
  });

  it("should return illegal byte count error msg for c and 0 as input", function() {
    let errorMsg = "head: illegal byte count -- 0";
    assert.deepEqual(getIllegalCountErrorHead("c", 0), errorMsg);
  });

  it("should return illegal byte count error msg for c and -2 as input", function() {
    let errorMsg = "head: illegal byte count -- -2";
    assert.deepEqual(getIllegalCountErrorHead("c", -2), errorMsg);
  });

  it("should return illegal byte count error msg for p and number less than 1 as input", function() {
    let errorMsg = "head: illegal line count -- -1";
    assert.deepEqual(getIllegalCountErrorHead("p", -1), errorMsg);
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
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -n1 and 2 files as input", () => {
    let input = ["-n1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -n, 1 and 1 file as input", () => {
    let input = ["-n", "1", "file1.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -n, 1 and 2 files as input", () => {
    let input = ["-n", "1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for 1 and 2 files as input", () => {
    let input = ["1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -c1, and 1 file as input", () => {
    let input = ["-c1", "file1.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -c1, and 2 files as input", () => {
    let input = ["-c1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -c, 1 and 1 file as input", () => {
    let input = ["-c", "1", "file1.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -c, 1 and 2 files as input", () => {
    let input = ["-c", "1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });
});

//====================================================================================================

describe("classifyDetails", () => {
  it("should return type, numberOfLines and fileNames in an object for -n, 5 and file as input", () => {
    let expectedOutput = {
      type: "n",
      numberOfLines: 5,
      fileNames: ["file1.txt"]
    };
    assert.deepEqual(classifyDetails(["-n", "5", "file1.txt"]), expectedOutput);
  });

  it("should return type, numberOfLines and fileNames in an object for -n, 5 and 2 files as input", () => {
    let expectedOutput = {
      type: "n",
      numberOfLines: 5,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(
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
    assert.deepEqual(
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
    assert.deepEqual(classifyDetails(["n", "5", "file1.txt"]), expectedOutput);
  });
});

//=====================================================================================================

describe("head", function() {
  const data = "line1\nline2\nline3";

  it("should return first 2 lines of file for -n2 and file as input", function() {
    let userArgs = ["-n2", data];
    assert.deepEqual(head(userArgs, fs), "line1\nline2");
  });

  it("should return first 4 characters of file for -c, 4 and file as input", function() {
    let userArgs = ["-c", "4", data];
    assert.deepEqual(head(userArgs, fs), "line");
  });

  it("should return illegal line count error msg for -n0 and file as input", function() {
    let errorMsg = "head: illegal line count -- 0";
    let userArgs = ["-n0", data];
    assert.deepEqual(head(userArgs, fs), errorMsg);
  });

  it("should return illegal byte count error msg for -c0 and file as input", function() {
    let errorMsg = "head: illegal byte count -- 0";
    let userArgs = ["-c0", data];
    assert.equal(head(userArgs, fs), errorMsg);
  });
});
