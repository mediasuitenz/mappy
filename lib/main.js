'use strict';

var config                     = require('./config')()
var dataServiceFactory         = require('./dataService')
var mapFactory                 = require('../wrappers/map')
var popupPresenterFactory      = require('./popupPresenter')
var layerStylePresenterFactory = require('./layerStylePresenter')
var mapKey                     = require('./mapKey')

var dataServices = []

var mapConfig = config.getMap()

var map = mapFactory(mapConfig)

//add base tile layer
map.setTileLayer('base-tiles', mapConfig.tileLayers['base-tiles'])

var key = mapKey({ domElement: mapConfig.key.domElementId })
key.title = mapConfig.key.title

//add feature layers
config.getLayers().forEach((layerConfig) => {

  key.addItem(layerConfig.name, layerConfig.description)
  key.on('layerToggle', (event) => {
    console.log('layer', event.key, 'toggled from', !event.checked, 'to', event.checked)
  })

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


