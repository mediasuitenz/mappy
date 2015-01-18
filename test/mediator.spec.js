'use strict';

require('mocha-given')
var chai      = require('chai')
var expect    = chai.expect
var scenario  = describe
var sinon     = require('sinon')

var mediator = require('../lib/mediator')()
var EventEmitter = require('events').EventEmitter

class Feature extends EventEmitter {}

describe('The Geojson Layer Mediator', () => {

  scenario('Registering a listening layer', () => {
    var listenerConfig

    Given(() => {
      listenerConfig = {
        listensTo: 'layer1',
        type: 'click',
        handler: sinon.spy()
      }
    })
    When(() => mediator.register(listenerConfig))
    Then(() => expect(mediator._data.layer1.click.length).to.equal(1))
  })

  scenario('Notifying an event for a click on a feature', () => {
    var notifierConfig, feature

    Given(() => {
      mediator.register({
        listensTo: 'layer1',
        type: 'click',
        handler: sinon.spy()
      })
    })

    Given(() => notifierConfig = ['click'])
    Given(() => feature = new Feature())
    Given(() => feature.on('click', () => mediator.notify('click', 'layer1', {}, {}))) 
    When(() => feature.emit('click'))
    Then(() => expect(mediator._data.layer1.click[1]).to.have.been.calledOnce)
  })
  
})