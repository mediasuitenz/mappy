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
})