'use strict';

var fs     = require('fs')
var layers = fs.readFileSync(__dirname + '/../layers.json', 'utf8')
var map    = fs.readFileSync(__dirname + '/../map.json', 'utf8')

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
