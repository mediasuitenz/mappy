'use strict';

var assert         = require('assert')
var isValidGeojson = require('geojson-is-valid')
var util           = require('util')

/**
 * Algorithm for determining if a features properties meet the requirements
 * of the config properties.
 * @param  {object} configProperties
 * @param  {object} featureProperties
 * @return {boolean}
 */
function filterByProperties(configProperties, featureProperties) {
  for (var property in configProperties) {
    if (configProperties.hasOwnProperty(property)) {
      if (configProperties[property].indexOf(featureProperties[property]) !== -1) return true
    }
  }

  return false
}

function filterByGeometryType(geometryConfig, featureType) {
  return (geometryConfig.indexOf(featureType) === -1) ? false : true
}

/**
 * GeojsonFeatureFilterer class
 */
class GeojsonFeatureFilterer {

  /**
   * Constructor
   * @param {object} config
   */
  constructor(config) {
    this.config = config
  }

  /**
   * Takes a geojson feature and determines based on config, whether to
   * include or exclude the feature
   * @param {object} feature - geojson feature
   * @return {boolean} - true = include, false = exclude
   */
  filter(feature) {
    assert.equal(isValidGeojson(feature), true, '`feature` must be valid geojson')

    //handle geometry filtering if specified
    if (this.config.geometry)
      return filterByGeometryType(this.config.geometry, feature.geometry.type)

    //handle properties filtering if specified
    if (this.config.properties)
      return filterByProperties(this.config.properties, feature.properties)

    return true
  }
}

/**
 * Module entry point
 * @param {object} config
 */
module.exports = (config) => {

  //check config
  //ensure config is an object. We don't want things to bail on error
  //better to simply not filter anything instead
  if (typeof config !== 'object' || config === null) config = {}
  if (config.geometry)
    assert.equal(util.isArray(config.geometry), true, '`config.geometry` must be an array')
  if (config.properties)
    assert.equal(typeof(config.properties), 'object', '`config.properties` must be an object')

  return new GeojsonFeatureFilterer(config)
}
