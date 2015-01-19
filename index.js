'use strict';

(function (window, document, undefined) {
var oldMappy = window.Mappy
var Mappy = require('./lib/main')

//Node style module export
if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = Mappy;
}

/**
 * Resets the window.Mappy variable to its original state and returns
 * the Mappy object
 */
Mappy.noConflict = function () {
  window.Mappy = oldMappy;
  return this;
};

window.Mappy = Mappy;

})(window, document)
