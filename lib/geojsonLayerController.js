'use strict';

var assert = require('assert')

var messages = {
  'Map': '`map` must be a Map object',
  'MapKeyController': '`mapKeyController` must be a MapKeyController object',
  'DataService': '`dataServiceFactory` must be a DataService object',
  'PopupPresenter': '`popupPresenterFactory` must be a PopupPresenter object',
  'LayerStylePresenter': '`stylePresenterFactory` must be a LayerStylePresenter object',
  'GeojsonFeatureFilter': '`filterFactory` must be a GeojsonFeatureFilter object'
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
  assert.equal(instanceOf(config.map), 'Map', messages.Map)
  assert.equal(instanceOf(config.keyController), 'MapKeyController', messages.MapKeyController)
  assert.equal(typeof(config.dataServiceFactory), 'function', messages.DataService)
  assert.equal(typeof(config.popupPresenterFactory), 'function', messages.PopupPresenter)
  assert.equal(typeof(config.stylePresenterFactory), 'function', messages.LayerStylePresenter)
  assert.equal(typeof(config.filterFactory), 'function', messages.GeojsonFeatureFilter)

  return new GeojsonLayerController(config)
}
