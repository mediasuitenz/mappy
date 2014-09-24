'use strict';

var assert = require('assert')
var merge  = require('object-merge')

var errMessages = {
  styles: '\'styles\' arg must be an object',
  properties: '\'properties\' arg must be an object',
  config: '\'config\' arg must be an object',
  general: '\'config.general\' arg must be an object'
}

function mergeProperties(styles, properties, configProperties) {
  assert.equal(typeof (styles), 'object', errMessages.styles)
  assert.equal(typeof (properties), 'object', errMessages.properties)

  if (configProperties) {
    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        if (configProperties[key]) {
          if (configProperties[key][properties[key]]) {
            styles = merge(styles, configProperties[key][properties[key]])
          }
        }
      }
    }
  }
  return styles
}

class LayerStylePresenter {

  constructor(config) {
    assert.equal(typeof (config), 'object', errMessages.config)
    assert.equal(typeof (config.general), 'object', errMessages.general)
    this.config = config
  }

  present(properties) {
    assert.equal(typeof (properties), 'object', errMessages.properties)
    var styles = this.config.general
    return mergeProperties(styles, properties, this.config.properties)
  }
}

module.exports = (config) => new LayerStylePresenter(config)
