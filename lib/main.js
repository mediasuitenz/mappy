'use strict';

var config                     = require('./config')()
var dataServiceFactory         = require('./dataService')
var mapFactory                 = require('../wrappers/map')
var popupPresenterFactory      = require('./popupPresenter')
var layerStylePresenterFactory = require('./layerStylePresenter')
var iconStylePresenterFactory  = require('./iconStylePresenter')
var mapKey                     = require('./mapKey')
var sort                       = require('persuasion')

var dataServices = []

var mapConfig = config.getMap()

var map = mapFactory(mapConfig)

//add base tile layer
map.setTileLayer('base-tiles', mapConfig.tileLayers['base-tiles'])

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
  var layerStylePresenter = layerStylePresenterFactory(layerConfig.styles.layer)
  var iconStylePresenter  = iconStylePresenterFactory(layerConfig.styles.icon)

  dataService.on('data', () => {
    map.setGeojsonLayer(layerConfig.name, {
      geojson: dataService.getData(),
      popup: (properties) => popupPresenter.present(properties),
      style: (properties) => layerStylePresenter.present(properties),
      icon: (properties) => iconStylePresenter.present(properties)
    })
    if (visible) map.showGeojsonLayer(layerConfig.name)
    else map.hideGeojsonLayer(layerConfig.name)
  })

  dataService.start()
})


