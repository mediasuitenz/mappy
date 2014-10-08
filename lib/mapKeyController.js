'use strict';

var assert = require('assert')

class MapKeyController {

  /**
   *
   */
  constructor(config) {
    this.key = config.mapKey
    this.keyVisibility_ = {}
    this.config = config

    this.setupEvents()
  }

  /**
   *
   */
  setupEvents() {
    this.key.on('layerToggle', (event) => {
      this.setKeyVisibility(event.key, event.checked)

      if (event.checked) this.config.map.showGeojsonLayer(event.key)
      else this.config.map.hideGeojsonLayer(event.key)
    })
  }

  /**
   *
   */
  addKey(name, description, visible) {
    // this.key.addItem(name, description, visible)
    this.keyVisibility_[name] = { isVisible: visible }
  }

  /**
   *
   */
  getKeyVisibility(name) {
    return this.keyVisibility_[name].isVisible
  }

  /**
   *
   */
  setKeyVisibility(name, visibility) {
    this.keyVisibility_[name].isVisible = visibility
  }
}

module.exports = (config) => {
  assert.equal(config.map.constructor.name, 'Map', '`map` must be a Map object')
  assert.equal(config.mapKey.constructor.name, 'MapKey', '`mapKey` must be a MapKey object')

  return new MapKeyController(config)
}
