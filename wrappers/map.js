'use strict';

var L = require('../vendor/leaflet.js')

L.Icon.Default.imagePath = 'http://cdn.leafletjs.com/leaflet-0.7/images'

class Map {

  /**
   * Creates a map with given config
   */
  constructor(config) {
    this.map           = L.map(config.domElementId).fitBounds(config.bounds)
    this.tileLayers    = {}
    this.geojsonLayers = {}
  }

  /**
   * Adds a tile layer to the map with given config
   */
  setTileLayer(name, config) {
    var tileLayerOptions = {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }

    this.tileLayers[name] = L.tileLayer(config.url, tileLayerOptions)
    this.tileLayers[name].addTo(this.map)
  }

  /**
   * Add a geojson layer to the map with given config
   */
  setGeojsonLayer(name, config) {
    var options = {}
    if (config.style)
      options.style = (feature) => config.style(feature.properties)
    if (config.popup)
      options.onEachFeature = (feature, layer) => layer.bindPopup(config.popup(feature.properties))

    if (this.geojsonLayers[name]) {
      this.geojsonLayers[name].removeFrom(this.map)
      delete this.geojsonLayers[name]
    }

    this.geojsonLayers[name] = L.geoJson(config.geojson, options)
    this.geojsonLayers[name].addTo(this.map)
  }
}


module.exports = function (config) {
  return new Map(config)
}
