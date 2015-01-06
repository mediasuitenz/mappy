'use strict';

var assert         = require('assert')
var isValidGeojson = require('geojson-is-valid')
var util           = require('util')

/**
 * Algorithm for determining if a GeoJSON feature's properties meet the requirements
 * specified in config properties.
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

/**
 * Determines if a features type meets the requirements of the config given
 * @param  {object} geometryConfig
 * @param  {object} featureType
 * @return {boolean}
 */
function filterByGeometryType(geometryConfig, featureType) {
  /*jshint -W018 */
  return !(geometryConfig.indexOf(featureType) === -1)
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
   * Takes a GeoJSON feature and determines based on config, whether to
   * include or exclude the feature
   * @param {object} feature - GeoJSON feature
   * @return {boolean} - true = include, false = exclude
   */
  filter(feature) {
    if (this.config.validateJSON !== false && isValidGeojson(feature) === false) {
      if (typeof console !== 'undefined') {
        console.log('Invalid GeoJSON Feature:');
        console.log(feature);
      }
      return false;
    }

    //handle geometry filtering if specified
    if (this.config.geometry)
      if (!filterByGeometryType(this.config.geometry, feature.geometry.type)) return false

    //handle properties filtering if specified and if geometry filtering hasnt already
    //failed
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
