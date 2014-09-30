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

    //handle properties filtering if specified
    if (this.config.properties) {

      //eg. show in { show: [true, false] }
      for (var property in this.config.properties) {
        if (this.config.properties.hasOwnProperty(property)) {

          //eg. show = true
          if (typeof feature.properties[property] !== 'undefined') {

            //eg. [true, false].indexOf(true) === -1 means is found
            if (this.config.properties[property].indexOf(feature.properties[property]) !== -1) {
              return true
            }

          }

        }
      }
      return false
    }

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
