'use strict';

var dataServiceFactory = require('./dataService')

class Layer {
  constructor(config) {
    this.config = config
    this.dataService = dataServiceFactory(config.dataSource)
  }

  getData() {
    return this.dataService.getData()
  }
}

module.exports = function(config) {
  return new Layer(config)
}