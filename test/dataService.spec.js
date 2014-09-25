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

var validConfig = {
  url: '...',
  type: 'longPoll',
  refresh: 10000
}

describe('DataService', () => {
  it('should be inactive after creation', () => {
    //Given a dataservice
    var dataService = dataServiceFactory(validConfig)

    dataService.isActive.should.equal(false)
  })

  it('should be active after being started', () => {
    //Given a dataservice
    var dataService = dataServiceFactory(validConfig)
    dataService.start()

    dataService.isActive.should.equal(true)
  })

  describe('#getData', () => {
    it('should return its latest geojson', () => {

      //Given a dataservice
      var dataService = dataServiceFactory(validConfig)
      //Given that the dataservice has data
      dataService.data = validGeojson

      //When we call getdata on the dataservice
      var geojson = dataService.getData()

      //Then we should expect valid geojson back
      geojson.should.be.an('object')
      //And
      geojsonIsValid(geojson).should.equal(true)

    })
  })

  describe('context -> longPoll', () => {
    describe('#start', () => {
      it('should do a single upfront data pull', (done) => {

        //Given a data service
        var dataService = dataServiceFactory(validConfig)
        //Given a listener attached to the data service
        dataService.on('data', callback)

        //When the service is started
        dataService.start()

        //Then the callback should be notified of data
        /*jshint latedef:false */
        function callback() {
          done()
        }
      })
    })
  })

  describe('#stop', () => {
    it('should stop the dataService', () => {
      //Given a data service
      var dataService = dataServiceFactory(validConfig)

      //When the service is stopped after starting
      dataService.start()
      dataService.stop()

      dataService.isActive.should.equal(false)
    })
  })

})
