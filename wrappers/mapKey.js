'use strict';

var fs          = require('fs')
var template    = fs.readFileSync(__dirname + '/../templates/key.html', 'utf8')
var handlebars  = require('handlebars')
var keyTemplate = handlebars.compile(template)

/**
 * Class to handle reading and writing to the map key dom structure
 */
class MapKey {

  /**
   * @constructor
   */
  constructor(config) {
    this.config = config
    this.title_ = ''
    this.items = []
    this.domElement = document.getElementById(config.domElement)
    this.domElement.innerHTML = keyTemplate()
  }

  /**
   * Used to set the title of the key
   * @param {string} title
   */
  set title(title) {
    this.title_ = title
    this.domElement.querySelector('.title').innerHTML = title
  }

  /**
   * Returns the title of the key
   */
  get title() {
    return this.title_
  }

  /**
   * Clears all key dom elements
   */
  clearDomElements() {
    this.domElement.querySelector('.items').innerHTML = ''
  }

  /**
   * Renders all key item data from memory onto the dom
   * creates a dom node for each item and inserts into list
   */
  renderDomElements() {
    this.items.forEach((item) => {
      this.renderDomElement(item)
    })
  }

  /**
   * Renders a single dom list element into items list from item object
   * @param {object} item
   */
  renderDomElement(item) {
    var li = document.createElement('li')
    li.innerHTML = item.value
    this.domElement.querySelector('.items').appendChild(li)
  }

  /**
   * Adds item by some unique id. Stores the item by id and renders item
   * to the dom
   * @param {string} id
   * @param {object} item
   */
  addItem(id, item) {
    item = {key: id, value: item}
    this.items.push(item)
    this.renderDomElement(item)
  }

  /**
   * Removes an item by unique id. Trims back the internal collection of items
   * before clearing and re-rendering the collection to the dom
   * @param {string} id
   */
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
