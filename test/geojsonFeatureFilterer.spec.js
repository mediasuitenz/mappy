'use strict';

require('mocha-given')
require('chai').should()
var scenario = describe

var rewire = require('rewire')
var geojsonFeatureFilterer = rewire('../lib/geojsonFeatureFilterer')
var factory

describe('the geojsonFeatureFilterer', () => {
  var filterer, point, invalidPoint, linestring, linestring2

  Given('the geojsonFeatureFiltererFactory', () => factory = geojsonFeatureFilterer)
  Given('a valid geojson point object', () => {
    point = {
      type: 'Feature',
      id: 'id-1',
      properties: { show: true },
      geometry: {
        type: 'Point',
        coordinates: [172.6325585, -43.4448338]
      }
    }
  })
  Given('an invalid geojson point object', () => {
    invalidPoint = {
      type: 'Feature',
      id: 'id-1',
      properties: { show: true },
      geometry: {
        type: 'Point',
        coordinates: [172.6325585] // missing latitude
      }
    }
  })
  Given('a valid geojson linestring object', () => {
    linestring = {
      type: 'Feature',
      id: 'id-2',
      properties: { show: false },
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
  Given('a valid geojson linestring object', () => {
    linestring2 = {
      type: 'Feature',
      id: 'id-2',
      properties: { show: true },
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
    describe('no filtering', () => {
      scenario('providing an empty config object', () => {
        var conf, filterer, result

        Given('an empty config object', () => conf = {})
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with a geojson point feature', () => result = filterer.filter(point))
        Then('result should be true', () => result.should.equal(true))
      })

      scenario('providing an undefined config object', () => {
        var conf, filterer, result

        Given('an undefined config object', () => conf = undefined)
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with a geojson point feature', () => result = filterer.filter(point))
        Then('result should be true', () => result.should.equal(true))
      })

      scenario('providing a null config object', () => {
        var conf, filterer, result

        Given('an empty config object', () => conf = null)
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with a geojson point feature', () => result = filterer.filter(point))
        Then('result should be true', () => result.should.equal(true))
      })
    })

    describe('GeoJSON validation', () => {
      scenario('providing a valid GeoJSON object', () => {
        var conf, filterer, result

        Given('an empty config object', () => conf = {})
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with an valid geojson point feature', () => result = filterer.filter(point))
        Then('result should be true', () => result.should.equal(true))
      })

      scenario('providing a invalid GeoJSON object with validation enabled', () => {
        var conf, filterer, result

        Given('an empty config object', () => conf = {})
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with an invalid geojson point feature', () => result = filterer.filter(invalidPoint))
        Then('result should be false', () => result.should.equal(false))
      })

      scenario('providing a invalid GeoJSON object with validation disabled', () => {
        var conf, filterer, result

        Given('a config object with validateJSON=false', () => conf = {validateJSON:false})
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with an invalid geojson point feature', () => result = filterer.filter(invalidPoint))
        Then('result should be true', () => result.should.equal(true))
      })
    })

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

    describe('properties filtering', () => {
      scenario('filtering to only features that have property show set to true', () => {
        var conf, filterer, result1, result2

        Given('config to filter out anything but show=true', () => conf = { properties: { show: [true] } })
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with a geojson point feature', () => result1 = filterer.filter(point))
        And('filterer.filter is called with a geojson linestring feature', () => result2 = filterer.filter(linestring))
        Then('result1 should be true', () => result1.should.equal(true))
        And('result2 should be false', () => result2.should.equal(false))
      })

      scenario('filtering to only features that have property show set to maybe', () => {
        var conf, filterer, result1, result2

        Given('config to filter out anything but show=maybe', () => conf = { properties: { show: ['maybe'] } })
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with a geojson point feature', () => result1 = filterer.filter(point))
        And('filterer.filter is called with a geojson linestring feature', () => result2 = filterer.filter(linestring))
        Then('result1 should be false', () => result1.should.equal(false))
        And('result2 should be false', () => result2.should.equal(false))
      })

      scenario('filtering to only features that have property show set to true or false', () => {
        var conf, filterer, result1, result2

        Given('config to filter out anything but show=true or show=false', () => conf = { properties: { show: [true, false] } })
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filterer.filter is called with a geojson point feature', () => result1 = filterer.filter(point))
        And('filterer.filter is called with a geojson linestring feature', () => result2 = filterer.filter(linestring))
        Then('result1 should be true', () => result1.should.equal(true))
        And('result2 should be true', () => result2.should.equal(true))
      })
    })

    describe('feature type and property filtering', () => {

      scenario('filtering by LineString and by property show = true', () => {
        var conf, filterer, result1, result2, result3

        Given('config to filter out anything but LineStrings with show=true', () => {
          conf = { geometry: ['LineString'], properties: { show: [true] }}
        })
        When('a filterer is created using config', () => filterer = factory(conf))
        And('filter is called with a point', () => result1 = filterer.filter(point))
        And('filter is called with a linestring with show=false', () => result2 = filterer.filter(linestring))
        And('filter is called with a linestring with show=true', () => result3 = filterer.filter(linestring2))
        Then('first result should be false', () => result1.should.equal(false))
        And('second result should be false', () => result2.should.equal(false))
        And('third result should be true', () => result3.should.equal(true))
      })

    })
  })
})
