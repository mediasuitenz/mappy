'use strict';

var fs           = require('fs')
var template     = fs.readFileSync(__dirname + '/../templates/key.html', 'utf8')
var handlebars   = require('handlebars')
var keyTemplate  = handlebars.compile(template)
var assert       = require('assert')
var domWrapper   = require('../wrappers/dom')
var EventEmitter = require('events').EventEmitter
var dom

class Item extends EventEmitter {

  constructor(key, text, checked) {
    this.key = key
    this.text = text
    this.checked = checked || false
  }

  click() {
    this.checked = !this.checked
    this.emit('change', {
      key: this.key,
      text: this.text,
      checked: this.checked
    })
  }
}

/**
 * Class to handle reading and writing to the map key dom structure
 */
class Key extends EventEmitter {

  /**
   * @constructor
   */
  constructor(config) {
    this.config = config
    this.items = []
    this.domElement = dom.getElementById(config.domElementId)
    this.domElement.innerHTML = keyTemplate()
    this.title = config.title || ''
  }

  /**
   * Used to set the title of the key
   * @param {string} title
   */
  set title(title) {
    assert.equal(typeof title, 'string', '`title` must be a string')

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
   * Clears all key dom elements. Explicit unsets to avoid memory leaks
   * in hateful ie.
   */
  clearDomElements() {
    var itemContainer = this.domElement.querySelector('.items')
    var items = this.domElement.querySelectorAll('li')
    items.forEach((item) => {
      item.querySelector('checkbox').onclick = null
      item.innerHTML = null
      item = null
    })
    itemContainer.innerHTML = null
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
    var li = dom.createElement('li')
    var checkbox = dom.createElement('input')
    var text = dom.createTextNode(item.text)
    var label = dom.createElement('label')

    if (item.checked) checkbox.setAttribute('checked', true)
    else checkbox.removeAttribute('checked')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.onclick = item.click.bind(item)

    label.appendChild(checkbox)
    label.appendChild(text)

    li.appendChild(label)
    this.domElement.querySelector('.items').appendChild(li)
  }

  /**
   * Adds item by some unique id. Stores the item by id and renders item
   * to the dom
   * @param {string} id
   * @param {string} text
   * @param {boolean} checked
   */
  addItem(id, text, checked = false) {
    assert.equal(typeof id, 'string', '`id` must be a string')
    assert.equal(typeof text, 'string', '`text` must be a string')

    var item = new Item(id, text, checked)
    item.on('change', this.emit.bind(this, 'layerToggle'))
    this.items.push(item)
    this.renderDomElement(item)
  }

  /**
   * Removes an item by unique id. Trims back the internal collection of items
   * before clearing and re-rendering the collection to the dom
   * @param {string} id
   */
  removeItem(id) {
    assert.equal(typeof id, 'string', '`id` must be a string')

    var length = this.items.length
    this.items = this.items.filter((item) => {
      if (item.key === id) {
        item.removeAllListeners('click')
        return false
      }
      return true
    })
    if (length !== this.items.length) {
      this.clearDomElements()
      this.renderDomElements()
    }
  }
}

module.exports = function (config) {
  dom = domWrapper()
  assert.equal(typeof config, 'object', '`config` must be an object')
  assert.ok(!!config.domElementId, '`config.domElement` must be defined')
  return new Key(config)
}
