'use strict';

var assert         = require('assert')
var isValidGeojson = require('geojson-is-valid')
var util           = require('util')

class GeojsonFeatureFilterer {

  constructor(config) {
    this.config = config
  }

  filter(feature) {
    assert.equal(isValidGeojson(feature), true, '`feature` must be valid geojson')

    //handle geometry filtering if specified
    if (this.config.geometry)
      if (this.config.geometry.indexOf(feature.geometry.type) === -1) return false

    //TODO handle properties

    return true
  }
}

module.exports = (config) => {
  assert.equal(typeof (config), 'object', '`config` must be an object')
  assert.equal(!!(config.geometry || config.properties), true,
    'At least 1 of `config.geometry` and `config.properties` must be set')
  if (config.geometry)
    assert.equal(util.isArray(config.geometry), true, '`config.geometry` must be an array')
  if (config.properties)
    assert.equal(typeof(config.properties), 'object', '`config.properties` must be an object')

  return new GeojsonFeatureFilterer(config)
}
