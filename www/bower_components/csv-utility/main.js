var csvUtility = require('./index.js');
if (typeof global.window.define == 'function' && global.window.define.amd) {
  global.window.define('csvUtility', function () { return csvUtility; });
} else {
  global.window.csvUtility = csvUtility;
}