'use strict';

var requiredKeys = ['url','type']

class DataService {
  constructor(config) {
    this.config = this.validate(config)
  }

  validate(config) {
    if (!config) throw new Error('DataService missing config object')
    requiredKeys.forEach((key) => {
      if (!config.hasOwnProperty(key)) {
        throw new Error('DataService config missing required key: ' + key)
      }
    })

    return config
  }

  getData() {
    return {
      "type": "FeatureCollection",
      "features": [
        {
            "type": "Feature",
            "id": "way/4243736",
            "properties": {
                "highway": "trunk"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        172.5498622,
                        -43.4932694
                    ],
                    [
                        172.5498622,
                        -43.4932694
                    ]
                ]
            }
        }
      ]
    }
  }

  load(cb) {
    return cb(null, {})
  }
}

module.exports = function(config) {
  return new DataService(config)
}
