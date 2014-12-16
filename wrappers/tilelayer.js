'use strict';

var L            = require('../vendor/leaflet.js')
require('../vendor/leaflet-plugins-google')

/**
 * Intermediary tile layer used to generate either a Google layer, or a Leaflet tileLayer.
 *
 * @param {string} name
 * @param {object} config
 */
module.exports = function (name, config) {
  var tileLayer = null

  if(config.type === 'google') {
    tileLayer = new L.Google((config.mapType ? config.mapType : 'ROADMAP'))
  } else {
    tileLayer = L.tileLayer(config.url, config)
  }

  return tileLayer
}
