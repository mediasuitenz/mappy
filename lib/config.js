'use strict';

var read   = require('fs').readFileSync
  , layers = read(__dirname + '/../layers.json', 'utf8')

class Config {

  constructor() {
    this.layers = JSON.parse(layers)
  }

  getLayers() {
    return this.layers
  }
}

module.exports = function() {
  return new Config()
}
