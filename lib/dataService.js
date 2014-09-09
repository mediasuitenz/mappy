'use strict';

var requiredKeys = ['url','type']

class DataService {
  constructor(config) {
    this.config = this.validate(config)
  }

  validate(config) {
    requiredKeys.forEach((key) => {
      if (!config.hasOwnProperty(key)) {
        throw new Error('Missing required config key: ' + key)
      }
    })

    return config
  }

  load(cb) {
    return cb(null, {})
  }
}

module.exports = function(config) {
  return new DataService(config)
}
