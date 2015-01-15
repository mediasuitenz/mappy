'use strict';

class Mediator {

  constructor() {
    this._data = {}
  }

  register(listenerConfig) {
    var listensTo = listenerConfig.listensTo
    var type = listenerConfig.type
    var handler = listenerConfig.handler

    if (!this._data[listensTo]) this._data[listensTo] = {}
    if (!this._data[listensTo][type]) this._data[listensTo][type] = []

    this._data[listensTo][type].push(handler)
  }

  notify(eventType, layerName, feature, map) {
    if (this._data[layerName] && this._data[layerName][eventType]) {
      var handlers = this._data[layerName][eventType]
      handlers.forEach((handler) => {
        handler(feature, map)
      })
    }
  }
}

module.exports = () => new Mediator()
