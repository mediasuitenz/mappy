'use strict';

require('mocha-given')
var expect  = require('chai').expect
var context = describe

var keyController = require('../lib/keyController')

class Map {}
class Key {
  on() {}
  addItem() {}
}

describe('the keyController module', () => {
  describe('creating a keyController', () => {
    var factory, mkController, config

    Given('the keyController module', () => factory = keyController)
    Given('keyController config', () => config = { map: new Map(), key: new Key() })

    When('a map controller object is created', () => mkController = factory(config))

    Then('a map key controller should have been created', () => {
      expect(mkController.constructor.name).to.equal('KeyController')
    })
  })

  describe('the addKey, getKeyVisibility and setKeyVisibility methods', () => {
    var factory, mkController, config

    Given('the keyController module', () => factory = keyController)
    Given('keyController config', () => config = { map: new Map(), key: new Key() })

    When('a map controller object is created', () => mkController = factory(config))
    And('a key `mykey` is added', () => mkController.addKey('mykey', '', false))

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
})

