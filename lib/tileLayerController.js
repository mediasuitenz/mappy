'use strict';

var assert = require('assert')

/**
 * Class to manage interactions between the map and the tile layer manager
 */
class TileLayerController {

  /**
   * Constructor, takes config
   * @param {object} config
   */
  constructor(config) {
    this.map = config.map
    this.manager = config.manager

    this.init()
  }

  /**
   * Performs setup
   * Registers add and remove events which tell the map to add and remove
   * tile layers based on the config the tile layers were set up with
   */
  init() {
    this.manager.on('add', (name, config) => {
      this.map.setTileLayer(name, config)
    })
    this.manager.on('remove', (name) => {
      this.map.removeTileLayer(name)
    })
    this.manager.start()
  }
}

module.exports = (config) => {
  assert.ok(config.map, '`map` must be provided')
  assert.ok(config.manager, '`manager` must provided')

  return new TileLayerController(config)
}
