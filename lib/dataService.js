'use strict';

var EventEmitter    = require('events').EventEmitter
  , configValidator = require('./configValidator')
  , pull            = require('../wrappers/pull')

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
    if (!this.isActive) {
      this.pullData()
      this.timer = setInterval(
        this.pullData.bind(this), this.refresh
      )
    }
  }

  stop() {
    clearInterval(this.timer)
    delete this.timer
  }

  get isActive() {
    return !!this.timer
  }

  pullData() {
    var ds = this
    pull(this.config, (err, data) => {
      if (data) {
        ds.data = data
        ds.emit('data')
      }
    })
  }
}

class SinglePollDataService extends DataService {

  //@param config {object}
  constructor(config) {
    this.config = configValidator(['type', 'url'], config)
    this.url = config.url
    this.data = []
  }

  start() {
    this.pullData()
  }

  stop() {
    //noop
  }
}

/**
 * DataService for handling Server Sent Events
 * Performs a pull same as a longpoll DataService then sets up a listener for
 * server sent events to continue receiving updates from the server
 */
class SSEDataService extends DataService {

  //@overide
  constructor(config) {
    this.config = configValidator(['type', 'url'], config)
    this.url = config.url
    this.data = []
  }

  //@overide
  start() {
    pull(this.config, (err, data) => {
      this.data = data
      this.emit('data')
      //TODO: implement SSE setup
    })
  }
}

/**
 * Module interface
 * @param  {object} config
 * @return {DataService}
 */
module.exports = function(config) {
  var dataServices = {
    sse: (config) => new SSEDataService(config),
    longPoll: (config) => new DataService(config),
    singlePoll: (config) => new SinglePollDataService(config)
  }

  return dataServices[config.type](config)
}
