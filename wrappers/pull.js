'use strict';

var xhr = require('xhr')
var merge = require('merge')

/**
 * Wraps server fetching
 * @param {string} url
 * @param {function} cb
 */
module.exports = (config, cb) => {

  var xhrOptions = { useXDR: true }
  xhrOptions = merge(xhrOptions, config.request)

  xhr(xhrOptions, function (err, resp, body) {
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
