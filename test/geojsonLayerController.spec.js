'use strict';

require('mocha-given')
var chai       = require('chai')
var expect     = chai.expect
var context    = describe
var catchError = require('catch-error')
var sinon      = require('sinon')
var sinonChai  = require('sinon-chai')
chai.use(sinonChai)

var gjLayerControllerFactory = require('../lib/geojsonLayerController')

class Map {}
class KeyController {}
var dataServiceFactory = () => {
  return {}
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


})
