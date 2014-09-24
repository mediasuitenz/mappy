'use strict';

require('mocha-given')
require('chai').should()

var rewire = require('rewire')
var popupPresenter = rewire('../lib/layerStylePresenter')
var factory

describe('the layerStylePresenter', () => {
  var presenter

  Given('the layerStylePresenterFactory', () => factory = popupPresenter)

  describe('creating a layerStylePresenter', () => {
    When('layerStylePresenterFactory() is called', () => presenter = factory({general:{}}))
    Then('a new layerStylePresenter should be returned', () => presenter.should.be.an('object'))
  })

  describe('#present', () => {
    var properties, result

    Given('some properties', () => properties = { name: 'bob' })
    When('#present is called with properties', () => result = presenter.present(properties))
    Then('an object should be returned', () => result.should.be.a('object'))
  })
})

describe('styling by \'general\' configuration', () => {
  describe('opacity 1', () => {
    var config, presenter, result

    Given('a general config hash', () => config = { general:{ opacity:1 } })
    When('a presenter is created from config hash', () => presenter = popupPresenter(config))
    And('presenter.present is called', () => result = presenter.present({}))
    Then('result.opacity should equal 1', () => result.opacity.should.equal(1))
  })

  describe('opacity 2', () => {
    var config, presenter, result

    Given('another general config hash', () => config = { general:{ opacity:2 } })
    When('a presenter is created from config hash', () => presenter = popupPresenter(config))
    And('presenter.present is called', () => result = presenter.present({}))
    Then('result.opacity should equal 2', () => result.opacity.should.equal(2))
  })
})

describe('\'properties configuration\'', () => {

  describe('styling by a weighting property', () => {
    var config, properties, presenter, result

    Given('config based on weighting', () => {
      config = {
        general: {},
        properties: {
          weighting: {
            '2': { opacity: 0.8 },
            '5': { opacity: 0.9 }
          }
        }
      }
    })
    Given('a properties object with weightings', () => properties = { weighting: 5 })
    When('A presenter is created with config', () => presenter = popupPresenter(config))
    And('presenter.present is called with properties', () => result = presenter.present(properties))
    Then('result.opacity should be 0.9', () => result.opacity.should.equal(0.9))
  })

})
