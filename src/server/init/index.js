var fileList = [
  'db',
];

module.exports = function (config) {
  fileList.forEach(function (fileName) {
    require('./' + fileName)(config);
  });
};

