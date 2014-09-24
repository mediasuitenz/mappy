'use strict';

var config                     = require('./config')()
var dataServiceFactory         = require('./dataService')
var mapFactory                 = require('../wrappers/map')
var popupPresenterFactory      = require('./popupPresenter')
var layerStylePresenterFactory = require('./layerStylePresenter')

var dataServices = []

var mapConfig = config.getMap()

var map = mapFactory(mapConfig)

//add base tile layer
map.setTileLayer('base-tiles', mapConfig.tileLayers['base-tiles'])

//add feature layers
config.getLayers().forEach((layerConfig) => {

  var dataService = dataServiceFactory(layerConfig.dataSource)
  dataServices.push(dataService)

  var popupPresenter = popupPresenterFactory(layerConfig.styles.popup)
  var layerStylePresenter = layerStylePresenterFactory(layerConfig.styles.layer)

  dataService.on('data', () => {
    map.setGeojsonLayer(layerConfig.name, {
      geojson: dataService.getData(),
      popup: (properties) => popupPresenter.present(properties),
      style: (properties) => layerStylePresenter.present(properties)
    })
  })

  dataService.start()
})


