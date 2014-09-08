'use strict';

//include env vars from .env file
require('envoodoo')()

//Make Ecmascript 6 features available via transpilation
var traceur = require('traceur');
traceur.require.makeDefault(function(filename) {
  // don't transpile our dependencies, just our app
  return filename.indexOf('node_modules') === -1
})

//any files included will be compiled using traceur es6 compiler
// eg. require('lib/app.js')
