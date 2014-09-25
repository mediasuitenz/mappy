'use strict';

var element = {
  querySelector: () => {
    return {
      innerHTML: '',
      appendChild: () => {
        return {}
      }
    }
  }
}

var doc = {
  getElementById: () => element,
  createElement: () => element
}

module.exports = () => doc
