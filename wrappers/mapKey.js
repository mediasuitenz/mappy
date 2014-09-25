'use strict';

var fs          = require('fs')
var template    = fs.readFileSync(__dirname + '/../templates/key.html', 'utf8')
var handlebars  = require('handlebars')
var keyTemplate = handlebars.compile(template)

class MapKey {
  constructor(config) {
    this.config = config
    this.title_ = ''
    this.domElement = document.getElementById(config.domElement)
    this.domElement.innerHTML = keyTemplate()
  }

  set title(title) {
    this.title_ = title
    this.domElement.querySelector('.title').innerHTML = title
  }

  get title() {
    return this.title_
  }
}

module.exports = function (config) {
  return new MapKey(config)
}
