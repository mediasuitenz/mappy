'use strict';

var ConfigParser           = require('./config')
var mapFactory             = require('../wrappers/map')
var popupPresenterFactory  = require('./popupPresenter')
var filterFactory          = require('./geojsonFeatureFilterer')
var stylePresenterFactory  = require('./layerStylePresenter')
var keyFactory             = require('./key')
var tileLayerManager       = require('./tileLayerManager')
var mapKeyController       = require('./keyController')
var geojsonLayerController = require('./geojsonLayerController')
var tileLayerController    = require('./tileLayerController')
var dataServiceController  = require('./dataServiceController')

var create = function (config) {
  config = new ConfigParser(config)
  var mapConfig         = config.getMap()
  var keyConfig         = config.getKey()
  var layerConfigs      = config.getLayers()
  var dataSourceConfigs = config.getDataSources()
  var map               = mapFactory(mapConfig)

  map.on('ready', () => {
    console.log('READY', map)
  })

  dataServiceController = dataServiceController(dataSourceConfigs)
  map.dataServices = dataServiceController.dataServices

  function clickLayer(layerConfig) {
    var layerStylePresenter = stylePresenterFactory(layerConfig.styles.layer)
    var dataService = dataServiceController.getDataServiceForLayer(layerConfig)

    dataService.on('data', () => {
      map.setGeojsonLayer(layerConfig.name, {
        geojson: dataService.getData(),
        style: (properties) => layerStylePresenter.present(properties),
        sortOrder: layerConfig.sortOrder
      })
      map.showGeojsonLayer(layerConfig.name)
    })

    map.on('click', (event) => {
      var lng = event.latlng.lng
      var lat = event.latlng.lat

      dataService.config.request.url = dataService.url.replace('{x}', lng).replace('{y}', lat)
      dataService.start()
    })
  }

  map.on('ready', () => {
    tileLayerController({
      map: map,
      manager: tileLayerManager(mapConfig.tileLayers)
    })

    if (typeof layerConfigs !== 'undefined') {
      var keyController
      if (typeof keyConfig !== 'undefined') {
        var key = keyFactory(keyConfig)
        map.key = key

        keyController = mapKeyController({
          map: map,
          key: key,
          layerNames: config.getLayerNames()
        })
      }
      geojsonLayerController({
        map: map,
        keyController: keyController,
        dataServiceController: dataServiceController,
        popupPresenterFactory: popupPresenterFactory,
        filterFactory: filterFactory,
        stylePresenterFactory: stylePresenterFactory
      }).addLayersFromConfig(layerConfigs)

      //add feature layers
      layerConfigs.forEach((layerConfig) => {
        if (layerConfig.type === 'click')
          clickLayer(layerConfig)
      })
    }
  })

  return map
}

var Mappy = {
  create: create
}

module.exports = Mappy
