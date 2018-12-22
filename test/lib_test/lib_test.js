const assert = require("assert");

const {
  tail,
  getFileData,
  runCommand,
  getHeadParameters,
  classifyDetails,
  head
} = require("../../src/lib/lib.js");

//=====================================================================================================

const files = {
  file1: "line1",
  file2: "line1\nline2",
  file3: "line1\nline2\nline3",
  file4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].join("\n")
};

const fs = {
  readFileSync: function(fileName) {
    return files[fileName];
  },
  existsSync: function(fileName) {
    return files.hasOwnProperty(fileName);
  }
};

//=====================================================================================================

describe("tail", function() {
  it("should return last 2 lines of file for -n2 and file as input", function() {
    let userArgs = ["-n2", "file3"];
    let expectedOutput = "line2\nline3";
    assert.equal(tail(userArgs, fs), expectedOutput);
  });

  it("should return last 7 characters of file for -c, 7 and file as input", function() {
    let userArgs = ["-c", "7", "file3"];
    assert.equal(tail(userArgs, fs), "2\nline3");
  });

  it("should return illegal offset error msg for -np and file as input", function() {
    let errorMsg = "tail: illegal offset -- p";
    let userArgs = ["-np", "file3"];
    assert.equal(tail(userArgs, fs), errorMsg);
  });

  it("should return empty string for -n0 and file as input", function() {
    let expectedOutput = "";
    let userArgs = ["-n0", "file3"];
    assert.equal(tail(userArgs, fs), expectedOutput);
  });
});

//=====================================================================================================

describe("getFileData", function() {
  const data = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11";

  it("should return first line for given data, 1 and n", function() {
    assert.equal(getFileData(files.file3, 1, "n"), "line1");
  });

  it("should return first three lines for given data, 3 and n", function() {
    assert.equal(getFileData(files.file3, 2, "n"), "line1\nline2");
  });

  it("should return first character for given data, 1 and c", function() {
    assert.equal(getFileData(files.file3, 1, "c"), "l");
  });

  it("should return first character for given data, 8 and c", function() {
    assert.equal(getFileData(files.file3, 8, "c"), "line1\nli");
  });

  it("should return first 10 lines for given data", function() {
    assert.equal(getFileData(files.file4), "1\n2\n3\n4\n5\n6\n7\n8\n9\n10");
  });
});

//=====================================================================================================

describe("runCommand", function() {
  let classifiedDetails = {};

  it("should return first 3 characters of file without heading for c, 3, file, fs and head as input", function() {
    classifiedDetails = { type: "c", count: 3, fileNames: ["file1"] };
    let expectedOutput = ["lin"];
    assert.deepEqual(runCommand(classifiedDetails, fs, "head"), expectedOutput);
  });

  it("should return last 3 characters of file without heading for c, 3, file, fs and head as input", function() {
    classifiedDetails = { type: "c", count: 3, fileNames: ["file1"] };
    let expectedOutput = ["ne1"];
    assert.deepEqual(runCommand(classifiedDetails, fs, "tail"), expectedOutput);
  });

  it("should return all data for c, number of chars more than all file chars, file, fs and head as input", function() {
    classifiedDetails = { type: "c", count: 6, fileNames: ["file1"] };
    let expectedOutput = ["line1"];
    assert.deepEqual(runCommand(classifiedDetails, fs, "head"), expectedOutput);
  });

  it("should return all data for c, number of chars more than all file chars, file, fs and tail as input", function() {
    classifiedDetails = { type: "c", count: 6, fileNames: ["file1"] };
    let expectedOutput = ["line1"];
    assert.deepEqual(runCommand(classifiedDetails, fs, "tail"), expectedOutput);
  });

  it("should return first 6 characters of files with headings for c, 6, files, fs and head as input", function() {
    classifiedDetails = { type: "c", count: 6, fileNames: ["file1", "file2"] };
    let expectedOutput = [
      "==> file1 <==",
      "line1",
      "\n==> file2 <==",
      "line1\n"
    ];
    assert.deepEqual(runCommand(classifiedDetails, fs, "head"), expectedOutput);
  });

  it("should return last 6 characters of files with headings for c, 6 and files, fs and tail as input", function() {
    classifiedDetails = { type: "c", count: 6, fileNames: ["file1", "file2"] };
    let expectedOutput = [
      "==> file1 <==",
      "line1",
      "\n==> file2 <==",
      "\nline2"
    ];

    assert.deepEqual(runCommand(classifiedDetails, fs, "tail"), expectedOutput);
  });

  it("should return first line of file without heading for n, 1, file, fs and head as input", function() {
    classifiedDetails = { type: "n", count: 1, fileNames: ["file2"] };
    let expectedOutput = ["line1"];
    assert.deepEqual(runCommand(classifiedDetails, fs, "head"), expectedOutput);
  });

  it("should return last line of file without heading for n, 1, file, fs and tail as input", function() {
    classifiedDetails = { type: "n", count: 1, fileNames: ["file2"] };
    let expectedOutput = ["line2"];
    assert.deepEqual(runCommand(classifiedDetails, fs, "tail"), expectedOutput);
  });

  it("should return all data for n, number of lines more than all file lines, file, fs and head as input", function() {
    classifiedDetails = { type: "n", count: 3, fileNames: ["file2"] };
    let expectedOutput = ["line1\nline2"];

    assert.deepEqual(runCommand(classifiedDetails, fs, "head"), expectedOutput);
  });

  it("should return all data for n, number of lines more than all file lines, file, fs and tail as input", function() {
    classifiedDetails = { type: "n", count: 3, fileNames: ["file2"] };
    let expectedOutput = ["line1\nline2"];

    assert.deepEqual(runCommand(classifiedDetails, fs, "tail"), expectedOutput);
  });

  it("should return first 2 lines of files with headings for n, 2, files, fs and head as input", function() {
    classifiedDetails = {
      type: "n",
      count: 2,
      fileNames: ["file1", "file2", "file3"]
    };
    let expectedOutput = [
      "==> file1 <==",
      "line1",
      "\n==> file2 <==",
      "line1\nline2",
      "\n==> file3 <==",
      "line1\nline2"
    ];

    assert.deepEqual(runCommand(classifiedDetails, fs, "head"), expectedOutput);
  });

  it("should return last 2 lines of files with headings for n, 2, files, fs and tail as input", function() {
    classifiedDetails = {
      type: "n",
      count: 2,
      fileNames: ["file1", "file2", "file3"]
    };
    let expectedOutput = [
      "==> file1 <==",
      "line1",
      "\n==> file2 <==",
      "line1\nline2",
      "\n==> file3 <==",
      "line2\nline3"
    ];

    assert.deepEqual(runCommand(classifiedDetails, fs, "tail"), expectedOutput);
  });

  it("should return no such file head error for non existing file", () => {
    classifiedDetails = { type: "c", count: 3, fileNames: ["file"] };
    let expectedOutput = "head: file: No such file or directory";

    assert.equal(runCommand(classifiedDetails, fs, "head"), expectedOutput);
  });

  it("should return no such file tail error for non existing file", () => {
    classifiedDetails = { type: "c", count: 3, fileNames: ["file"] };
    let expectedOutput = "tail: file: No such file or directory";

    assert.equal(runCommand(classifiedDetails, fs, "tail"), expectedOutput);
  });
});

//====================================================================================================

describe("getHeadParameters", () => {
  it("should return type, count and fileNames in an object for -n1 and file as input", () => {
    let input = ["-n1", "file.txt"];
    let expectedOutput = {
      type: "n",
      count: 1,
      fileNames: ["file.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, count and fileNames in an object for -n1 and 2 files as input", () => {
    let input = ["-n1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      count: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, count and fileNames in an object for -n, 1 and 1 file as input", () => {
    let input = ["-n", "1", "file1.txt"];
    let expectedOutput = {
      type: "n",
      count: 1,
      fileNames: ["file1.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, count and fileNames in an object for -n, 1 and 2 files as input", () => {
    let input = ["-n", "1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      count: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, count and fileNames in an object for 1 and 2 files as input", () => {
    let input = ["1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      count: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, count and fileNames in an object for -c1, and 1 file as input", () => {
    let input = ["-c1", "file1.txt"];
    let expectedOutput = {
      type: "c",
      count: 1,
      fileNames: ["file1.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, count and fileNames in an object for -c1, and 2 files as input", () => {
    let input = ["-c1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "c",
      count: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, count and fileNames in an object for -c, 1 and 1 file as input", () => {
    let input = ["-c", "1", "file1.txt"];
    let expectedOutput = {
      type: "c",
      count: 1,
      fileNames: ["file1.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return type, count and fileNames in an object for -c, 1 and 2 files as input", () => {
    let input = ["-c", "1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "c",
      count: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(getHeadParameters(input), expectedOutput);
  });
});

//====================================================================================================

describe("classifyDetails", () => {
  it("should return type, count and fileNames in an object for -n, 5 and file as input", () => {
    let expectedOutput = {
      type: "n",
      count: 5,
      fileNames: ["file1.txt"]
    };
    assert.deepEqual(classifyDetails(["-n", "5", "file1.txt"]), expectedOutput);
  });

  it("should return type, count and fileNames in an object for -n, 5 and 2 files as input", () => {
    let expectedOutput = {
      type: "n",
      count: 5,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(
      classifyDetails(["-n", "5", "file1.txt", "file2.txt"]),
      expectedOutput
    );
  });

  it("should return type, count and fileNames in an object for -c, 5 and 2 files as input", () => {
    let expectedOutput = {
      type: "c",
      count: 5,
      fileNames: ["file1.txt", "file2.txt"]
    };
    assert.deepEqual(
      classifyDetails(["-c", "5", "file1.txt", "file2.txt"]),
      expectedOutput
    );
  });

  it("should return type, count and fileNames in an object for n, 5 and file as input", () => {
    let expectedOutput = {
      type: "n",
      count: 10,
      fileNames: ["n", "5", "file1.txt"]
    };
    assert.deepEqual(classifyDetails(["n", "5", "file1.txt"]), expectedOutput);
  });
});

//=====================================================================================================

describe("head", function() {
  it("should return first 2 lines of file for -n2 and file as input", function() {
    let userArgs = ["-n2", "file3"];
    assert.equal(head(userArgs, fs), "line1\nline2");
  });

  it("should return first 4 characters of file for -c, 4 and file as input", function() {
    let userArgs = ["-c", "4", "file1"];
    assert.deepEqual(head(userArgs, fs), "line");
  });

  it("should return illegal line count error msg for -n0 and file as input", function() {
    let errorMsg = "head: illegal line count -- 0";
    let userArgs = ["-n0", "file1"];
    assert.deepEqual(head(userArgs, fs), errorMsg);
  });

  it("should return illegal byte count error msg for -c0 and file as input", function() {
    let errorMsg = "head: illegal byte count -- 0";
    let userArgs = ["-c0", "file1"];
    assert.equal(head(userArgs, fs), errorMsg);
  });
});
