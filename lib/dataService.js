'use strict';

var EventEmitter = require('events').EventEmitter

/**
 * Object to validate DataStrategy config objects
 */
class Config {
  constructor() {
    this.requiredKeys = ['url','type']
    this.messages = {
      missingConfig: 'DataService missing config object',
      missingKey: 'DataService config missing required key: '
    }
  }

  error(msg) {
    throw new Error(msg)
  }

  checkKeyValidity(config, key) {
    if (!config.hasOwnProperty(key))
      this.error(this.messages.missingKey + key)
  }

  validate(config) {
    if (!config) this.error(this.messages.missingConfig)
    this.requiredKeys.forEach((key) => this.checkKeyValidity(config, key))
    return config
  }
}

/**
 * Provides a service to handle whatever strategy needs to be
 * employed to get data from the server
 */
class DataService extends EventEmitter {
  constructor(config) {
    this.config = new Config().validate(config)
    this.data = null
  }

  getData() {
    return this.data
  }

  start() {
    this.emit('data')
  }

}

module.exports = function(config) {
  return new DataService(config)
}
