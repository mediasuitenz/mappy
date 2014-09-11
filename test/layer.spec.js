'use strict';

/*
layer
- has own data service
- has config
- insert item in key
- style up items
- inject styled content into popup
- listens to it's dataService for updated geojson content
- can return it's latest geojson
*/
require('chai').should()

var layerFactory = require('../lib/layer')

describe('Layer', () => {
  //Given
  var layer = layerFactory({})

  describe('#getData', () => {
    it('should return its latest geojson', () => {
      //When
      var geojson = layer.getData()

      //Then
      geojson.should.be.an('object')
    })
  })



  describe('#onData', () => {
    it('should be emitted when dataService onData event received', () => {
      //Given
      //dataService and layer

      //When
      //dataService emits a data ready event

      //Then
      //layer should emit onData event
    })
  })

})