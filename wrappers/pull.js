'use strict';

var xhr = require('xhr')

/**
 * Wraps server fetching
 * @param {string} url
 * @param {function} cb
 */
module.exports = (config, cb) => {

  xhr({
    url: config.url,
    useXDR: config.useXDR === undefined ? true : config.useXDR
  }, function (err, resp, body) {
    if (err) {
      cb(err)
    } else {
      try {
        cb(null, JSON.parse(body))
      } catch (err) {
        cb(err)
      }
    }
  })
}
