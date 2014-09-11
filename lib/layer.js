'use strict';

class Layer {
  constructor(config) {
    this.config = config
  }

  getData() {
    return {}
  }
}

module.exports = function(config) {
  return new Layer(config)
}