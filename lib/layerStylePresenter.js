'use strict';

var assert = require('assert')
var merge  = require('object-merge')

function mergeProperties(styles, properties, configProperties) {
  assert.equal(typeof (styles), 'object', '\'styles\' arg must be an object')
  assert.equal(typeof (properties), 'object', '\'properties\' arg must be an object')

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
    assert.equal(typeof (config), 'object', '\'config\' arg must be an object')
    assert.equal(typeof (config.general), 'object', '\'config.general\' arg must be an object')
    this.config = config
  }

  present(properties) {
    assert.equal(typeof (properties), 'object', '\'properties\' arg must be an object')
    var styles = this.config.general
    return mergeProperties(styles, properties, this.config.properties)
  }
}

module.exports = (config) => new LayerStylePresenter(config)
