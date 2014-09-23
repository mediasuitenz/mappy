'use strict';

var assetBundle = require('../config/assets/assetBundle.json')

class AssetManager {
  constructor() {
    this.assets_ = assetBundle
  }

  get assets() {
    return this.assets_
  }
}

module.exports = () => new AssetManager()
