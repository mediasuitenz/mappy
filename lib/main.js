'use strict';

var config             = require('./config')()
var dataServiceFactory = require('./dataService')
var mapFactory         = require('../wrappers/map')
var popupPresenter     = require('./popupPresenter')

var dataServices = []

var mapConfig = config.getMap()

var map = mapFactory(mapConfig)

//add base tile layer
map.setTileLayer('base-tiles', mapConfig.tileLayers['base-tiles'])

//add feature layers
config.getLayers().forEach((layerConfig) => {

  var dataService = dataServiceFactory(layerConfig.dataSource)
  dataServices.push(dataService)

  var presenter = popupPresenter(layerConfig.styles.popup)

  dataService.on('data', () => {
    map.setGeojsonLayer(layerConfig.name, {
      geojson: dataService.getData(),
      popup: (properties) => presenter.present(properties)
    })
  })

  dataService.start()
})


