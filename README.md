TFC MAP
=======

## Feature list
### Client
* store user preferences (basemap/layers on)
* make use of config as much as possible
* possiblity to have many maps generated from different geojson based data sets
* backend should be able to push updates
* default layer, on by default layers

### Server
* possibility to send updates to the client
* adaptors for feeds to node service which can then diff for changes and send server sent events (sse's) to connected clients

## Config details

### Map
```json
{
  "domElementId": "map",
  "key": {
    "domElementId": "key",
    "title": "My map key"
  },
  "tileLayers": {
    "base-tiles": {
      "url": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "attribution": "",
      "maxZoom": 18,
      "time": {
        "on": "8:00",
        "off": "11:00"
      }
    }
  },
  "bounds": [
    [-43.577988,172.515934],
    [-43.461397,172.749529]
  ]
}
```

### Layers
```json
[
    {
        "name": "Major Roadworks",
        "description": "This is layer 1",
        "styles": {
            "popup": {
                "css": "myPopupCssFile.css",
                "template": "myTemplate.html"
            },
            "layer": {
                "general": { // Roughly following leaflet dsl
                    "stroke": true,
                    "weight": 5
                },
                "properties": {
                    "weighting": {
                        "2": {
                            "stroke": true
                        },
                        "5": {
                            "stroke": false
                        }
                    },
                    "lane": {
                        "left": {
                            "colour": "green"
                        },
                        "*": {
                            "colour": "black"
                        }
                    }
                }
            },
            "icon": {
              "general": {
                "iconUrl": "/icons/leaf-green.png",
                "shadowUrl": "/icons/leaf-shadow.png",
                "iconSize": [38, 95],
                "shadowSize": [50, 64],
                "iconAnchor": [22, 94],
                "shadowAnchor": [4, 62],
                "popupAnchor": [-3, -76]
              },
              "properties": {
                "highway": {
                  "traffic_signals": {
                    "iconUrl": "/icons/leaf-red.png"
                  },
                  "crossing": {
                    "iconUrl": "/icons/leaf-orange.png"
                  }
                }
              }
            }
        },
        "sortOrder": 1, // used to order in key and map layer zindex
        "startVisible": true // whether to display the layer on map load
        "defaultLayerType": false || "default", // false would mean this layer is off if the zoom level is outside
                                                // the levels defined in the "zoom" config
                                                // "default", "heatmap", "cluster", etc
        "zoom": [
            {
                "min": 4,
                "max": 8,
                "type": "heatmap"
            },
            {
                "min": 9,
                "max": 16,
                "type": "cluster"
            }
        ],
        "dataSource": {
            "url": "...",
            "type": "longPoll",
            "refresh": 10000
        }
        "postProcess": {
            "laneSplit": true // true happens on load,
                              // string key or array of keys 'onzoom', ['onzoom', 'onpan']
        }
    }
]
```
