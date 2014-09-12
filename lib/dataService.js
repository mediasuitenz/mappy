'use strict';

var EventEmitter    = require('events').EventEmitter
  , configValidator = require('./configValidator')

var pull = (url, cb) => {
  cb()
}

/**
 * Default DataService, pulls data from the server via ajax.
 * Will poll the server for data at regular intervals based on config
 *
 * DataServices provide the following interface
 * on('data') - consumers listen to dataservice for data events
 * getData()  - upon receiving a data event consumers call getData
 * start()    - Starts the dataservice
 */
class DataService extends EventEmitter {

  //@param config {object}
  constructor(config) {
    this.config = configValidator(['type', 'url', 'refresh'], config)
    this.url = config.url
    this.refresh = config.refresh
    this.data = []
  }

  //fetches whatever data the dataservice is holding
  //@return {object}
  getData() {
    return this.data
  }

  //starts the dataservice running
  start() {
    pull(this.config.url, () => {
      this.emit('data')
      setInterval(this.start, this.refresh)
    })
  }
}

/**
 * DataService for handling Server Sent Events
 * Performs a pull same as a longpoll DataService then sets up a listener for
 * server sent events to continue receiving updates from the server
 */
class SSEDataService extends DataService {

  constructor(config) {
    this.config = configValidator(['type', 'url'], config)
    this.url = config.url
    this.data = []
  }

  start() {
    //TODO:
  }
}

module.exports = function(type, config) {
  var dataServices = {
    sse: (config) => new SSEDataService(config),
    longPoll: (config) => new DataService(config)
  }

  return dataServices[type](config)
}
