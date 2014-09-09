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

  describe('Creating a DataService with config', () => {
    it('should require a valid config object', () => {
      //Given
      var config = {
        url: '...',
        type: 'longPoll',
        refresh: 10000
      }

      //Then
      assert.doesNotThrow(() => { dataServiceFactory(config) }, 'Invalid config')
    })
  })

  describe('#load', () => {
    it('should load geojson from the server', done => {
      //Given
      var dataService = dataServiceFactory({})

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
