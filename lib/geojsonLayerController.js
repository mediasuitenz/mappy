'use strict';

var assert = require('assert')
var util   = require('util')
var nn     = require('nevernull')

/**
 * Magic strings object that fills the role of consts
 */
var messages = {
  'map': '`map` must be an object',
  'dataServiceController': '`dataServiceController` must be an object',
  'popupPresenterFactory': '`popupPresenterFactory` must be a function',
  'stylePresenterFactory': '`stylePresenterFactory` must be a function',
  'filterFactory': '`filterFactory` must be a function',
  'configArray': 'arg `config` to `GeojsonLayerController.addLayersFromConfig` must be an array'
}

/**
 * Calls the maps setGeojsonLayer method
 * @param {object} options
 */
function setGeojsonOnMap(options) {
  options.map.setGeojsonLayer(options.name, options)
}

function getStyleFunctionFor(name, options) {
  if (!!options[name]) {
    return (properties) => options[name].present(properties)
  }
}

function getFilterFunctionFor(name, options) {
  if (!!options[name]) {
    return (properties) => options[name].filter(properties)
  }
}

/**
 * Helper to isolate object mapping
 * @param  {object} options
 * @return {object}
 */
function buildGeojsonLayerOptions(options) {
  return {
    map: options.map,
    name: options.name,
    geojson: options.dataService.getData(),
    popupStyle: getStyleFunctionFor('popupPresenter', options),
    popupFilter: getFilterFunctionFor('popupFilter', options),
    layerStyle: getStyleFunctionFor('layerStylePresenter', options),
    iconStyle: getStyleFunctionFor('iconStylePresenter', options),
    geojsonFilter: getFilterFunctionFor('geojsonFeatureFilter', options),
    notifies: options.notifies,
    cluster: options.cluster,
    listens: options.listens,
    sortOrder: options.sortOrder
  }
}

/**
 * Helper to isolate object mapping
 * @param  {object} layer
 * @param  {object} config
 * @return {object}
 */
function buildConfigProcessingOptions(layer, config) {
  return {
    name: layer.name,
    map: config.map,
    key: config.keyController,
    dataService: config.dataServiceController.getDataServiceForLayer(layer),
    popupPresenter: config.popupPresenterFactory(nn(layer)('styles.popup').val),
    popupFilter: config.filterFactory(nn(layer)('styles.popup.filter').val),
    layerStylePresenter: config.stylePresenterFactory(nn(layer)('styles.layer').val),
    iconStylePresenter: config.stylePresenterFactory(nn(layer)('styles.icon').val),
    geojsonFeatureFilter: config.filterFactory(layer.filter),
    notifies: layer.notifies,
    cluster: nn(layer)('styles.icon.cluster').val,
    listens: layer.listens,
    sortOrder: layer.sortOrder
  }
}

/**
 * Handles each individual geojson config object setting up a dataservice to
 * pull geojson data from a server and then placing that data on the map
 * @param  {object} options
 */
function processConfig(options) {
  var dataService = options.dataService
  var name = options.name
  var map = options.map
  var key = options.key

  dataService.on('data', () => {
    setGeojsonOnMap(buildGeojsonLayerOptions(options))

    if (typeof key === 'undefined' || !key.hasLayer(name) || key.getKeyVisibility(name)) {
      map.showGeojsonLayer(name)
    } else {
      map.hideGeojsonLayer(name)
    }

    map.emit('data.update', dataService.data)
  })

  dataService.start()
}

/**
 * Geojson layer controller.
 * Provides an addLayersFromConfig method to take an array of config and
 * place a number of geojson layers on the map
 */
class GeojsonLayerController {

  /**
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Takes a config array, loops through placing each config defined geojson
   * layer on the map
   * @param {object} config
   */
  addLayersFromConfig(config) {
    assert(util.isArray(config), messages.configArray)

    config.forEach((layer) => {
      if (layer.type !== 'geojson') return

      processConfig(buildConfigProcessingOptions(layer, this.config))
    })
  }
}


/**
 * Module entry point. Validates config object input using asserts
 * @param {object} config
 * @return {GeojsonLayerController}
 */
module.exports = (config) => {
  assert.equal(typeof(config.map), 'object', messages.map)
  assert.equal(typeof(config.dataServiceController), 'object', messages.dataServiceController)
  assert.equal(typeof(config.popupPresenterFactory), 'function', messages.popupPresenterFactory)
  assert.equal(typeof(config.stylePresenterFactory), 'function', messages.stylePresenterFactory)
  assert.equal(typeof(config.filterFactory), 'function', messages.filterFactory)

  return new GeojsonLayerController(config)
}
