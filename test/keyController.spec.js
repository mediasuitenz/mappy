'use strict';

require('mocha-given')
var expect  = require('chai').expect
var context = describe
var catchError = require('catch-error')

var keyController = require('../lib/keyController')

class Map {}
class Key {
  constructor() {
    this.config = {
      layers: [{ name: 'layer1'}]
    }
  }
  on() {}
  addItem() {}
}
var definedLayers = ['layer1', 'mykey']

describe('the keyController module', () => {
  describe('creating a keyController', () => {
    var factory, mkController, config

    Given('the keyController module', () => factory = keyController)
    Given('keyController config', () => config = { map: new Map(), key: new Key(), layerNames: definedLayers })

    When('a map controller object is created', () => mkController = factory(config))

    Then('a map key controller should have been created', () => {
      expect(mkController.constructor.name).to.equal('KeyController')
    })
  })

  describe('the getKeyVisibility and setKeyVisibility methods', () => {
    var factory, mkController, config

    Given('the keyController module', () => factory = keyController)
    Given('keyController config', () => config = { map: new Map(), key: new Key(), layerNames: definedLayers })
    When('a map controller object is created', () => mkController = factory(config))

    And('a valid key `mykey` is added', () => {
      mkController.addKeyFromConfig({
        name: 'mykey',
        description: 'My description',
        checked: false
      })
    })

    context('straight after `mykey` is added', () => {
      Then('the #getKeyVisibility method should return false', () => {
        expect(mkController.getKeyVisibility('mykey')).to.equal(false)
      })
    })

    context('calling #setKeyVisibility with arg true', () => {
      When('the #setKeyVisibility method is called', () => mkController.setKeyVisibility('mykey', true))
      Then('the #getKeyVisibility method should return true', () => {
        expect(mkController.getKeyVisibility('mykey')).to.equal(true)
      })
    })

    context('calling #setKeyVisibility with arg false', () => {
      When('the #setKeyVisibility method is called', () => mkController.setKeyVisibility('mykey', false))
      Then('the #getKeyVisibility method should return false', () => {
        expect(mkController.getKeyVisibility('mykey')).to.equal(false)
      })
    })
  })

  describe('the addKeyFromConfig method', () => {
    var factory, mkController, config

    Given('the keyController module', () => factory = keyController)
    Given('keyController config', () => config = { map: new Map(), key: new Key(), layerNames: definedLayers })

    context('invalid layer name in key config', () => {
      var error, keyLayer

      Given('layer `blah` is undefined in layers.json, but is in key.json', () => {
        keyLayer = {
          name: 'blah',
          description: 'My description',
          checked: false
        }
      })
      When('a map controller object is created', () => mkController = factory(config))

      And('a key `blah` is added that does not relate to a known layer', () => {
        error = catchError({ func: mkController.addKeyFromConfig, args: [keyLayer], context: mkController })
      })
      Then('an error should be thrown', () => expect(error).to.be.an.instanceof(Error))
      And('it should have a relevant message', () => {
        expect(error.message).to.equal('key.json layer reference `blah` does not match any entry in layers.json')
      })
    })

    context('valid layer name in key config', () => {
      var error, keyLayer

      Given('`mykey` is defined in layers.json and in key.json', () => {
        keyLayer = {
          name: 'mykey',
          description: 'My description',
          checked: false
        }
      })
      When('a map controller object is created', () => mkController = factory(config))

      And('a valid key `mykey` is added', () => {
        error = catchError({ func: mkController.addKeyFromConfig, args: [keyLayer], context: mkController })
      })
      Then('an error should not be thrown', () => expect(error).to.equal(undefined))
    })
  })
})

