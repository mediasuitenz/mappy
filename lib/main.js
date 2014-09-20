'use strict';

var config             = require('./config')()
var dataServiceFactory = require('./dataService')
var mapFactory         = require('../wrappers/map')
var dataService

var mapConfig = config.getMap()

var map = mapFactory(mapConfig)

//add base tile layer
map.setTileLayer('base-tiles', mapConfig.tileLayers['base-tiles'])

//add feature layers
config.getLayers().forEach((layerConfig) => {
  dataService = dataServiceFactory(layerConfig.dataSource)
  dataService.on('data', () => {
    map.setGeojsonLayer(layerConfig.name, { geojson: dataService.getData() })
  })
  dataService.start()
})


