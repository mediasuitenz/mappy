'use strict';

var GoogleMapsLoader = require('google-maps')

module.exports = { create: function (config) {
  if (config.map.googleKey) GoogleMapsLoader.KEY = config.map.googleKey
  if (config.map.googleClient) GoogleMapsLoader.CLIENT = config.map.googleClient
  if (config.map.googleVersion) GoogleMapsLoader.VERSION = config.map.googleVersion
  if (config.map.googleLibraries) GoogleMapsLoader.LIBRARIES = config.map.googleLibraries
  if (config.map.googleLanguage) GoogleMapsLoader.LANGUAGE = config.map.googleLanguage
  if (config.map.googleRegion) GoogleMapsLoader.REGION = config.map.googleRegion

  GoogleMapsLoader.load(google => onLoad(google, config))
}}

function onLoad(google, config) {
  const mapConfig = config.map
  const map = new google.maps.Map(document.getElementById(mapConfig.domElementId), mapConfig.mapOptions)
  console.log(mapConfig.bounds)
  if (mapConfig.bounds) map.fitBounds(mapConfig.bounds)

  if (mapConfig.traffic) new google.maps.TrafficLayer().setMap(map)

  // const dataSources = {}
  // if (Array.isArray(config.dataSources)) {
  //   config.dataSources.forEach(dataSource => {
  //     dataSources[dataSource.name] = dataSource
  //   })
  // }

  const layers = {}

  config.layers.forEach(layerConfig => {
    const dataObj = new google.maps.Data()
    dataObj.loadGeoJson(layerConfig.url, layerConfig)
    if (layerConfig.styles && typeof layerConfig.styles.icon === 'object') {
      layerConfig.styles.icon = formatIcon(google, layerConfig.styles.icon)
    }
    dataObj.setStyle(layerConfig.styles)
    // dataObj.setStyle(feature => {

    // })
    dataObj.setMap(map)
    layers[layerConfig.name] = {
      dataObj: dataObj,
      config: layerConfig
    }
  })
}
const iconProps = {
  anchor: 'Point',
  labelOrigin: 'Point',
  origin: 'Point',
  scaledSize: 'Size',
  size: 'Size',
  url: null
}

function formatIcon (google, iconConfig) {
  const processedConfig = {}
  Object.keys(iconProps).forEach(key => {
    if (iconConfig[key]) {
      const type = iconProps[key]
      if (type) {
        processedConfig[key] = new google.maps[type](iconConfig[key][0], iconConfig[key][1])
      } else {
        processedConfig[key] = iconConfig[key]
      }
    }
  })
  return processedConfig
}
