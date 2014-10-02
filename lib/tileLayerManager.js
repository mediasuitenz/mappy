'use strict';

var EventEmitter = require('events').EventEmitter
var moment       = require('moment')
var assert       = require('assert')

var REFRESH_INTERVAL = 1000 * 60 // milliseconds

function getTime(hour, minutes) {
  var dateTime = moment()

  dateTime.hour(hour)
  dateTime.minute(minutes)

  return dateTime
}

function nowIsWithin(on, off) {
  if (!on || !off) return false

  on = on.split(':')
  off = off.split(':')

  var now = moment()
  var start = getTime(on[0], on[1])
  var end = getTime(off[0], off[1])

  return (now >= start && now <= end)
}

class TileLayerManager extends EventEmitter {

  constructor(config) {
    this.config = config
    this.layers = new Map()
    this.interval = null
  }

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

  removeLayer(layerName) {
    if (!!this.layers.get(layerName)) {
      this.emit('remove', layerName)
      this.layers.set(layerName, false)
    }
  }

  addLayer(layerName) {
    if (!this.layers.get(layerName)) {
      this.emit('add', layerName, this.config[layerName])
      this.layers.set(layerName, true)
    }
  }

  start() {
    this.interval = setInterval(() => {
      this.emitLayers()
    }, REFRESH_INTERVAL)
    this.emitLayers()
  }

  stop() {
    clearTimeout(this.interval)
  }

}

module.exports = (config) => {
  assert.equal(typeof(config), 'object', 'tilelayer `config` must be an object')
  assert.ok(Object.keys(config).length > 0, 'tilelayer `config` must specify at least 1 tilelayer')

  Object.keys(config).forEach((key) => {
    assert(!!config[key].url, 'tilelayer ' + key + ' must specify a url property')
  })

  return new TileLayerManager(config)
}
