'use strict';

class DataService {

  constructor(config) {
    this.config = config
  }

  load(cb) {
    return cb(null, {})
  }
}

module.exports = function(config) {
  return new DataService(config)
}