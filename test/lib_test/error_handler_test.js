const assert = require("assert");

const {
  getHeadIllegalCountMsg,
  getTailIllegalOffsetMsg,
  getTailNoFileErrorMsg
} = require("../../src/lib/error_handler.js");

//=====================================================================================================

describe("getHeadIllegalCountMsg", function() {
  it("should return illegal line count error msg for n and 0 as input", function() {
    let errorMsg = "head: illegal line count -- 0";
    assert.equal(getHeadIllegalCountMsg("n", 0), errorMsg);
  });

  it("should return illegal line count error msg for n and -5 as input", function() {
    let errorMsg = "head: illegal line count -- -5";
    assert.equal(getHeadIllegalCountMsg("n", -5), errorMsg);
  });

  it("should return illegal byte count error msg for c and 0 as input", function() {
    let errorMsg = "head: illegal byte count -- 0";
    assert.equal(getHeadIllegalCountMsg("c", 0), errorMsg);
  });

  it("should return illegal byte count error msg for c and -2 as input", function() {
    let errorMsg = "head: illegal byte count -- -2";
    assert.equal(getHeadIllegalCountMsg("c", -2), errorMsg);
  });

  it("should return illegal byte count error msg for p and number less than 1 as input", function() {
    let errorMsg = "head: illegal line count -- -1";
    assert.equal(getHeadIllegalCountMsg("p", -1), errorMsg);
  });
});

//=====================================================================================================

describe("getTailIllegalOffsetMsg", function() {
  let errorMsg = "tail: illegal offset -- ";
  it("should return tail illegal offset error msg with 5 for 5 as input", function() {
    assert.equal(getTailIllegalOffsetMsg(5), errorMsg + "5");
  });

  it("should return tail illegal offset error msg with undefined for no input", function() {
    assert.equal(getTailIllegalOffsetMsg(), errorMsg + "undefined");
  });
});

//====================================================================================================

describe("getTailNoFileErrorMsg", () => {
  it("should return no such file found tail error for non existing file", () => {
    let expectedOutput = "tail: file1: No such file or directory";
    assert.equal(getTailNoFileErrorMsg("file1"), expectedOutput);
  });
});
