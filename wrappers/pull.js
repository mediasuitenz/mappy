'use strict';

var fs         = require('fs')
var hyperquest = require('hyperquest')

/**
 * Wraps server fetching
 * @param {string} url
 * @param {function} cb
 */
module.exports = (url, cb) => {

  var data = ''

  var req = hyperquest.get(url)

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', () => {
    try {
      cb(null, JSON.parse(data))
    } catch (err) {
      cb(null, data)
    }
  })

  req.on('error', cb)
}
