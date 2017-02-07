'use strict';

var L = require('leaflet')
require('leaflet.gridlayer.googlemutant')

/**
 * Intermediary tile layer used to generate either a Google layer, or a Leaflet tileLayer.
 *
 * @param {string} name
 * @param {object} config
 */
module.exports = function (name, config) {
  var tileLayer = null

  if(config.type === 'google') {
    tileLayer = L.gridLayer.googleMutant((config.mapType ? config.mapType : 'roadmap'))
  } else {
    tileLayer = L.tileLayer(config.url, config)
  }

  return tileLayer
}
