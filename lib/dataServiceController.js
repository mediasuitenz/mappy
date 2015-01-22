'use strict';

var assert = require('assert')

var dataServiceFactory = require('./dataService')

function createDataServices(config) {
  var dataServices = {}

  config.forEach((dsConfig) => {
    dataServices[dsConfig.name] = dataServiceFactory(dsConfig)
  })

  return dataServices
}

/**
 * DataService controller.
 * Provides a getDataServiceForLayer method to take a layer config and
 * return a predefined DataService
 */
class DataServiceController {

  /**
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    this.config = config

    this.dataServices = createDataServices(config)
  }

  /**
   * Convenience method to retrieve a dataSource for the given layerConfig definition
   * Also verifies that the layer references a known dataSource
   */
  getDataServiceForLayer(layerConfig) {
    assert.ok(!!this.dataServices[layerConfig.dataSource], 'Layer ' + layerConfig.name + ' specifies a dataSource that doesn\'t exist')

    return this.dataServices[layerConfig.dataSource]
  }
}


/**
 * Module entry point. Validates config object input using asserts
 * @param {object} config
 * @return {DataServiceController}
 */
module.exports = (config) => {
  return new DataServiceController(config)
}