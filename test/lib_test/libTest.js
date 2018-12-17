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

  it("should return head of the file with given specifications for lines", function() {
    let userArgs = ["-n2", data];
    deepEqual(head(userArgs, fs), "line1\nline2");
  });

  it("should return head of the file with given specifications for characters", function() {
    let userArgs = ["-c", "4", data];
    deepEqual(head(userArgs, fs), "line");
  });

  it("should return illegal line count error when type is n and numberOfLines is less than 1", function() {
    let errorMsg = "head: illegal line count -- 0";
    let userArgs = ["-n0", data];
    deepEqual(head(userArgs, fs), errorMsg);
  });

  it("should return illegal byte count error when type is c and numberOfLines is less than 1", function() {
    let errorMsg = "head: illegal byte count -- 0";
    let userArgs = ["-c0", data];
    equal(head(userArgs, fs), errorMsg);
  });

});

//=====================================================================================================

describe("getIllegalCountErrorHead", function() {
  it("should return illegal line count error when type is n and numberOfLines is less than 1", function() {
    let errorMsg = "head: illegal line count -- 0";
    deepEqual(getIllegalCountErrorHead("n", 0), errorMsg);
  });

  it("should return illegal byte count error when type is c and numberOfLines is less than 1", function() {
    let errorMsg = "head: illegal byte count -- 0";
    deepEqual(getIllegalCountErrorHead("c", 0), errorMsg);
  });
});

//=====================================================================================================

describe("runHead", function() {
    const file1 = "line1\nline2";
    const file2 = "line1";
    const file3 = "line1\nline2\nline3";

  it("should return final head data of the files with given specifications for characters", function() {
    let expectedOutput = [
      "==> line1\nline2 <==",
      "line1\n",
      "\n==> line1 <==",
      "line1"
    ];
    deepEqual(runHead("c", 6, [file1, file2], fs), expectedOutput);
  });

  it("should return final head data of the files with given specifications for lines", function() {
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

  it("should return tail of the file with given specifications for lines", function() {
    let userArgs = ["-n2", data];
    let expectedOutput = "line2\nline3";
    deepEqual(tail(userArgs, fs), expectedOutput);
  });

  it("should return tail of the file with given specifications for characters", function() {
    let userArgs = ["-c", "7", data];
    deepEqual(tail(userArgs, fs), "2\nline3");
  });

  it("should return illegal offset error when numberOfLines is NaN", function() {
    let errorMsg = "tail: illegal offset -- p";
    let userArgs = ["-np", data];
    equal(tail(userArgs, fs), errorMsg);
  });

  it("should return empty string when numberOfLines is 0", function() {
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

  it("should return final tail data of the files with given specifications for characters", function() {
    let expectedOutput = [ "==> line1 <==", "ne1", "\n==> line1\nline2 <==", "ne2" ];

    deepEqual(runTail("c", 3, [file1, file2], fs), expectedOutput);
  });

  it("should return final tail data of the files with given specifications for lines", function() {
    let expectedOutput = [ "==> line1 <==", "line1", "\n==> line1\nline2 <==", "line1\nline2", "\n==> line1\nline2\nline3 <==", "line2\nline3" ];

    deepEqual(runTail("n", 2, [file1, file2, file3], fs), expectedOutput);
  });

  it("show return no such file or directory error if file not found", () => {
    let existsSync = file => false;
    let fs = { existsSync };

    let expectedOutput = "tail: file1: No such file or directory";
    equal(runTail("n", 2, ["file1"], fs), expectedOutput);
  });

});

//=====================================================================================================

describe("reverseData", () => {
  it("should return reverse of the input string", () => {
    equal(reverseData(""), "");
  });

  it("should return reverse of the input string", () => {
    equal(reverseData("Something"), "gnihtemoS");
  });

  it("should return reverse of the input string", () => {
    equal(reverseData("two words"), "sdrow owt");
  });

  it("should return reverse of the input string", () => {
    equal(reverseData("12345"), "54321");
  });
});

//====================================================================================================

describe("getHeadParameters", () => {

  it("should return an object of type, numberOfLines and fileNames for -n and one file name", () => {
    let input = ["-n1", "file.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return an object of type, numberOfLines and fileNames for -n1 and two file names", () => {
    let input = ["-n1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return an object of type, numberOfLines and fileNames for -n, 1 and one file name", () => {
    let input = ["-n", "1", "file1.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return an object of type, numberOfLines and fileNames for -n, 1 and two file names", () => {
    let input = ["-n", "1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return an object of type, numberOfLines and fileNames for 1 and two file names", () => {
    let input = ["1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "n",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return an object of type, numberOfLines and fileNames -c1, and one file name", () => {
    let input = ["-c1", "file1.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return an object of type, numberOfLines and fileNames -c1, and two file names", () => {
    let input = ["-c1", "file1.txt", "file2.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt", "file2.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return an object of type, numberOfLines and fileNames -c, 1 and one file name", () => {
    let input = ["-c", "1", "file1.txt"];
    let expectedOutput = {
      type: "c",
      numberOfLines: 1,
      fileNames: ["file1.txt"]
    };
    deepEqual(getHeadParameters(input), expectedOutput);
  });

  it("should return an object of type, numberOfLines and fileNames -c, 1 and two file names", () => {
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
  it("should return object of assigned details of file 1", () => {
    let expectedOutput = {
      type: "n",
      numberOfLines: 5,
      fileNames: ["file1.txt"]
    };
    deepEqual(classifyDetails(["-n", "5", "file1.txt"]), expectedOutput);
  });

  it("should return object of assigned details with more than one file", () => {
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

  it("should return object of assigned details with more than one file", () => {
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
  it("should create a head line using a file name", function() {
    equal(addHeading("lib.js"), "==> lib.js <==");
    equal(addHeading("createHead.js"), "==> createHead.js <==");
  });

  it("should create a head line when file name is empty", function() {
    equal(addHeading(""), "==>  <==");
  });

  it("should create a head line when no file name is given", function() {
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

  it("should return no such file found error if file doesn't exists", () => {
    equal(readFile(fs, "file1"), "head: file1: No such file or directory");
  });
});

//====================================================================================================

describe("showFileNotFoundError", () => {
  it("show return no such file or directory error", () => {
    let expectedOutput = "tail: file1: No such file or directory";
    equal(showFileNotFoundError("file1"), expectedOutput);
  });

});
