'use strict';

var config                     = require('./config')()
var dataServiceFactory         = require('./dataService')
var mapFactory                 = require('../wrappers/map')
var popupPresenterFactory      = require('./popupPresenter')
var filterFactory              = require('./geojsonFeatureFilterer')
var stylePresenterFactory      = require('./layerStylePresenter')
var mapKey                     = require('./mapKey')
var sort                       = require('persuasion')
var tileLayerManager           = require('./tileLayerManager')

var dataServices = []

var mapConfig = config.getMap()

var map = mapFactory(mapConfig)

//handle tile layers
var manager = tileLayerManager(mapConfig.tileLayers)
manager.on('add', (name, config) => {
  map.setTileLayer(name, config)
})
manager.on('remove', (name) => {
  map.removeTileLayer(name)
})
manager.start()

var key = mapKey({ domElement: mapConfig.key.domElementId })
key.title = mapConfig.key.title

//sort the config array of layers by key 'sort'
var layerConfigs = config.getLayers()
layerConfigs = sort(layerConfigs, { property: 'sortOrder' });

//add feature layers
layerConfigs.forEach((layerConfig) => {

  var visible = layerConfig.startVisible

  key.addItem(layerConfig.name, layerConfig.description, visible)
  key.on('layerToggle', (event) => {
    if (event.checked) {
      visible = true
      map.showGeojsonLayer(layerConfig.name)
    }
    else {
      visible = false
      map.hideGeojsonLayer(layerConfig.name)
    }
  })

  var dataService = dataServiceFactory(layerConfig.dataSource)
  dataServices.push(dataService)

  var popupPresenter      = popupPresenterFactory(layerConfig.styles.popup)
  var layerStylePresenter = stylePresenterFactory(layerConfig.styles.layer)
  var iconStylePresenter  = stylePresenterFactory(layerConfig.styles.icon)
  var geojsonFeatureFilter = filterFactory(layerConfig.filter)

  dataService.on('data', () => {
    map.setGeojsonLayer(layerConfig.name, {
      geojson: dataService.getData(),
      popup: (properties) => popupPresenter.present(properties),
      style: (properties) => layerStylePresenter.present(properties),
      icon: (properties) => iconStylePresenter.present(properties),
      filter: (feature)   => geojsonFeatureFilter.filter(feature)
    })
    if (visible) map.showGeojsonLayer(layerConfig.name)
    else map.hideGeojsonLayer(layerConfig.name)
  })

  dataService.start()
})


