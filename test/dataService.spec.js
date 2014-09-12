'use strict';

/*
data service
- pull geojson data from various endpoints
- receives sse for updates
- notify listeners when data changes
- add listeners
- node-event-emitter
 */
require('chai').should()
var assert = require('assert')
var geojsonIsValid = require('geojson-is-valid')

var dataServiceFactory = require('../lib/dataService')

var validGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'way/4243736',
      properties: {
        highway: 'trunk'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            172.5498622,
            -43.4932694
          ],
          [
            172.5498622,
            -43.4932694
          ]
        ]
      }
    }
  ]
}

describe('DataService', () => {
  var validConfig = {
    url: '...',
    type: 'longPoll',
    refresh: 10000
  }

  describe('Creating a DataService with config', () => {
    it('should require a valid config object', () => {
      //Given
      var config = validConfig

      //Then
      assert.doesNotThrow(() => { dataServiceFactory(validConfig.type, config) }, 'Invalid config')
    })

    it('should balk at an invalid config object', () => {
      //Given
      var config = {}

      //Then
      assert.throws(
        () => { dataServiceFactory(validConfig.type, config) },
        (err) => {
          return err.message === 'DataService config missing required key: type'
        },
        'DataService did not throw expected error'
      )
    })

    it('should freak out at a null config object', () => {
      //Then
      assert.throws(
        () => { dataServiceFactory(validConfig.type) },
        (err) => {
          return err.message === 'DataService missing config object'
        },
        'DataService did not throw expected error'
      )
    })

    it('should bail when given a string for a config object', () => {
      //Then
      assert.throws(
        () => { dataServiceFactory(validConfig.type, 'wtf are you thinking?') },
        (err) => {
          return !!err.message
        },
        'DataService did not throw an error'
      )
    })
  })

  describe('#getData', () => {
    it('should return its latest geojson', () => {
      //Given
      var dataService = dataServiceFactory(validConfig.type, validConfig)
      dataService.data = validGeojson

      //When
      var geojson = dataService.getData()

      //Then
      geojson.should.be.an('object')
      geojsonIsValid(geojson).should.equal(true)

    })
  })

  describe('#start', () => {
    describe('context -> longPoll', () => {
      it('should do a single upfront data pull', (done) => {
        //Given a data service
        var dataService = dataServiceFactory(validConfig.type, validConfig)
        //Given a listener attached to the data service
        dataService.on('data', callback)

        //When the service is started
        dataService.start()

        //Then the callback should receive
        function callback() {
          done()
        }
      })
    })
  })

})
