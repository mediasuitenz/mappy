'use strict';

var L            = require('../vendor/leaflet.js')
require('../vendor/leaflet.markercluster-src.js')(L)
var EventEmitter = require('events').EventEmitter
var mapTileLayer = require('./tilelayer')
var mediator     = require('../lib/mediator')
var nn           = require('nevernull')

L.Icon.Default.imagePath = 'http://cdn.leafletjs.com/leaflet-0.7/images'

class Map extends EventEmitter {

  /**
   * Creates a map with given config
   */
  constructor(config) {
    this.map           = L.map(config.domElementId, config.mapOptions).fitBounds(config.bounds)
    this.tileLayers    = {}
    this.geojsonLayers = {}
    this.map.on('click', (event) => this.emit('click', event))
    this.mediator      = mediator()
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
    var map = this
    var layer

    if (config.style)
      options.style = (feature) => config.style(feature.properties)
    if (config.listens) {
      config.listens.forEach((listenerConfig) => {
        map.mediator.register(listenerConfig)
      })
    }
    if (config.popup || config.notifies) {
      options.onEachFeature = (feature, layer) => {
        layer.on('click', function () {
          map.emit('marker.click', feature)
        })

        if (!config.popupFilter || config.popupFilter(feature)) {

          // don't bind the feature popup if it isn't defined in config
          if (typeof config.popup(feature.properties) !== 'undefined') {
            layer.bindPopup(config.popup(feature.properties))
          }
        }

        if (config.notifies) {
          config.notifies.forEach((eventType) => {
            layer.on(eventType, () => map.mediator.notify(eventType, name, feature, map))
          })
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

    // if clustering is defined then add a marker cluster layer
    // else add a geoJson layer
    if (nn(config)('cluster').val) {

      // if an icon is supplied use it
      // unless showClusterCount is also specified, then show a DivIcon with supplied config
      if (nn(config)('cluster.icon').val) {
        if (nn(config)('cluster.icon.showClusterCount').val) {
          config.cluster.iconCreateFunction = function (cluster) {
            var iconClass = config.cluster.icon.iconClass !== 'undefined' ? config.cluster.icon.iconClass : 'cluster-icon'

            config.cluster.icon.html = '<div class="' + iconClass + '"><div class="cluster-count">' + cluster.getChildCount() + '</div></div>'
            return L.divIcon(config.cluster.icon)
          }
        } else {
          config.cluster.iconCreateFunction = function () {
            return L.icon(config.cluster.icon)
          }
        }
      }

      layer = new L.MarkerClusterGroup(config.cluster)
      layer.addLayer(L.geoJson(config.geojson, options))
    } else {
      layer = L.geoJson(config.geojson, options)
    }

    this.geojsonLayers[name] = layer
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
