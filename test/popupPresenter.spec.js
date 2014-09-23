'use strict';

require('chai').should()

var rewire = require('rewire')
var popupPresenter = rewire('../lib/popupPresenter')

popupPresenter.__set__('assetsPath', __dirname + '/mocks')

var config = {
  'css': 'myPopupCssFile.css',
  'template': 'myTemplate.html'
}


describe('PopupPresenter', () => {

// Given some layer config
// And template/css files
// And some feature properties
// Then generate popup content

  var presenter = popupPresenter(config)

  it('should return an object', () => {
    presenter.should.be.an('object')
  })

  describe('presenter object', () => {
    var template = presenter.present({ title: 'hello world' })
    var template2 = presenter.present({ title: 'hello mars' })
    
    it('should present a template', () => {
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
