'use strict';

var fs          = require('fs')
var template    = fs.readFileSync(__dirname + '/../templates/key.html', 'utf8')
var handlebars  = require('handlebars')
var keyTemplate = handlebars.compile(template)

class MapKey {
  constructor(config) {
    this.config = config
    this.title_ = ''
    this.items = []
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

  clearDomElements() {
    this.domElement.querySelector('.items').innerHTML = ''
  }

  renderDomElements() {
    this.items.forEach((item) => {
      this.renderDomElement(item)
    })
  }

  renderDomElement(item) {
    var li = document.createElement('li')
    li.innerHTML = item.value
    this.domElement.querySelector('.items').appendChild(li)
  }

  addItem(id, item) {
    item = {key: id, value: item}
    this.items.push(item)
    this.renderDomElement(item)
  }

  removeItem(id) {
    var length = this.items.length
    this.items = this.items.filter((item) => {
      return item.key !== id
    })
    if (length !== this.items.length) {
      this.clearDomElements()
      this.renderDomElements()
    }
  }
}

module.exports = function (config) {
  return new MapKey(config)
}
