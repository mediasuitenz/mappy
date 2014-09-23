'use strict';

var fs   = require('fs')
var path = require('path')

var assetBundle = {}

function bundle(type) {
  var files = fs.readdirSync(path.join(__dirname, type))
  files.forEach(function(file) {
    var contents = fs.readFileSync(file, 'utf-8')
    var filename = path.basename(file)
    assetBundle[type][filename] = contents
  })
}

bundle('css')
bundle('templates')

fs.createFileSync(path.join(__dirname, 'assetBundle.json'))
