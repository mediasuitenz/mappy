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
    "tileLayers": [
        {
            "name": "Default",
            "url": "http://...",
            "time": {
                "on": "8:00",
                "off": "11:00"
            }
        }
    ]
}
```

### Layers
```json
[
    {
        "name": "Major Roadworks",
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
            }
        },
        "priority": 1, // used to order in key and map layer zindex
        "icon": "",    // icon used for markers
        "visibleByDefault": true // whether to display the layer on map load
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
