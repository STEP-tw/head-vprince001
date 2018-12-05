const classifyDetails = function(details) { 
  if(!details) {return {};};
  return {
    option : details[0],
    length : +details[1],
    files : details.splice(2)
  };
};

const extractLines = function(length, contents) {
  return contents.split("\n").splice(0,length).join("\n");
};

const extractCharacters = function(length, contents) {
  return contents.split("").splice(0,length).join("");
};

module.exports = { classifyDetails, extractLines, extractCharacters };
