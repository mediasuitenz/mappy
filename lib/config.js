'use strict';

var assert = require('assert')
var util   = require('util')

class Config {

  constructor(config) {

    this.map         = config.map
    this.layers      = config.layers
    this.key         = config.key
    this.dataSources = config.dataSources

    assert(typeof this.map !== 'undefined', true, 'map config must be present')
    this.validateMapConfig()

    if (typeof this.layers !== 'undefined') {
      this.validateLayersConfig()
    }

    if (typeof this.key !== 'undefined') {
      this.validateKeyConfig()
    }

    if (typeof this.dataSources !== 'undefined') {
      this.validateDataSourceConfig()
    }
  }

  validateLayersConfig() {
    assert(util.isArray(this.layers), 'layers config must be an array')
    this.layers.forEach((layer) => {
      assert.equal(typeof layer, 'object', 'each layer config item must be an object')
      assert(layer.name, '`name` property must be defined for each layer config')
      assert(layer.type, '`type` property must be defined for each layer config')
      assert(layer.dataSource, '`dataSource` property must be defined for each layer config')
    })
  }

  validateMapConfig() {
    assert(this.map.domElementId,
      'map config property `domElementId` must be defined (as a string)')
    assert(this.map.tileLayers,
      'map config property `tileLayers` must be defined (as an object)')
    assert(this.map.bounds, '`bounds` property must be defined for map config eg. ' +
      '"bounds": [[-43.577988,172.515934],[-43.461397,172.749529]]')
    assert(Object.keys(this.map.tileLayers).length > 0,
      'map config property `tileLayers` must have at least 1 tile layer defined. eg. ' +
      '"tileLayers": {"mytiles": {"url": "..."}}')
  }

  validateKeyConfig() {
    assert(this.key.domElementId,
      'key config property `domElementId` must be defined (as a string)')
    assert(this.key.title,
      'key config property `title` must be defined (as a string)')
    assert(util.isArray(this.key.layers),
      'key config property `layers` must be defined (as an array)')
  }

  validateDataSourceConfig() {
    assert(util.isArray(this.dataSources), 'dataSources config must be an array')
    this.dataSources.forEach((dataSource) => {
      assert.equal(typeof dataSource, 'object', 'each dataSource config item must be an object')
      assert(dataSource.name, '`name` property must be defined for each dataSource config')
      assert(dataSource.type, '`type` property must be defined for each dataSource config')
    })
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

  getDataSources() {
    return this.dataSources
  }
}

module.exports = Config
