'use strict';

var assert      = require('assert')
var fs          = require('fs')
var path        = require('path')
var handlebars  = require('handlebars')
var cssInjector = require('../wrappers/cssInjector')

var assetsPath = __dirname + '/../config/assets'

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
    assert.equal(typeof (config), 'object', '\'config\' arg must be an object')

    var templatePath = path.join(assetsPath, 'templates', config.template)
    this.template = handlebars.compile(fs.readFileSync(templatePath, 'utf-8'))

    var cssPath = path.join(assetsPath, 'css', config.css)
    cssInjector(fs.readFileSync(cssPath, 'utf-8'))
  }

  /**
   * Renders properties into a template string using template function
   * created in the constructor
   * @param {object} properties
   * @return {string}
   */
  present(properties) {
    assert.equal(typeof (properties), 'object', '\'properties\' arg must be an object')
    return this.template(properties)
  }
}

module.exports = (config) => new PopupPresenter(config)
