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

var dataStrategies = {
  sse: (config) => new SSEDataStrategy(config),
  longPoll: (config) => new LongPollDataStrategy(config)
}

function dataStrategyFactory(config) {
  return dataStrategies[config.type](config)
}

class LongPollDataStrategy {
  constructor(config) {
    this.url = config.url
    this.refresh = config.refresh
  }
}

class SSEDataStrategy {
  constructor(config) {
    this.url = config.url
  }
}

/**
 * Provides a service to handle whatever strategy needs to be
 * employed to get data from the server
 */
class DataService extends EventEmitter {
  constructor(config) {
    this.config = new Config().validate(config)
    this.dataStrategy = dataStrategyFactory(config)
    this.data = []
  }

  getData() {
    return this.data
  }

  start() {
    this.dataStrategy.on('data', (data) => {
      this.data = data
      this.emit('data')
    })
    this.dataStrategy.start()
  }

}

module.exports = function(config) {
  return new DataService(config)
}
