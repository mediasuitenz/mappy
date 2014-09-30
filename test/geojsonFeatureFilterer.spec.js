'use strict';

require('mocha-given')
require('chai').should()
var scenario = describe

var rewire = require('rewire')
var geojsonFeatureFilterer = rewire('../lib/geojsonFeatureFilterer')
var factory

describe('the geojsonFeatureFilterer', () => {
  var filterer, point, linestring

  Given('the geojsonFeatureFiltererFactory', () => factory = geojsonFeatureFilterer)
  Given('a valid geojson point object', () => {
    point = {
      type: 'Feature',
      id: 'id-1',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [172.6325585, -43.4448338]
      }
    }
  })
  Given('a valid geojson linestring object', () => {
    linestring = {
      type: 'Feature',
      id: 'id-2',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [172.5498622,-43.4932694],
          [172.5497215,-43.4932446],
          [172.5496357,-43.493196]
        ]
      }
    }
  })

  describe('creating a geojsonFeatureFilterer', () => {
    When('geojsonFeatureFiltererFactory() is called', () => filterer = factory({geometry:[]}))
    Then('a new geojsonFeatureFilterer should be returned', () => filterer.should.be.an('object'))
  })

  describe('#filter method', () => {
    describe('geometry filtering', () => {
      scenario('filtering to only points', () => {
        var conf, filterer, result1, result2

        Given('config to filter out anything but points', () => conf = { geometry: ['Point'] })
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with a geojson point feature', () => result1 = filterer.filter(point))
        And('filterer.filter is called with a geojson linestring feature', () => result2 = filterer.filter(linestring))
        Then('result1 should be true', () => result1.should.equal(true))
        And('result2 should be false', () => result2.should.equal(false))
      })
    })
  })
})
