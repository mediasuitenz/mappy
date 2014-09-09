'use strict';

/*
config
->read from file, holds values and supplies as needed
*/
require('chai').should()

var config = require('../lib/config')()

describe('Config', () => {

  describe('#getLayers', () => {
    it('should return layers config array', () => {
      //Given

      //When
      var layers = config.getLayers()

      //Then
      layers.should.be.an('array')
      layers[0].name.should.be.a('string')
    })
  })

  describe('#getMap', () => {
    it('should return map config object', () => {
      //Given

      //When
      var map = config.getMap()

      //Then
      map.should.be.an('object')
      map.tileLayers.should.be.an('array')
    })
  })

})
