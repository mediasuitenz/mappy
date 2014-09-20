'use strict';

var EventEmitter = require('events').EventEmitter

class Layer extends EventEmitter {
  constructor(dataService, config) {
    this.config = config
    this.dataService = dataService

    dataService.on('data', () => this.emit('data'))
    dataService.start()
  }

  getData() {
    return this.dataService.getData()
  }
}

module.exports = function(dataService, config) {
  return new Layer(dataService, config)
}
