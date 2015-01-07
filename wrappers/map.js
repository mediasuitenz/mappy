'use strict';

var L            = require('../vendor/leaflet.js')
var EventEmitter = require('events').EventEmitter
var mapTileLayer = require('./tilelayer')

L.Icon.Default.imagePath = 'http://cdn.leafletjs.com/leaflet-0.7/images'

class Map extends EventEmitter {

  /**
   * Creates a map with given config
   */
  constructor(config) {
    this.map           = L.map(config.domElementId).fitBounds(config.bounds)
    this.tileLayers    = {}
    this.geojsonLayers = {}
    this.map.on('click', (event) => this.emit('click', event))
  }

  /**
   * Adds a tile layer to the map with given config
   */
  setTileLayer(name, config) {
    this.tileLayers[name] = mapTileLayer(config.url, config)
    this.tileLayers[name].addTo(this.map)
  }

  removeTileLayer(name) {
    this.tileLayers[name].removeFrom(this.map)
  }

  /**
   * Add a geojson layer to the map with given config
   */
  setGeojsonLayer(name, config) {
    var options = {}
    if (config.style)
      options.style = (feature) => config.style(feature.properties)
    if (config.popup) {
      options.onEachFeature = (feature, layer) => {
        if (!config.popupFilter || config.popupFilter(feature))
          // don't bind the feature popup if it isn't defined in config
          if (config.popup(feature.properties) !== undefined) {
            layer.bindPopup(config.popup(feature.properties))
          }
      }
    }
    if (config.icon)
      options.pointToLayer = (feature, latLng) => L.marker(latLng, { icon: L.icon(config.icon(feature.properties)) })
    if (config.filter)
      options.filter = (feature) => config.filter(feature)

    if (this.geojsonLayers[name]) {
      this.geojsonLayers[name].removeFrom(this.map)
      delete this.geojsonLayers[name]
    }

    this.geojsonLayers[name] = L.geoJson(config.geojson, options)
  }

  showGeojsonLayer(name) {
    this.geojsonLayers[name].addTo(this.map)
  }

  hideGeojsonLayer(name) {
    this.geojsonLayers[name].removeFrom(this.map)
  }
}


module.exports = function (config) {
  return new Map(config)
}
