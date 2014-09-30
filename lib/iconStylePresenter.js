'use strict';

var assert = require('assert')
var merge  = require('object-merge')
var each   = require('foreach')

function styleRulesForPropertyValue(propertyValue, configProperties) {
  assert.ok(propertyValue, '`propertyValue` must not be undefined')
  assert.equal(typeof (configProperties), 'object', '`configProperties` must be an object')

  if (!!configProperties[propertyValue]) {
    return configProperties[propertyValue]
  }
}

function mergeStyles(baseStyles, additionalStyles) {
  assert.equal(typeof (baseStyles), 'object', '`baseStyles` must be an object')
  assert.equal(typeof (additionalStyles), 'object', '`additionalStyles` must be an object')

  return merge(baseStyles, additionalStyles)
}

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

class IconStylePresenter {

  constructor(config) {
    assert.equal(typeof (config), 'object', '`config` must be an object')
    assert.equal(typeof (config.general), 'object', '`config.general` must be an object')

    this.config = config
  }

  present(properties) {
    assert.equal(typeof (properties), 'object', '`properties` should be an object')
    if(!this.config.properties) return this.config.general

    var baseStyles = this.config.general
    var propertyStyles = buildStylesForProperties(properties, this.config.properties)
    return mergeStyles(baseStyles, propertyStyles)
  }
}

module.exports = (config) => new IconStylePresenter(config)
