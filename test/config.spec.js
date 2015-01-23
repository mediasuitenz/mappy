'use strict';

/*
config
->read from file, holds values and supplies as needed
*/
require('chai').should()

var ConfigParser = require('../lib/config')

var configObject = {
  dataSources: [
    {
      name: 'dataSource1',
      type: 'longPoll',
      request: {
        url: '...'
      }
    }
  ],
  map: {
    domElementId: 'id',
    tileLayers: {
      layer: {
      }
    },
    bounds: [[1,1],[1,1]]
  },
  layers: [
    {
      name: 'name',
      type: 'type',
      dataSource: 'dataSource1'
    }
  ],
  key: {
    title: 'title',
    domElementId: 'id',
    layers: [
    ]
  }
}

var config = new ConfigParser(configObject)

describe('Config', () => {

  describe('#getLayers', () => {
    it('should return layers config array', () => {
      //Given

      //When
      var layers = config.getLayers()

      //Then
      layers.should.be.an('array')
      layers[0].name.should.be.a('string')
      layers[0].dataSource.should.be.a('string')
    })
  })

  describe('#getMap', () => {
    it('should return map config object', () => {
      //Given

      //When
      var map = config.getMap()

      //Then
      map.should.be.an('object')
      map.tileLayers.should.be.an('object')
    })
  })

  describe('#getKey', () => {
    it('should return key config object', () => {
      //Given

      //When
      var key = config.getKey()

      //Then
      key.should.be.an('object')
      key.title.should.be.a('string')
      key.domElementId.should.be.a('string')
    })
  })

  describe('#getDataSources', () => {
    it('should return data source config object', () => {
      //Given

      //When
      var dataSources = config.getDataSources()

      //Then
      dataSources.should.be.an('array')
      dataSources[0].name.should.be.a('string')
      dataSources[0].type.should.be.a('string')
      dataSources[0].request.should.be.an('object')
    })
  })

})
