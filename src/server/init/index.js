var fileList = [
  'db',
  'jobInfoSub',
  'nodeInfoSub'
];

module.exports = function (config) {
  fileList.forEach(function (fileName) {
    require('./' + fileName)(config);
  });
};

