'use strict';

var fs = require('fs')

/**
 * Wraps server fetching
 * @param {string} url
 * @param {function} cb
 */
module.exports = (url, cb) => {
  //TODO: implement proper server fetching
  cb(null, fs.readFileSync(__dirname + '/../stubs/geojson1.json', 'utf8'))
}
