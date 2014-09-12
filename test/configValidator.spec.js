'use strict';

require('chai').should()

var configValidator = require('../lib/configValidator')
  , assert          = require('assert')

describe('configValidator', () => {

    it('should balk at an invalid config object', () => {
      //Given an invalid config object
      var config = {}
      //Given a schema array
      var schema = ['url', 'type', 'refresh']

      //When we run configValidator with bad config Then we expect an exception
      assert.throws(
        () => { configValidator(schema, config) },
        (err) => {
          return err.message === 'Config object is missing required key: url'
        },
        'configValidator did not throw expected error'
      )
    })

    it('should freak out at a null config object', () => {
      //Given an invalid config object
      var config = null
      //Given a schema array
      var schema = ['url', 'type', 'refresh']

      //Then
      assert.throws(
        () => { configValidator(schema, config) },
        (err) => {
          return err.message === 'Required config object is missing'
        },
        'configValidator did not throw expected error'
      )
    })

    it('should bail when given a string for a config object', () => {
      //Given an invalid config object
      var config = 'wtf were you thinking?'
      //Given a schema array
      var schema = ['url', 'type', 'refresh']

      //Then
      assert.throws(
        () => { configValidator(schema, config) },
        (err) => {
          return !!err.message
        },
        'DataService did not throw an error'
      )
    })

    it('should return given config if no errors are detected', () => {
      //Given valid config
      var validConfig = {
        url: '...',
        type: 'longPoll',
        refresh: 10000
      }
      //Given a config schema
      var schema = ['url', 'type', 'refresh']

      //When we validate
      var config = configValidator(schema, validConfig)

      //Then we should expect the config object
      config.url.should.equal('...')
    })


})
