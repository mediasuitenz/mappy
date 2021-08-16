'use strict';

var L            = require('leaflet')
var GoogleMapsLoader = require('google-maps')
require('leaflet.markercluster')
var EventEmitter = require('events').EventEmitter
var mapTileLayer = require('./tilelayer')
var mediator     = require('../lib/mediator')
var nn           = require('nevernull')

L.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images'

function coordsToLiteral (coords) {
  return {
    lat: coords[0],
    lng: coords[1]
  }
}

class Map extends EventEmitter {

  /**
   * Creates a map with given config
   */
  constructor(config) {
    this.originalConfig = config
    this.tileLayers    = {}
    this.geojsonLayers = {}
    this.key           = {}
    this.dataServices  = {}
    this.mediator      = mediator()
    this.isGoogle = config.type === 'google'
  }

  /**
   * Adds a tile layer to the map with given config
   */
  setTileLayer(name, config) {
    if (this.isGoogle) {
      this.map.set('mapTypeId', config.mapType)
    } else {
      this.tileLayers[name] = mapTileLayer(config.url, config)
      this.map.addLayer(this.tileLayers[name])
    }
  }

  removeTileLayer(name) {
    this.map.removeLayer(this.tileLayers[name])
  }

  /**
   * Add a geojson layer to the map with given config
   */
  setGeojsonLayer(name, config) {
    console.log('SET LAYER PARENT?', name, config)
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
    // Note if using Google sorting will need to be done via zIndex
    Object.keys(this.geojsonLayers)
      .map(key => this.geojsonLayers[key])
      .filter(layer => !isNaN(parseInt(nn(layer)('options.sortOrder').val, 10)))
      .sort((a, b) => a.options.sortOrder - b.options.sortOrder)
      .forEach(function (layer) {
        try {
          layer.bringToFront()
        } catch (e) {
          console.error('Error sorting layers', e)
        }
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
    if (this.dataServices[name]) {
      this.dataServices[name].setData(data)
    }
  }
}

class GoogleMap extends Map {
  constructor(config) {
    super(config)
    if (config.googleKey) GoogleMapsLoader.KEY = config.googleKey
    if (config.googleClient) GoogleMapsLoader.CLIENT = config.googleClient
    if (config.googleVersion) GoogleMapsLoader.VERSION = config.googleVersion
    if (config.googleLibraries) GoogleMapsLoader.LIBRARIES = config.googleLibraries
    if (config.googleLanguage) GoogleMapsLoader.LANGUAGE = config.googleLanguage
    if (config.googleRegion) GoogleMapsLoader.REGION = config.googleRegion
    GoogleMapsLoader.load(google => {
      this.google = google
      this.map = new google.maps.Map(document.getElementById(config.domElementId), config.mapOptions)
      this.map.fitBounds(new google.maps.LatLngBounds(coordsToLiteral(config.bounds[0]), coordsToLiteral(config.bounds[1])))
      this.map.addListener('click', (event) => this.emit('click', event))
      this.emit('ready', this)
    })
  }


  /**
   * Add a geojson layer to the map with given config
   */
  setGeojsonLayer(name, config) {
    console.log('SET LAYER GOOGLE', name, config)
    var options = {
      style: {
        zIndex: config.sortOrder
      }
    }
    // var map = this
    // var layer

    if (config.layerStyle) {
      options.style = (feature) => {
        // Rebuild properties because google doesn't give them to you in 1
        const properties = {}
        feature.forEachProperty((v, k) => properties[k] = v)
        var style = config.layerStyle(properties)
        if (!style.zIndex && config.sortOrder) {
          style.zIndex = config.sortOrder
        }
        if (config.iconStyle) {
          style.icon = new this.google.maps.Icon(config.iconStyle(properties))
        }
        return style
      }
    }

    // if (config.listens) {
    //   config.listens.forEach((listenerConfig) => {
    //     map.mediator.register(listenerConfig)
    //   })
    // }

    // if (config.popupStyle || config.notifies) {
    //   options.onEachFeature = (feature, layer) => {
    //     layer.on('click', function () {
    //       map.emit('marker.click', feature)
    //     })

    //     if (!config.popupFilter || config.popupFilter(feature)) {
    //       if (config.popupStyle) {
    //         layer.bindPopup(config.popupStyle(feature.properties))
    //       }
    //     }

    //     if (config.notifies) {
    //       config.notifies.forEach((eventType) => {
    //         layer.on(eventType, () => map.mediator.notify(eventType, name, feature, map))
    //       })
    //     }
    //   }
    // }

    if (config.iconStyle) {
      // var iconType = (config.iconStyle({}).type === 'divIcon') ? L.divIcon : L.icon

      // options.pointToLayer = (feature, latLng) => L.marker(latLng, { icon: iconType(config.iconStyle(feature.properties)) })

      // todo icon locations need to be google.maps.Points
      options.style.icon = new this.google.maps.Icon(config.iconStyle({}))
      console.log('HAVE AN ICON', options.style)
    }

    // if (config.geojsonFilter)
    //   options.filter = (feature) => config.geojsonFilter(feature)

    // if (this.geojsonLayers[name]) {
    //   this.map.removeLayer(this.geojsonLayers[name])
    //   delete this.geojsonLayers[name]
    // }

    // // if clustering is defined then add a marker cluster layer
    // // else add a geoJson layer
    // if (nn(config)('cluster').val) {

    //   // if an icon is supplied use it
    //   // unless showClusterCount is also specified, then show a DivIcon with supplied config
    //   if (nn(config)('cluster.icon').val) {
    //     if (nn(config)('cluster.icon.showClusterCount').val) {
    //       config.cluster.iconCreateFunction = function (cluster) {
    //         var iconClass = config.cluster.icon.iconClass !== 'undefined' ? config.cluster.icon.iconClass : 'cluster-icon'

    //         config.cluster.icon.html = '<div class="' + iconClass + '"><div class="cluster-count">' + cluster.getChildCount() + '</div></div>'
    //         return L.divIcon(config.cluster.icon)
    //       }
    //     } else {
    //       config.cluster.iconCreateFunction = function () {
    //         return L.icon(config.cluster.icon)
    //       }
    //     }
    //   }

    //   layer = new L.MarkerClusterGroup(config.cluster)
    //   layer.addLayer(L.geoJson(config.geojson, options))
    // } else {
    //   layer = L.geoJson(config.geojson, options)
    // }

    if (this.geojsonLayers[name]) {
      this.map.removeLayer(this.geojsonLayers[name])
      delete this.geojsonLayers[name]
    }

    console.log(options)
    var layer = new this.google.maps.Data(options)
    try {
    const convertCoords = (coords) => {
      const newCoords = []
      coords.forEach(innerCoords => {
        if (Array.isArray(innerCoords)) {
          newCoords.push(convertCoords(innerCoords))
        } else {
          newCoords.push(Number(innerCoords))
        }
      })
      return newCoords
    }
    if (Array.isArray(nn(config)('geojson.features').val)) {
      config.geojson.features.forEach(feature => {
        if (Array.isArray(nn(feature)('geometry.coordinates').val)) {
          feature.geometry.coordinates = convertCoords(feature.geometry.coordinates)
        }
      })
    } else if (Array.isArray(nn(config)('geojson.geometry.coordinates').val)) {
      feature.geometry.coordinates = convertCoords(feature.geometry.coordinates)
    }
      layer.addGeoJson(config.geojson, { idPropertyName: 'ID' })
    } catch (e) {
      console.log(e)
    }
    this.geojsonLayers[name] = layer

    this.sortLayers()

    this.emit('geojson.add', {
      name: name,
      layer: layer
    })
  }

  showGeojsonLayer(name) {
    console.log('show LAYER?', name)
    if (this.geojsonLayers[name]) {
      this.geojsonLayers[name].setMap(this.map)
      this.sortLayers()
    }
  }

  hideGeojsonLayer(name) {
    if (this.geojsonLayers[name]) {
      this.geojsonLayers[name].setMap()
    }
  }
}

class LeafletMap extends Map {
  constructor(config) {
    super(config)
    this.map = L.map(config.domElementId, config.mapOptions).fitBounds(config.bounds)
    this.map.on('click', (event) => this.emit('click', event))
    setTimeout(() => this.emit('ready', this), 1)
  }
}

module.exports = function (config) {
  return config.type === 'google' ? new GoogleMap(config) : new LeafletMap(config)
}
