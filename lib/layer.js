'use strict';

class Layer {
  constructor(dataService, config) {
    this.config = config
    this.dataService = dataService
  }

  getData() {
    return this.dataService.getData()
  }
}

module.exports = function(config) {
  return new Layer(config)
}
