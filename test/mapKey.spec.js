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
    var title

    describe('setting the title', () => {
      Given('a title', () => title = 'My title')
      When('title is set on map key', () => key.title = title)
      Then('key title should equal title', () => key.title.should.equal(title))
    })

    describe('getting the title', () => {
      var result

      Given('a title', () => title = 'Important title')
      When('title is set on map key', () => key.title = title)
      And('a get title is performed', () => result = key.title)
      Then('the result should be `Important title`', () => result.should.equal('Important title'))
    })
  })


  describe('adding and removing items', () => {
    var item, id, result

    Given('an item id', () => id = 'item1')
    Given('an item', () => item = 'my item')
    Given('keys item array is empty', () => key.items = [])
    When('calling `addItem` with id and item', () => result = key.addItem(id, item))

    describe('#addItem has been called', () => {
      Then('keys item array should have 1 item', () => key.items.length.should.equal(1))
      And('keys.id property should be `item1`', () => key.items[0].key.should.equal('item1'))

      describe('calling #removeItem', () => {
        When('calling `removeItem` with id', () => result = key.removeItem(id))
        Then('keys item array should be empty', () => key.items.length.should.equal(0))
      })
    })
  })

})

