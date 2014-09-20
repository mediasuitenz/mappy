'use strict';

var config             = require('./config')()
var dataServiceFactory = require('./dataService')
var layerFactory       = require('./layer')
var mapFactory         = require('../wrappers/map')
var layer, dataService

var mapConfig = config.getMap()

var map = mapFactory(mapConfig)

var placeLayerOnMap = (map, layer, config) => {
  var data = layer.getData()
  config.geojson = data
  map.setGeojsonLayer(config.name, config)
}

//add base tile layer
map.setTileLayer('base-tiles', mapConfig.tileLayers['base-tiles'])

//add feature layers
config.getLayers().forEach((layerConfig) => {
  var type = layerConfig.dataSource.type
  var config = layerConfig.dataSource
  dataService = dataServiceFactory(type, config)
  dataService.on('data', () => placeLayerOnMap(map, layer, layerConfig))
})


