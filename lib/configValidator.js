'use strict';

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


module.exports = function (schema, config) {
  return new Config(schema).validate(config)
}
