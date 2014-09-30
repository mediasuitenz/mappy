'use strict';

var assert         = require('assert')
var isValidGeojson = require('geojson-is-valid')
var util           = require('util')

function filterByProperties(configProperties, featureProperties) {
  for (var property in configProperties) {
    if (configProperties.hasOwnProperty(property)) {
      if (configProperties[property].indexOf(featureProperties[property]) !== -1) return true
    }
  }

  return false
}

class GeojsonFeatureFilterer {

  constructor(config) {
    this.config = config
  }

  filter(feature) {
    assert.equal(isValidGeojson(feature), true, '`feature` must be valid geojson')

    //handle geometry filtering if specified
    if (this.config.geometry)
      if (this.config.geometry.indexOf(feature.geometry.type) === -1) return false

    //handle properties filtering if specified
    if (this.config.properties)
      return filterByProperties(this.config.properties, feature.properties)

    return true
  }
}

module.exports = (config) => {

  //check config
  //ensure config is an object. We don't want things to bail on error
  //better to simply not filter anything instead
  if (typeof config !== 'object') config = {}
  if (config.geometry)
    assert.equal(util.isArray(config.geometry), true, '`config.geometry` must be an array')
  if (config.properties)
    assert.equal(typeof(config.properties), 'object', '`config.properties` must be an object')

  return new GeojsonFeatureFilterer(config)
}
