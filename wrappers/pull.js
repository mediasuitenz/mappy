'use strict';

var xhr = require('xhr')

/**
 * Wraps server fetching
 * @param {string} url
 * @param {function} cb
 */
module.exports = (url, cb) => {

  xhr({
    url: url,
    useXDR: true
  }, function (err, resp, body) {
    if (err) {
      console.error(err)
      cb(err)
    } else {
      try {
        cb(null, JSON.parse(body))
      } catch (err) {
        console.error(err)
        cb(err)
      }
    }
  })
}
