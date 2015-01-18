'use strict';

require('mocha-given')
var assert       = require('assert')
var chai         = require('chai')
var expect       = chai.expect
var context      = describe
var catchError   = require('catch-error')
var sinon        = require('sinon')
var sinonChai    = require('sinon-chai')
chai.use(sinonChai)
var EventEmitter = require('events').EventEmitter

var gjLayerControllerFactory = require('../lib/geojsonLayerController')

class Map {
  setGeojsonLayer() {}
  emit() {}
}
class KeyController {
  getKeyVisibility() {
    return true
  }
}
var dataService
class DataService extends EventEmitter {
  getData() {}
  start() {}
}
var dataServiceFactory = () => {
  dataService = new DataService()
  return dataService
}
var popupPresenterFactory = () => {
  return {}
}
var stylePresenterFactory = () => {
  return {}
}
var filterFactory = () => {
  return {}
}

var configBuilder = () => {
  return {
    map: new Map(),
    keyController: new KeyController(),
    dataServiceFactory: dataServiceFactory,
    popupPresenterFactory: popupPresenterFactory,
    stylePresenterFactory: stylePresenterFactory,
    filterFactory: filterFactory
  }
}

var layerBuilder = (n) => {
  assert(!!n && n > 0, 'layerBuilder requires a number greater than 0')

  var layer = {
    name: 'layer',
    type: 'geojson',
    styles: {
      popup: {
        filter: {}
      }
    }
  }
  var layers = []

  while (n > 0) {
    n--
    layers.push(layer)
  }

  return layers
}

describe('geojsonLayerController', () => {
  describe('creating a geojsonLayerController', () => {
    var config, gjLayerController

    Given('some config', () => {
      config = configBuilder()
    })
    When('the module is called with config', () => {
      gjLayerController = gjLayerControllerFactory(config)
    })
    Then('the module should be an object', () => {
      expect(gjLayerController).to.be.an('object')
    })
  })

  describe('adding layers from config', () => {
    var layerConfig, config, gjLayerController, spy

    Given('some controller config', () => config = configBuilder())
    Given('the map.setGeojsonLayer method is a spy', () => {
      spy = config.map.showGeojsonLayer = sinon.spy()
    })
    Given('a valid geojsonLayerController', () => {
      gjLayerController = gjLayerControllerFactory(config)
    })
    Given('some layer config', () => layerConfig = layerBuilder(2))
    When('addLayersFromConfig is called with config', () => {
      gjLayerController.addLayersFromConfig(layerConfig)
    })
    And('a data event is triggered', () => dataService.emit('data'))
    Then('a layer should have been added to the map', () => expect(spy).to.have.been.calledOnce)
  })

  describe('adding a layer with minimal configuration', () => {
    context('it should handle undefined config keys gracefully', () => {
      var caughtErrors, config, gjLayerController

      Given('some controller config', () => config = configBuilder())
      Given('a valid geojsonLayerController', () => {
        gjLayerController = gjLayerControllerFactory(config)
      })
      When('addLayersFromConfig is called with config', () => {
        try {
          gjLayerController.addLayersFromConfig([{}])
        } catch (e) {
          caughtErrors = true
        }
      })
      Then('there should have been no errors thrown', () => expect(caughtErrors).to.equal(undefined))
    })
  })
})
