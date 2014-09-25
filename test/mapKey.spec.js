'use strict';

require('mocha-given')
require('chai').should()

var rewire = require('rewire')
var mapKey = rewire('../lib/mapKey')
mapKey.__set__('domWrapper', require('./mocks/dom.mock.js'))

describe('the mapKey module', () => {
  var mod, key, config

  Given('config', () => config = { domElement: 'map'})
  Given('the mapKey module', () => mod = mapKey)
  When('mapKey is initialized', () => key = mod(config))

  describe('initializing the mapKey module', () => {
    Then('initialized module exists', () => key.title.should.be.a('string'))
  })

  describe('#title', () => {
    describe('setting the title', () => {
      var title

      Given('a title', () => title = 'My title')
      When('title is set on map key', () => key.title = title)
      Then('key title should equal title', () => key.title.should.equal(title))
    })
  })

})

