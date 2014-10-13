'use strict';

var fs     = require('fs')
var layers = fs.readFileSync(__dirname + '/../config/layers.json', 'utf8')
var map    = fs.readFileSync(__dirname + '/../config/map.json', 'utf8')
var key    = fs.readFileSync(__dirname + '/../config/key.json', 'utf8')

class Config {

  constructor() {
    this.layers = JSON.parse(layers)
    this.map    = JSON.parse(map)
    this.key    = JSON.parse(key)
  }

  getLayers() {
    return this.layers
  }

  getLayerNames() {
    return this.layers.map((layer) => {
      return layer.name
    })
  }

  getMap() {
    return this.map
  }

  getKey() {
    return this.key
  }
}

module.exports = function() {
  return new Config()
}
