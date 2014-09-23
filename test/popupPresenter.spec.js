'use strict';

require('chai').should()

var popupPresenter = require('../lib/popupPresenter')


var config = {
  'css': 'myPopupCssFile.css',
  'template': 'myTemplate.html'
}


describe('PopupPresenter', () => {

// Given some layer config
// And template/css files
// And some feature properties
// Then generate popup content

  var renderer = popupPresenter(config)

  it('should return a function', () => {
    renderer.should.be.a('function')
  })

  describe('renderer function', () => {
    var template = renderer({ title: 'hello world' })
    var template2 = renderer({ title: 'hello mars' })
    
    it('should create a template', () => {
      template.should.be.a('string')
    })

    describe('returned template', () => {
      it('should contain given property values', () => {
        template.should.contain('hello world')
        template2.should.contain('hello mars')
      })
    })
  })
  
})
