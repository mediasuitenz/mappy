'use strict';

var EventEmitter = require('events').EventEmitter

/**
 * Object to validate DataStrategy config objects
 */
class Config {
  constructor(requiredKeys) {
    this.requiredKeys = requiredKeys
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

class DataStrategy extends EventEmitter {
  constructor(config) {
    new Config(['url']).validate(config)
    this.url = config.url
  }

  start() {

  }
}

class LongPollDataStrategy extends DataStrategy {
  constructor(config) {
    new Config(['url', 'refresh']).validate(config)
    this.url = config.url
    this.refresh = config.refresh
  }

  pull() {
    //TODO: fetch data from server via an ajax request
  }

  start() {
    //TODO: call pull
    //TODO: emit data event
    //TODO: setup timeout to call pull() again every config.refresh milliseconds
  }
}

class SSEDataStrategy extends DataStrategy {
  start() {
    //TODO:
  }
}

/**
 * Provides a service to handle whatever strategy needs to be
 * employed to get data from the server
 */
class DataService extends EventEmitter {
  constructor(config) {
    this.config = new Config(['type']).validate(config)
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
