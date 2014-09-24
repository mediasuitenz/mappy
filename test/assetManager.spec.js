'use strict';

require('chai').should()

var rewire = require('rewire')

var assetManager = rewire('../lib/assetManager')
assetManager.__set__('assetBundle', {
  css: {
    myCss: ''
  },
  templates: {}
})

describe('assetManager', () => {
  describe('.assets', () => {
    it('should be an object', () => {
      assetManager().assets.should.be.an('object')
    })
    it('should have property css', () => {
      assetManager().assets.css.should.be.an('object')
    })
    it('should have property templates', () => {
      assetManager().assets.templates.should.be.an('object')
    })
  })
})
