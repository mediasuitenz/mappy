'use strict';

var assert = require('assert')
var merge  = require('object-merge')
var each   = require('foreach')

/**
 * Looks up config and gets style rules object for a given property
 * @param  {string|number|boolean} propertyValue
 * @param  {object} configProperties
 * @return {object}
 */
function styleRulesForPropertyValue(propertyValue, configProperties) {
  assert.ok(propertyValue, '`propertyValue` must not be undefined')
  assert.equal(typeof (configProperties), 'object', '`configProperties` must be an object')

  if (!!configProperties[propertyValue]) {
    return configProperties[propertyValue]
  }
}

/**
 * Merges base styles object with an additional styles object, properties in
 * both with be overwritten by additionalStyles
 * @param  {object} baseStyles
 * @param  {object} additionalStyles
 * @return {object}
 */
function mergeStyles(baseStyles, additionalStyles) {
  assert.equal(typeof (baseStyles), 'object', '`baseStyles` must be an object')
  assert.equal(typeof (additionalStyles), 'object', '`additionalStyles` must be an object')

  return merge(baseStyles, additionalStyles)
}

/**
 * Returns an styles object by looking up config for style definitions matching
 * the properties in the given properties object.
 * @param  {object} properties
 * @param  {object} config
 * @return {object}
 */
function buildStylesForProperties(properties, config) {
  assert.equal(typeof (properties), 'object', '`properties` must be an object')
  assert.equal(typeof (config), 'object', '`config` must be an object')

  var styles = {}
  each(properties, (value, key) => {
    // If the config style matches on the current property key
    if (!!config[key]) {
      styles = merge(styles, (styleRulesForPropertyValue(value, config[key]) || {}))
    }
  })
  return styles
}

/**
 * LayerStylePresenter class
 * Takes a config object and provides a present function to be used for each
 * geojson feature to generate map feature styles
 */
class LayerStylePresenter {

  /**
   * Sets config input
   */
  constructor(config) {
    assert.equal(typeof (config), 'object', '`config` must be an object')
    assert.equal(typeof (config.general), 'object', '`config.general` must be an object')

    this.config = config
  }

  /**
   * Takes an object with various properties and returns an object containing
   * map style rules
   * @param {object} properties
   * @return {object}
   */
  present(properties) {
    assert.equal(typeof (properties), 'object', '`properties` should be an object')
    if(!this.config.properties) return this.config.general

    var baseStyles = this.config.general
    var propertyStyles = buildStylesForProperties(properties, this.config.properties)
    return mergeStyles(baseStyles, propertyStyles)
  }
}

module.exports = (config) => new LayerStylePresenter(config)
