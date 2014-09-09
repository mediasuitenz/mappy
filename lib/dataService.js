'use strict';

var requiredKeys = ['url','type']

class DataService {
  constructor(config) {
    this.config = this.validate(config)
  }

  validate(config) {
    if (!config) throw new Error('DataService missing config object')
    requiredKeys.forEach((key) => {
      if (!config.hasOwnProperty(key)) {
        throw new Error('DataService config missing required key: ' + key)
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
