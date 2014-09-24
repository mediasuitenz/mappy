'use strict';

var fs   = require('fs')
var path = require('path')

var assetPath = __dirname

// Defines the valid extensions for the asset types
var typeExtensions = {
  css: '.css',
  templates: '.html'
}

var assetBundle = {}
/**
 * Bundles files with an appropriate extension into an
 * external object with filename keys and file contents values
 * @param  {string} assetType The name of a directory within the assets folder
 */
function bundle(assetType) {
  assetBundle[assetType] = {}

  var assetTypePath = path.join(assetPath, assetType)
  var files = fs.readdirSync(assetTypePath)

  files.forEach(function(file) {
    if (path.extname(file) === typeExtensions[assetType]) {
      var contents = fs.readFileSync(path.join(assetTypePath, file), 'utf-8')
      var filename = path.basename(file)

      assetBundle[assetType][filename] = contents
    }
  })
}

// Loop over the asset types and bundle them
Object.keys(typeExtensions).forEach(function (assetType) {
  bundle(assetType)
})

// Create the bundled json file
fs.writeFileSync(
  path.join(__dirname, 'assetBundle.json'),
  JSON.stringify(assetBundle)
)
