'use strict';

var messages = {
  missingConfig: 'Required config object is missing',
  missingKey: 'Config object is missing required key: '
}

/**
 * Object to validate DataStrategy config objects
 */
class Config {
  constructor(requiredKeys) {
    this.requiredKeys = requiredKeys
  }

  error(msg) {
    throw new Error(msg)
  }

  checkKeyValidity(config, key) {
    if (!config.hasOwnProperty(key))
      this.error(messages.missingKey + key)
  }

  validate(config) {
    if (!config) this.error(messages.missingConfig)
    this.requiredKeys.forEach((key) => this.checkKeyValidity(config, key))
    return config
  }
}


module.exports = function (schema, config) {
  return new Config(schema).validate(config)
}
