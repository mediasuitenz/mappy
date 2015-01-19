MAPPY
=====

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mediasuitenz/mappy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

WARNING: This library is under heavy development and should be considered ALPHA
We don't recommend using in production at this time.

[![Build Status](https://travis-ci.org/mediasuitenz/mappy.svg?branch=add%2Ftravis_ci)](https://travis-ci.org/mediasuitenz/mappy)

# Creating a map using mappy

- Clone this repo
- run `npm install`
- Rename dist/example-config.js to config.js
- Customise properties of the config object in config.js

# Developing mappy

- run `npm run build:dev` to produce a non minified map bundle file
- and/or run `npm run build:prod` to produce a minified map bundle file.

## Installation

You can use this project to build various javascript map bundles from config.

### Quickstart

- clone the repo
- `npm install`
- `npm run build`
- use resulting `dist/bundle.js` and `dist/bundle.min.js` files

### Config in detail

Configuration is a javascript object with three properties: map, layers and key

##### key

Defines the map key (optional)

##### layers

Defines an array of layers to plot on the map. Currently types `geojson` and
`click` are supported.

- Type `geojson` can be used to render a geojson feature collection on the map
- Type `click` can be used to wire up user clicks to external services

###### Geojson layers

The main way that layers are loaded into mappy is via geojson.
A geojson layer can be added defining a layer of type = geojson in the layers
array of the config object

```js
{
  layers: [
    {
      name: 'my-first-layer',
      type: 'geojson',
      enabled: true,
      dataSource: {
        request: {
          url: '/path/to/some/geojson/endpoint'
        },
        type: 'SinglePoll'
      }
    }
  ]
}
```

Assuming that valid geojson was returned, a layer of data should be plotted on
the map.

###### Geojson layer relationships

If you have multiple layers defined for your map and you would like some layers
to react to user interactions on another layer you can define pub/sub like
relationships between layers.

On one layer we specify that any user actions of the specified type(s) performed on
the layer should be 'notified' to any other interested layers

```js
{
  name: 'my-first-layer',
  type: 'geojson',
  notifies: ['click'],
  //...
}
```

Then, on another layer we specify that we are interested in any user clicks on
'my-first-layer', registering a handler like so:

```js
{
  name: 'my-second-layer',
  type: 'geojson',
  listens: [
    {
      listensTo: 'my-first-layer',
      type: 'click',
      handler: function (feature, map) {
        map.hideGeojsonLayer('my-second-layer')
      }
    }
  ],
  //...
}
```

the registered handler function gets passed the feature that the user clicked on
as the first parameter and the map object as the second

##### map

Defines details about the map such as tilelayers

#### assets

Templates for popups are defined as string properties in the config object. You can
also optionally define a templateFunction property that accepts a template string
and data object. If the templateFunction property is not present Handlebars will be
used as the templating engine

CSS for your templates must be included separately.

#### More information

See dist/example-config.js for existing features

## Development

To work on the project:

- clone the repo
- `npm install`
- run `npm test` to start the test runner
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
  "mapOptions": {
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
            "request": {
                "url": "..."
            },
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
To generate a Google tile base layer specify the 'google' type on the map property tileLayers config.
Include the Google javascript api to your project html `<script src="http://maps.google.com/maps/api/js?v=3&sensor=false"></script>`.
You can also specify a 'mapType' to display (see the [Google API](https://developers.google.com/maps/documentation/javascript/maptypes) for different map types). This will default to ROADMAP.
```
var config = {
  map: {
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
}
```
