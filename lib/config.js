'use strict';

var read   = require('fs').readFileSync
  , layers = read(__dirname + '/../layers.json', 'utf8')
  , map    = read(__dirname + '/../map.json', 'utf8')

class Config {

  constructor() {
    this.layers = JSON.parse(layers)
    this.map    = JSON.parse(map)
  }

  getLayers() {
    return this.layers
  }

  getMap() {
    return this.map
  }
}

module.exports = function() {
  return new Config()
}
