'use strict';

/*
data service
- pull geojson data from various endpoints
- receives sse for updates
- notify listeners when data changes
- add listeners
 */
require('chai').should()
var assert = require('assert')

var dataServiceFactory = require('../lib/dataService')

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
      assert.doesNotThrow(() => { dataServiceFactory(config) }, 'Invalid config')
    })

    it('should balk at an invalid config object', () => {
      //Given
      var config = {}

      //Then
      assert.throws(
        () => { dataServiceFactory(config) },
        (err) => {
          return err.message === 'Missing required config key: url'
        },
        'DataService did not throw expected error'
      )
    })
  })

  describe('#load', () => {
    it('should load geojson from the server', done => {
      //Given
      var dataService = dataServiceFactory(validConfig)

      //When
      dataService.load( (err, res) => {
        //Then
        assert.equal(err, null)
        res.should.be.an('object')
        done()
      })
    })
  })

  describe('#addListener', () => {

  })

  describe('#notify', () => {

  })

})
