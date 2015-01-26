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
    // Validation throws errors if fails
    configValidator(['type', 'request', 'refresh'], config)
    configValidator(['url'], config.request)

    this.config = config
    this.url = config.request.url
    this.refresh = config.refresh
    this.data = []
    this.isLoading = false
    this.isActive = false
  }

  //fetches whatever data the dataservice is holding
  //@return {object}
  getData() {
    return this.data
  }

  //starts the dataservice running
  start() {
    if (!this.isActive) {
      this.isActive = true
      this.pullData()
      this.timer = setInterval(
        this.pullData.bind(this), this.refresh
      )
    }
  }

  stop() {
    clearInterval(this.timer)
    delete this.timer
    this.isActive = false
  }

  pullData() {
    var ds = this
    if (!this.isLoading) {
      this.isLoading = true
      pull(this.config, (err, data) => {
        this.isLoading = false
        if (data) {
          ds.data = data
          ds.emit('data')
        }
      })
    }
  }
}

class SinglePollDataService extends DataService {

  //@param config {object}
  constructor(config) {
    configValidator(['type', 'request'], config)
    configValidator(['url'], config.request)

    this.config = config
    this.url = config.request.url
    this.data = []
  }

  start() {
    if (!this.isActive) {
      this.isActive = true
      this.pullData()
    }
  }

  stop() {
    this.isActive = false
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
    configValidator(['type', 'request'], config)
    configValidator(['url'], config.request)

    this.config = config
    this.url = config.request.url
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
