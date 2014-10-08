'use strict';

var assert = require('assert')

/**
 * MapKeyController class
 */
class MapKeyController {

  /**
   * Constructs a MapKeyController from given config
   * map and mapKey objects are required
   */
  constructor(config) {
    this.key = config.mapKey
    this.keyVisibility_ = {}
    this.config = config

    this.setupEvents()
  }

  /**
   * Sets up and event handler to listen to the key for any user toggling
   * of layers on and off
   */
  setupEvents() {
    this.key.on('layerToggle', (event) => {
      this.setKeyVisibility(event.key, event.checked)

      if (event.checked) this.config.map.showGeojsonLayer(event.key)
      else this.config.map.hideGeojsonLayer(event.key)
    })
  }

  /**
   * Adds an item to the key and keeps track of its visibility state
   * @param {string} name
   * @param {string} description
   * @param {boolean} visible
   */
  addKey(name, description, visible) {
    this.key.addItem(name, description, visible)
    this.keyVisibility_[name] = { isVisible: visible }
  }

  /**
   * Returns whether the named key is visible or not
   * @param {string} name
   */
  getKeyVisibility(name) {
    return this.keyVisibility_[name].isVisible
  }

  /**
   * Used internally to update the visibility state of a key item.
   * @see setupEvents()
   * @param {string} name
   * @param {boolean} visibility
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
