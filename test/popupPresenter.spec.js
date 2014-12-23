'use strict';

require('chai').should()

var rewire = require('rewire')
var popupPresenter = require('../lib/popupPresenter')

var config = {
  template: '<h1>{{title}}</h1>'
}

describe('PopupPresenter', () => {

// Given some layer config
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
