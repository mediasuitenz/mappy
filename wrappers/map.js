'use strict';

var L            = require('leaflet')
require('leaflet.markercluster')
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
    this.key           = {}
    this.dataServices  = {}
    this.mediator      = mediator()

    this.map.on('click', (event) => this.emit('click', event))
  }

  /**
   * Adds a tile layer to the map with given config
   */
  setTileLayer(name, config) {
    this.tileLayers[name] = mapTileLayer(config.url, config)
    this.map.addLayer(this.tileLayers[name])
  }

  removeTileLayer(name) {
    this.map.removeLayer(this.tileLayers[name])
  }

  /**
   * Add a geojson layer to the map with given config
   */
  setGeojsonLayer(name, config) {
    var options = {
      sortOrder: config.sortOrder
    }
    var map = this
    var layer

    if (config.layerStyle)
      options.style = (feature) => config.layerStyle(feature.properties)

    if (config.listens) {
      config.listens.forEach((listenerConfig) => {
        map.mediator.register(listenerConfig)
      })
    }

    if (config.popupStyle || config.notifies) {
      options.onEachFeature = (feature, layer) => {
        layer.on('click', function () {
          map.emit('marker.click', feature)
        })

        if (!config.popupFilter || config.popupFilter(feature)) {
          if (config.popupStyle) {
            layer.bindPopup(config.popupStyle(feature.properties))
          }
        }

        if (config.notifies) {
          config.notifies.forEach((eventType) => {
            layer.on(eventType, () => map.mediator.notify(eventType, name, feature, map))
          })
        }
      }
    }

    if (config.iconStyle) {
      var iconType = (config.iconStyle({}).type === 'divIcon') ? L.divIcon : L.icon

      options.pointToLayer = (feature, latLng) => L.marker(latLng, { icon: iconType(config.iconStyle(feature.properties)) })
    }

    if (config.geojsonFilter)
      options.filter = (feature) => config.geojsonFilter(feature)

    if (this.geojsonLayers[name]) {
      this.map.removeLayer(this.geojsonLayers[name])
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

    this.sortLayers()

    map.emit('geojson.add', {
      name: name,
      layer: layer
    })
  }

  sortLayers() {
    Object.keys(this.geojsonLayers)
      .map(key => this.geojsonLayers[key])
      .filter(layer => !isNaN(parseInt(nn(layer)('options.sortOrder').val, 10)))
      .sort((a, b) => a.options.sortOrder - b.options.sortOrder)
      .forEach(function (layer) {
        try {
          layer.bringToFront()
        } catch (e) {}
      })
  }

  showGeojsonLayer(name) {
    if (this.geojsonLayers[name]) {
      this.geojsonLayers[name].addTo(this.map)
      this.sortLayers()
    }
  }

  hideGeojsonLayer(name) {
    if (this.geojsonLayers[name])
      this.map.removeLayer(this.geojsonLayers[name])
  }

  stopDataService(name) {
    if (this.dataServices[name])
      this.dataServices[name].stop()
  }

  startDataService(name) {
    if (this.dataServices[name])
      this.dataServices[name].start()
  }

  pushToDataService(name, data) {
    if (this.dataServices[name])
      this.dataServices[name].setData(data)
  }
}


module.exports = function (config) {
  return new Map(config)
}
