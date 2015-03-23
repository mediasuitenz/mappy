'use strict';

var assert       = require('assert')
var handlebars   = require('handlebars')

/**
 * Class to handle css and html template for a layers popup generation
 * Css is injected into the dom and a function is returned via 'present'
 * that can be used by the map on a per geosjon feature basis
 */
class PopupPresenter {

  /**
   * Creates a template function from config and injects given layer css
   * file into the dom
   */
  constructor(config) {
    // assert.equal(typeof (config), 'object', '\'config\' arg must be an object')

    if (typeof config !== 'undefined') {
      var templateContent = config.template
      this.template = handlebars.compile(templateContent)

    }
    this.config = config
  }

  /**
   * Renders properties into a template string using template function
   * created in the constructor
   * @param {object} properties
   * @return {string}
   */
  present(properties) {
    if (typeof this.config === 'undefined') return
    assert.equal(typeof (properties), 'object', '\'properties\' arg must be an object')
    if (typeof this.config.templateFunction === 'function') {
      return this.config.templateFunction(this.config.template, properties)
    }
    return this.template(properties)
  }
}

module.exports = (config) => { if (!!config) return new PopupPresenter(config) }
