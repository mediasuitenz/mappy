'use strict';

var EventEmitter = require('events').EventEmitter

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

class DataService extends EventEmitter {
  constructor(config) {
    this.config = new Config().validate(config)
    this.data = null
  }

  getData() {
    return this.data
  }

  load(cb) {
    return cb(null, {})
  }
}

module.exports = function(config) {
  return new DataService(config)
}
