'use strict';

var assert = require('assert')

var assetsPath = __dirname + '/../config/assets'

class PopupPresenter {
  constructor(config) {
    assert.equal(typeof (config), 'object', '\'config\' arg must be an object')
    this.config = config
  }

  present(properties) {
    return 'hello world'
  }
}

module.exports = (config) => new PopupPresenter(config).present
