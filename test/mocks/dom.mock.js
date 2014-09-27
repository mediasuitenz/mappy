'use strict';

var element = {
  appendChild: () => {},
  setAttribute: () => {},
  querySelector: () => {
    return {
      appendChild: () => {},
      setAttribute: () => {}
    }
  },
  querySelectorAll: () => {
    return [{
      appendChild: () => {},
      setAttribute: () => {},
      querySelector: () => {
        return {}
      }
    }]
  }
}

var doc = {
  getElementById: () => element,
  createElement: () => element,
  createTextNode: () => element
}

module.exports = () => doc
