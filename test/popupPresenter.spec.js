'use strict';

var should = require('chai').should()
var scenario = describe

var popupPresenter = require('../lib/popupPresenter')

var config = {
  template: '<h1>{{title}}</h1>'
}

describe('PopupPresenter', () => {

// Given some layer config
// And some feature properties
// Then generate popup content

  var presenter

  describe('creating a presenter from the factory', () => {
    scenario('with no config', () => {
      var invalidPresenter = popupPresenter()
      it('should not create a presenter', () => {
        should.not.exist(invalidPresenter)
      })
    })

    scenario('with valid config', () => {
      presenter = popupPresenter(config)
      it('should return an object', () => {
        presenter.should.be.an('object')
      })
    })
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

  describe('custom template function', () => {

    var customConfig = {
      template: 'here is some <<<template>>>',
      templateFunction: function (template, data) {
        return template.replace('<<<template>>>', data.title)
      }
    }

    var customPresenter = popupPresenter(customConfig)

    it('should use the custom templating function', () => {
      var template3 = customPresenter.present({ title: 'woahdude' })
      template3.should.contain('woahdude')
    })
  })

})
