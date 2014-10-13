'use strict';

require('mocha-given')
var chai      = require('chai')
var expect    = chai.expect
var sinon     = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)
var context = describe
var EventEmitter = require('events').EventEmitter

var tileLayerController = require('../lib/tileLayerController')

class Map {}
class TileLayerManager extends EventEmitter {
  emitLayers() {}
  removeLayer() {}
  addLayer() {}
  start() {}
  stop() {}
}

describe('the tileLayerController module', () => {
  describe('creating a tileLayerController', () => {
    var map, manager, config, controller

    Given('a manager object', () => manager = new TileLayerManager())
    Given('a map object', () => map = new Map())
    Given('tileLayerController config', () => config = { map: map, manager: manager })

    context('when the manager emits an add event', () => {
      var spy

      Given('a sinon spy', () => spy = sinon.spy())
      Given('that map.setTileLayer is a dirty spy', () => map.setTileLayer = spy)

      When('a tileLayerController is created', () => controller = tileLayerController(config))
      When('add is emitted', () => manager.emit('add'))

      Then('our sneaky spy should have been called', () => expect(spy).to.have.been.calledOnce)
    })

    context('when the manager emits a remove event', () => {
      var spy

      Given('a sinon spy', () => spy = sinon.spy())
      Given('that map.removeTileLayer is a dirty spy', () => map.removeTileLayer = spy)

      When('a tileLayerController is created', () => controller = tileLayerController(config))
      When('remove is emitted', () => manager.emit('remove'))

      Then('our sneaky spy should have been called', () => expect(spy).to.have.been.calledOnce)
    })
  })
})

