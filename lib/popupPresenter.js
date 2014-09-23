'use strict';

var assert = require('assert')
  , fs = require('fs')
  , path = require('path')
  , handlebars = require('handlebars')

var assetsPath = __dirname + '/../config/assets'

class PopupPresenter {
  constructor(config) {
    assert.equal(typeof (config), 'object', '\'config\' arg must be an object')

    var templatePath = path.join(assetsPath, 'templates', config.template)
    this.template = handlebars.compile(fs.readFileSync(templatePath, 'utf-8'))
  }

  present(properties) {
    return this.template(properties)
  }
}

module.exports = (config) => new PopupPresenter(config)
