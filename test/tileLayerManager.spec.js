'use strict';

require('mocha-given')
var chai      = require('chai')
var expect    = chai.expect
var sinon     = require('sinon')
var sinonChai = require('sinon-chai')
var scenario  = describe
var moment    = require('moment')
chai.use(sinonChai)
var clock

var rewire = require('rewire')
var tileLayerManager = rewire('../lib/tileLayerManager')
var manager, config, listener

describe('The Tile Layer Manager', () => {

  Given('some config', () => config = {
    'base-tiles': {
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      time: { on: '00:00', off: '11:10' }
    },
    'aux-tiles': {
      url: 'http://{s}.tiles.mapbox.com/v3/digitalsadhu.jbf3mhe1/{z}/{x}/{y}.png',
      time: { on: '11:10', off: '23:59' }
    }
  })

  describe('the on method', () => {
    describe('listening for the add event', () => {

      scenario('the time is 9:00am', () => {
        Given('that the time is 9:00am', () => clock = sinon.useFakeTimers(moment('2013-02-08 09:00').valueOf()))
        Given('a listener function', () => listener = sinon.spy())
        When('creating a tile manager from config', () => manager = tileLayerManager(config))
        And('listener is attached to the manager', () => manager.on('add', listener))
        And('manager is started', () => manager.start())
        Then('the listener should have been called once', () => expect(listener).to.have.been.calledOnce)
        And('the listener should have been called with the name base-tiles', () => expect(listener).to.have.been.calledWith('base-tiles'))
      })

      scenario('the time is 1:00pm', () => {
        Given('that the time is 1:00pm', () => clock = sinon.useFakeTimers(moment('2013-02-08 13:00').valueOf()) )
        Given('a listener function', () => listener = sinon.spy())
        When('creating a tile manager from config', () => manager = tileLayerManager(config))
        And('listener is attached to the manager', () => manager.on('add', listener))
        And('manager is started', () => manager.start())
        And('manager is stopped', () => manager.stop())
        And('manager is started again', () => manager.start())
        Then('the listener should have been called once', () => expect(listener).to.have.been.calledOnce)
        And('the listener should have been called with the name base-tiles', () => expect(listener).to.have.been.calledWith('aux-tiles'))
      })

    })

    describe('listening for the remove event', () => {

      scenario('the time is 9:00 initially, but shifts to 1:00pm', () => {
        Given('that the time is 9:00am', () => clock = sinon.useFakeTimers(moment('2013-02-08 09:00').valueOf()) )
        Given('a listener function', () => listener = sinon.spy())
        Given('a tile manager', () => manager = tileLayerManager(config))
        When('remove listener is attached to the manager', () => manager.on('remove', listener))
        And('manager is started', () => manager.start())
        And('manager is stopped', () => manager.stop())
        And('the time is shifted to 1:00pm', () => clock = clock.tick(1000 * 60 * 60 * 4))
        And('manager is started again', () => manager.start())
        Then('the listener should have been called once', () => expect(listener).to.have.been.calledOnce)
        And('the listener should have been called with the name base-tiles', () => expect(listener).to.have.been.calledWith('base-tiles'))
      })

    })

  })

})
