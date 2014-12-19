TFC MAP
=======

# Creating a map using mappy

- Clone this repo
- run `npm install`
- Rename config-example to config as a starting point
- Customise the files in the config folder
- run `npm run build:assets` to bundle up the config directory into a single .json file
- run `npm run build:dev` to produce a non minified map bundle file
- and/or run `npm run build:prod` to produce a minified map bundle file.
- Profit???

# Developing mappy

## Installation

You can use this project to build various javascript map bundles from config.

### Quickstart

- clone the repo
- `npm install`
- `export CONFIG_URL=<url location of config>`
- `npm run build`
- use resulting `dist/bundle.js` and `dist/bundle.min.js` files

### Config in detail

Configuration is a collection of json files, html templates and css files

#### Required files

##### key.json

Defines the map key

##### layers.json

Defines an array of layers to plot on the map. Currently types `geojson` and
`click` are supported.

- Type `geojson` can be used to render a geojson feature collection on the map
- Type `click` can be used to wire up user clicks to external services

##### map.json

Defines details about the map such as tilelayers

#### assets

In the aforementioned config files, there are situations where templates and css
can be defined. Such files should be placed in `config/assets/templates` and
`config/assets/css`

#### More information

See the `config-example` folder for examples of config and template files

## Development

To work on the project:

- clone the repo
- `npm install`
- In a term run `npm run start:configserver` to start a local config server (serves up config-example folder)
- export CONFIG_URL=http://127.0.0.1:3002
- In another terminal run `npm test` to start the test runner
- In another terminal run `npm run start:dev` to serve the dist dir, bundle files and
watch for file changes. Visit `localhost:3000` to see the map

## Ongoing development notes

### Client
* store user preferences (basemap/layers on)
* make use of config as much as possible
* possiblity to have many maps generated from different geojson based data sets
* backend should be able to push updates
* default layer, on by default layers

### Server
* possibility to send updates to the client
* adaptors for feeds to node service which can then diff for changes and send server sent events (sse's) to connected clients

### Testing
* Set up automated cross-browser testing

## Browser Compatibility
*WIP, see 'Ongoing development notes' above*
Manually tested in:
- IE 9, 10, 11
- Chrome 39
- Firefox 33
- Safari 8

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
      },
      //any other leaflet tile layer options eg.
      "zIndex": 100,
      "opacity": 0.5
    }
  },
  "bounds": [
    [-43.577988,172.515934],
    [-43.461397,172.749529]
  ],
  "_leafletOptions": {
    maxZoom: 19
  }
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

## Google
To generate a Google tile base layer specify the 'google' type on the map.json tileLayers config.
Include the Google javascript api to your project html `<script src="http://maps.google.com/maps/api/js?v=3&sensor=false"></script>`.
You can also specify a 'mapType' to display (see the [Google API](https://developers.google.com/maps/documentation/javascript/maptypes) for different map types). This will default to ROADMAP.
```json
{
  "domElementId": "map",
  "tileLayers": {
    "base-tiles": {
      "type": "google",
      "maxZoom": 18,
      "zIndex": 10,
      "mapType": "SATELLITE"
    }
  },
  "bounds": [
    [-43.577988,172.515934],
    [-43.461397,172.749529]
  ]
}
```
