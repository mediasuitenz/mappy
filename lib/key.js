'use strict';

var fs           = require('fs')
var handlebars   = require('handlebars')
var assert       = require('assert')
var domWrapper   = require('../wrappers/dom')
var EventEmitter = require('events').EventEmitter
var dom

class Item extends EventEmitter {

  constructor(config) {
    this.key = config.name
    this.text = config.description
    this.checked = config.checked || false
    this.templateData = config.templateData
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
    this.items  = []
    this.groups = {}
    this.title = config.title || ''

    this.domElement = dom.getElementById(config.domElementId)

    this.template = handlebars.compile(config.template)

    // render the key wrapper into the domElement
    this.renderKey()
  }

  /**
   * Used to set the title of the key
   * @param {string} title
   */
  set title(title) {
    assert.equal(typeof title, 'string', '`title` must be a string')

    this.title_ = title
  }

  /**
   * Returns the title of the key
   */
  get title() {
    return this.title_
  }

  /**
   * Render the key container into the domElement.
   */
  renderKey() {
    var context = {
      title: this.title,
      items: this.items
    }
    this.domElement.innerHTML = this.template(context)
  }

  /**
   * Renders a single dom list element. Optional domElement arg can be passed
   * to tell renderItem where to render the item into
   * @param {object} item
   * @param {object} domElement
   */
  renderItem(item, domElement) {
    var template = handlebars.compile(this.config.itemTemplate)

    domElement.insertAdjacentHTML('beforeend', template(item))

    var checkbox = domElement.querySelector('input[id=\'' + item.key + '\']')
    checkbox.onclick = item.click.bind(item)
  }

  /**
   * Adds item to a specified domElement by some unique id.
   * Stores the item by id and renders item to the dom
   * @param {object} config
   * @param {string} group
   */
  addItem(config, group) {
    assert.equal(typeof config.name, 'string', '`id` must be a string')
    assert.equal(typeof config.description, 'string', '`text` must be a string')

    var item = new Item(config)
    item.on('change', this.emit.bind(this, 'layerToggle'))
    this.items.push(item)

    this.itemsContainer = this.domElement.querySelector(this.config.listWrapperClass)
    this.renderItem(item, this.groups[group] || this.itemsContainer)
  }

  /**
   * Creates a group that can be used to hold key items
   * @param {string} id
   * @param {string} text
   */
  createGroup(id, text) {
    assert.equal(typeof id, 'string', '`id` must be a string')
    assert.equal(typeof text, 'string', '`text` must be a string')

    var li = dom.createElement('li')
    this.domElement.querySelector(this.config.listWrapperClass).appendChild(li)

    var h2 = dom.createElement('h2')
    h2.innerHTML = text

    var ul = dom.createElement('ul')

    li.appendChild(h2)
    li.appendChild(ul)

    this.groups[id] = ul
  }
}

module.exports = function (config) {
  dom = domWrapper()
  assert.equal(typeof config, 'object', '`config` must be an object')
  assert.ok(!!config.domElementId, '`config.domElement` must be defined')
  return new Key(config)
}
