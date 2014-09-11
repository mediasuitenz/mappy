'use strict';

class Layer {
  constructor(config) {
    this.config = config
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
}

module.exports = function(config) {
  return new Layer(config)
}