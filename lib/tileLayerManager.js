'use strict';

var EventEmitter = require('events').EventEmitter
var moment       = require('moment')
var assert       = require('assert')

var REFRESH_INTERVAL = 1000 * 60 // milliseconds

/**
 * creates a moment datetime with given hours and minutes
 * @param  {number} hour    - eg. 13
 * @param  {number} minutes - eg. 34
 * @return {object}
 */
function getTime(hour, minutes) {
  var dateTime = moment()

  dateTime.hour(hour)
  dateTime.minute(minutes)

  return dateTime
}

/**
 * Determines if the current time is within a given start and end time
 * only tracks 24 hour period.
 * @param  {string} on  - eg. 09:00
 * @param  {string} off - eg. 13:00
 * @return {boolean}
 */
function nowIsWithin(on, off) {
  if (!on || !off) return false

  on = on.split(':')
  off = off.split(':')

  var now = moment()
  var start = getTime(on[0], on[1])
  var end = getTime(off[0], off[1])

  return (now >= start && now <= end)
}

/**
 * Tile Layer Manager class.
 * Stores layer state, emits events for add and remove
 */
class TileLayerManager extends EventEmitter {

  /**
   * @constructor
   * Sets up state handling and stores config
   * @param {object} config
   */
  constructor(config) {
    this.config = config
    this.layers = new Map()
    this.interval = null
  }

  /**
   * main layer emitter function. Emits add and remove events depending on
   * tile layer managers config.
   */
  emitLayers() {
    Object.keys(this.config).forEach((key) => {
      var config = this.config[key]

      if (config.time && !nowIsWithin(config.time.on, config.time.off)) {
        this.removeLayer(key)
      } else {
        this.addLayer(key)
      }
    }, this)
  }

  /**
   * Removes a given layer by name if it is present, tracks that it was
   * removed
   * @param {string} layerName
   */
  removeLayer(layerName) {
    if (!!this.layers.get(layerName)) {
      this.emit('remove', layerName)
      this.layers.set(layerName, false)
    }
  }

  /**
   * Adds a givent layer by name if is not present, tracks that is was
   * added
   * @param {string} layerName
   */
  addLayer(layerName) {
    if (!this.layers.get(layerName)) {
      this.emit('add', layerName, this.config[layerName])
      this.layers.set(layerName, true)
    }
  }

  /**
   * Starts the tile layer manager. Runs emitLayers() initially and then again
   * every REFRESH_INTERVAL ms
   * Running service is stored as this.interval so that it can be stopped
   * using the stop method
   */
  start() {
    this.interval = setInterval(() => {
      this.emitLayers()
    }, REFRESH_INTERVAL)
    this.emitLayers()
  }

  /**
   * Stops the tile layer manager, clearing this.interval
   */
  stop() {
    clearTimeout(this.interval)
  }

}

module.exports = (config) => {
  //validate configuration input
  assert.equal(typeof(config), 'object', 'tilelayer `config` must be an object')
  assert.ok(Object.keys(config).length > 0, 'tilelayer `config` must specify at least 1 tilelayer')
  Object.keys(config).forEach((key) => {
    if(config[key].type != 'google') {
      assert(!!config[key].url, 'tilelayer ' + key + ' must specify a url property')
    }
  })

  return new TileLayerManager(config)
}
