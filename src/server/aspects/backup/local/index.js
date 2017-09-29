const fs = require('fs');

module.exports = function(path) {
  const fileStream = new fs.ReadStream(path);

  return fileStream;
};

