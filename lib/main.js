'use strict';

var ConfigParser           = require('./config')
var dataServiceFactory     = require('./dataService')
var mapFactory             = require('../wrappers/map')
var popupPresenterFactory  = require('./popupPresenter')
var filterFactory          = require('./geojsonFeatureFilterer')
var stylePresenterFactory  = require('./layerStylePresenter')
var key                    = require('./key')
var tileLayerManager       = require('./tileLayerManager')
var mapKeyController       = require('./keyController')
var geojsonLayerController = require('./geojsonLayerController')
var tileLayerController    = require('./tileLayerController')

var create = function (config) {
  config = new ConfigParser(config)
  var mapConfig    = config.getMap()
  var keyConfig    = config.getKey()
  var layerConfigs = config.getLayers()
  var map          = mapFactory(mapConfig)

  tileLayerController({
    map: map,
    manager: tileLayerManager(mapConfig.tileLayers)
  })

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

  if (typeof layerConfigs !== 'undefined') {
    var keyController
    if (typeof keyConfig !== 'undefined') {
      keyController = mapKeyController({
        map: map,
        key: key(keyConfig),
      layerNames: config.getLayerNames()
      })
    }

    geojsonLayerController({
      map: map,
      keyController: keyController,
      dataServiceFactory: dataServiceFactory,
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
}

var Mappy = {
  create: create
}

module.exports = Mappy
