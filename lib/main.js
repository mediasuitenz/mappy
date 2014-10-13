'use strict';

var config                     = require('./config')()
var dataServiceFactory         = require('./dataService')
var mapFactory                 = require('../wrappers/map')
var popupPresenterFactory      = require('./popupPresenter')
var filterFactory              = require('./geojsonFeatureFilterer')
var stylePresenterFactory      = require('./layerStylePresenter')
var key                        = require('./key')
var tileLayerManager           = require('./tileLayerManager')
var mapKeyController           = require('./keyController')
var tileLayerController        = require('./tileLayerController')

var dataServices    = []
var mapConfig       = config.getMap()
var keyConfig       = config.getKey()
var map             = mapFactory(mapConfig)

tileLayerController({
  map: map,
  manager: tileLayerManager(mapConfig.tileLayers)
})

var keyController = mapKeyController({
  map: map,
  key: key(keyConfig),
  layerNames: config.getLayerNames()
})

var layerConfigs = config.getLayers()

function geojsonLayer(layerConfig) {
  var dataService = dataServiceFactory(layerConfig.dataSource)
  dataServices.push(dataService)

  var popupPresenter       = popupPresenterFactory(layerConfig.styles.popup)
  var popupFilter          = filterFactory(layerConfig.styles.popup.filter)
  var layerStylePresenter  = stylePresenterFactory(layerConfig.styles.layer)
  var iconStylePresenter   = stylePresenterFactory(layerConfig.styles.icon)
  var geojsonFeatureFilter = filterFactory(layerConfig.filter)

  dataService.on('data', () => {
    map.setGeojsonLayer(layerConfig.name, {
      geojson: dataService.getData(),
      popup: (properties) => popupPresenter.present(properties),
      popupFilter: (feature) => popupFilter.filter(feature),
      style: (properties) => layerStylePresenter.present(properties),
      icon: (properties) => iconStylePresenter.present(properties),
      filter: (feature)   => geojsonFeatureFilter.filter(feature)
    })
    if (keyController.getKeyVisibility(layerConfig.name)) map.showGeojsonLayer(layerConfig.name)
    else map.hideGeojsonLayer(layerConfig.name)
  })

  dataService.start()
}

function clickLayer(layerConfig) {
  var layerStylePresenter = stylePresenterFactory(layerConfig.styles.layer)

  map.on('click', (event) => {
    var lng         = event.latlng.lng
    var lat         = event.latlng.lat
    var config      = JSON.parse(JSON.stringify(layerConfig.dataSource))
    var dataService

    config.url  = config.url.replace('{x}', lng).replace('{y}', lat)
    dataService = dataServiceFactory(config)
    dataService.on('data', () => {
      map.setGeojsonLayer(layerConfig.name, {
        geojson: dataService.getData(),
        style: (properties) => layerStylePresenter.present(properties)
      })
      map.showGeojsonLayer(layerConfig.name)
    })

    dataService.start()
  })
}

//add feature layers
layerConfigs.forEach((layerConfig) => {
  if (layerConfig.type === 'geojson')
    geojsonLayer(layerConfig)

  if (layerConfig.type === 'click')
    clickLayer(layerConfig)
})
