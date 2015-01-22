'use strict';

require('mocha-given')
require('chai').should()

var rewire = require('rewire')
var mapKey = rewire('../lib/key')
mapKey.__set__('domWrapper', require('./mocks/dom.mock.js'))

describe('the mapKey module', () => {
  var mod, key, config

  Given('config', () => config = { domElementId: 'map'})
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

  describe('adding items', () => {
    var keyConfig = {}, result

    Given('an item name', () => keyConfig['name'] = 'item1')
    Given('an item checked state', () => keyConfig['checked'] = true)
    Given('an item description', () => keyConfig['description'] = 'my item')
    Given('that the key modules item array is empty', () => key.items = [])
    When('calling `addItem` with name and description and checked state', () => result = key.addItem(keyConfig))
    
    describe('#addItem has been called', () => {
      Then('keys item array should have 1 item', () => key.items.length.should.equal(1))
      And('keys.id property should be `item1`', () => key.items[0].key.should.equal('item1'))
      And('keys.id property should be `item1`', () => key.items[0].checked.should.equal(true))
    })
  })

  describe('adding groups', () => {
    var id, text

    Given('an id', () => id = 'group-one')
    Given('some text', () => text = 'group description')

    When('calling `createGroup` with id and text', () => key.createGroup(id, text))
    Then('result', () => key.groups[id].should.be.an('object'))
  })

  describe('throwing user click events', () => {
    var callback, result, item, key

    Given('an initialized map key', () => key = mod(config))
    Given('a callback', () => { callback = (event) => { result = event } })
    Given('the callback has not been called', () => result = null)
    Given('a key item', () => item = { name: 'item1', description: 'My item', checked: false })

    When('the key item is added to the key', () => key.addItem(item))
    And('the callback is attached as a listener to a map key', () => key.on('layerToggle', callback))
    And('a key item is clicked', () => key.items[0].click())

    Then('the attached callback should be called', () => result.should.be.an('object'))
    And('the result should have item properties', () => result.key.should.equal('item1'))
  })

})

