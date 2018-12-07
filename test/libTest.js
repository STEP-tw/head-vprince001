const { equal, deepEqual } = require("assert");

const {
  classifyDetails,
  retrieveTypeAndLength,
  addHeading,
  getNumOfLines,
  isFileExists,
  getHeadParameters
} = require("../src/lib.js");

let returnConstant = function(constant) {
  return constant;
};

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
});

describe("getNumOfLines", () => {
  it("should return 10 if length is not given", () => {
    equal(getNumOfLines([]), 10);
  });

  it("should return numerical value from array consisting length and type together", () => {
    equal(getNumOfLines(["-n5"]), 5);
  });

  it("should return numerical value from array consisting length and type seperated", () => {
    equal(getNumOfLines(["-n", 5]), 5);
  });
});

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
