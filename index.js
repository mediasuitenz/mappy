'use strict';

if (!window) {
  //Make Ecmascript 6 features available via transpilation
  var traceur = require('traceur');
  traceur.require.makeDefault(function(filename) {
    // don't transpile our dependencies, just our app
    return filename.indexOf('node_modules') === -1
  })
}

//any files included will be compiled using traceur es6 compiler
// eg. require('lib/app.js')
require('./patch/functionName');

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
