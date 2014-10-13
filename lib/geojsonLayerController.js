'use strict';

var assert = require('assert')

var messages = {
  'map': '`map` must be a Map object',
  'keyController': '`keyController` must be a KeyController object',
  'dataServiceFactory': '`dataServiceFactory` must be a function',
  'popupPresenterFactory': '`popupPresenterFactory` must be a function',
  'stylePresenterFactory': '`stylePresenterFactory` must be a function',
  'filterFactory': '`filterFactory` must be a function'
}

function instanceOf(obj) {
  if (!obj || !obj.constructor) return
  return obj.constructor.name
}

function setGeojsonOnMap(options) {
  options.map.setGeojsonLayer(options.name, options)
}

function buildGeojsonLayerOptions(options) {
  return {
    map: options.map,
    name: options.name,
    geojson: options.dataService.getData(),
    popup: (properties) => options.popupPresenter.present(properties),
    popupFilter: (feature) => options.popupFilter.filter(feature),
    style: (properties) => options.layerStylePresenter.present(properties),
    icon: (properties) => options.iconStylePresenter.present(properties),
    filter: (feature)   => options.geojsonFeatureFilter.filter(feature)
  }
}

function buildConfigProcessingOptions(layer, config) {
  return {
    name: layer.name,
    map: config.map,
    key: config.keyController,
    dataService: config.dataServiceFactory(layer.dataSource),
    popupPresenter: config.popupPresenterFactory(layer.styles.popup),
    popupFilter: config.filterFactory(layer.styles.popup.filter),
    layerStylePresenter: config.stylePresenterFactory(layer.styles.layer),
    iconStylePresenter: config.stylePresenterFactory(layer.styles.icon),
    geojsonFeatureFilter: config.filterFactory(layer.filter)
  }
}

function processConfig(options) {
  var dataService = options.dataService
  var name = options.name
  var map = options.map
  var key = options.key

  dataService.on('data', () => {
    setGeojsonOnMap(buildGeojsonLayerOptions(options))

    if (key.getKeyVisibility(name)) map.showGeojsonLayer(name)
    else map.hideGeojsonLayer(name)
  })

  dataService.start()
}


class GeojsonLayerController {

  constructor(config) {
    this.config = config
  }

  addLayersFromConfig(config) {
    config.forEach((layer) => {
      if (layer.type !== 'geojson') return

      processConfig(buildConfigProcessingOptions(layer, this.config))
    })
  }
}



module.exports = (config) => {
  assert.equal(instanceOf(config.map), 'Map', messages.map)
  assert.equal(instanceOf(config.keyController), 'KeyController', messages.keyController)
  assert.equal(typeof(config.dataServiceFactory), 'function', messages.dataServiceFactory)
  assert.equal(typeof(config.popupPresenterFactory), 'function', messages.popupPresenterFactory)
  assert.equal(typeof(config.stylePresenterFactory), 'function', messages.stylePresenterFactory)
  assert.equal(typeof(config.filterFactory), 'function', messages.filterFactory)

  return new GeojsonLayerController(config)
}
