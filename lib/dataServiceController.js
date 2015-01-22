'use strict';

var dataServiceFactory = require('./dataService')

function createDataServices(config) {
  var dataServices = {}

  config.forEach((dsConfig) => {
    dataServices[dsConfig.name] = {
      dataService: dataServiceFactory(dsConfig),
      config: dsConfig
    }
  })

  return dataServices
}

/**
 * DataService controller.
 * Provides an getDataServiceForLayer method to take a layer config and
 * return a predefined DataService or create a new one
 */
class DataServiceController {

  /**
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    this.config = config

    console.error = config

    this.dataServices = createDataServices(config)
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