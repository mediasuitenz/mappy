'use strict';

var EventEmitter = require('events').EventEmitter
var moment       = require('moment')
var assert       = require('assert')

function nowIsWithin(on, off) {
  if (!on || !off) return false

  on = on.split(':')
  off = off.split(':')

  var now = moment()
  var start = moment()
  start.hour(on[0])
  start.minute(on[1])

  var end = moment()
  end.hour(off[0])
  end.minute(off[1])

  if (now >= start && now <= end) return true
  return false
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
        //if theres some reason to add a layer
        //either theres no time set
        //or theres time set and time matches now
        if (!!this.layers.get(key)) {
          this.emit('remove', key)
          this.layers.set(key, false)
        }
      } else {
        //if theres some reason to remove a layer
        //time must be set and time does not match now
        if (!this.layers.get(key)) {
          this.emit('add', key, this.config[key])
          this.layers.set(key, true)
        }
      }
    }, this)
  }

  start() {
    this.interval = setInterval(() => {
      this.emitLayers()
    }, 1000 * 60)
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
