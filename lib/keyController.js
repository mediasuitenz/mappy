'use strict';

var assert = require('assert')

/**
 * Validate that a layer defined in the key config exists in the
 * layer config, throws an error if not.
 * @param {string} keyName
 * @param {array}  layerNames
 */
function validateLayer(keyName, layerNames) {
  assert.ok(!!keyName, 'A layer does not have a `name` defined in key.json')
  assert.ok(
    layerNames.indexOf(keyName) > -1,
    'key.json layer reference `' + keyName + '` does not match any entry layers.json'
  )
}

/**
 * Helper function that loops through layer config, breaks it into groups
 * and key items and adds them
 * @param {KeyController} controller
 * @param {object} layers
 */
function addLayersToKey(controller, layers) {
  layers.forEach((layer) => {
    if (layer.name) controller.addKeyFromConfig(layer)
    if (layer.group) controller.addGroupFromConfig(layer)
  })
}

/**
 * MapKeyController class
 */
class KeyController {

  /**
   * Constructs a KeyController from given config
   * map and mapKey objects are required
   */
  constructor(config) {
    this.key = config.key
    this.keyVisibility_ = {}
    this.config = config

    this.setupEvents()

    addLayersToKey(this, this.key.config.layers)
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
   * Adds a single line item to the key from a config object.
   * Optionaly pass a group to add the line item to
   * @param {object} config
   * @param {string} group
   */
  addKeyFromConfig(config, group) {
    validateLayer(config.name, this.config.layerNames)
    this.key.addItem(config.name, config.description, config.checked, group)
    this.keyVisibility_[config.name] = { isVisible: config.checked }
  }

  /**
   * Adds a group from config. Creates a group, then adds all the key items
   * the group config defines
   * @param {object} config
   */
  addGroupFromConfig(config) {
    this.key.createGroup(config.group, config.description)
    config.layers.forEach((layer) => this.addKeyFromConfig(layer, config.group))
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
  assert.equal(config.key.constructor.name, 'Key', '`key` must be a Key object')

  return new KeyController(config)
}
