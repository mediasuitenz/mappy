'use strict';

require('mocha-given')
require('chai').should()

var rewire = require('rewire')
var iconPresenter = rewire('../lib/iconStylePresenter')
var factory

describe('the iconStylePresenter', () => {
  var presenter

  Given('the iconStylePresenterFactory', () => factory = iconPresenter)

  describe('creating an iconStylePresenter', () => {
    When('iconStylePresenterFactory() is called', () => presenter = factory({general:{}}))
    Then('a new iconStylePresenter should be returned', () => presenter.should.be.an('object'))
  })

  describe('#present', () => {
    var properties, result

    Given('some properties', () => properties = { name: 'bob' })
    When('#present is called with properties', () => result = presenter.present(properties))
    Then('an object should be returned', () => result.should.be.a('object'))
  })
})

describe('icon styling by \'general\' configuration', () => {
  describe('iconUrl /red-rose.png', () => {
    var config, presenter, result

    Given('a general config hash', () => config = { general:{ iconUrl: '/red-rose.png' } })
    When('a presenter is created from config hash', () => presenter = iconPresenter(config))
    And('presenter.present is called', () => result = presenter.present({}))
    Then('result.iconUrl should equal /red-rose.png', () => result.iconUrl.should.equal('/red-rose.png'))
  })

  describe('iconUrl /green-rose.png', () => {
    var config, presenter, result

    Given('another general config hash', () => config = { general:{ iconUrl:'/green-rose.png' } })
    When('a presenter is created from config hash', () => presenter = iconPresenter(config))
    And('presenter.present is called', () => result = presenter.present({}))
    Then('result.iconUrl should equal /green-rose.png', () => result.iconUrl.should.equal('/green-rose.png'))
  })
})

describe('\'properties configuration\'', () => {

  describe('styling an icon by a highway property', () => {
    var config, properties, presenter, result

    Given('config based on highway', () => {
      config = {
        general: {
          iconUrl: '/red-rose.png'
        },
        properties: {
          highway: {
            trunk: { iconUrl: '/green-rose.png' },
            motorway: { iconUrl: '/orange-rose.png' }
          }
        }
      }
    })
    Given('a properties object with highway', () => properties = { highway: 'trunk' })
    When('A presenter is created with config', () => presenter = iconPresenter(config))
    And('presenter.present is called with properties', () => result = presenter.present(properties))
    Then('result.iconUrl should be /green-rose.png', () => result.iconUrl.should.equal('/green-rose.png'))
  })

})
