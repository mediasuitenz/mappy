'use strict';

var L            = require('leaflet')
require('leaflet-plugins/layer/tile/Google')

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
