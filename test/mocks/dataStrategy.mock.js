'use strict';

var EventEmitter = require('events').EventEmitter

class DataStrategy extends EventEmitter {
  start() {
    this.emit('data', {})
  }
}

module.exports = () => {

  return new DataStrategy()

}

