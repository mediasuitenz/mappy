MAPPY
=====

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mediasuitenz/mappy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

WARNING: This library is under heavy development and should be considered ALPHA
We don't recommend using in production at this time.

[![Build Status](https://travis-ci.org/mediasuitenz/mappy.svg?branch=add%2Ftravis_ci)](https://travis-ci.org/mediasuitenz/mappy)

# Creating a map using mappy

- Clone this repo
- `npm install`
- Rename dist/example-config.js to config.js
- Customise properties of the config object (see 'Config in detail') in config.js
- `npm run build`
- use resulting `dist/bundle.js` and `dist/bundle.min.js` files


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

##### dataSources

Defines the data sources that the layers can use. There are currently 3 options
- `longPoll` for refreshing the data from a URL on an interval
- `singlePoll` to only load the data from a URL once
- `local` to not load any data automatically. Layer data can be added via `map.pushToDataService(dataSourceName, geojsonData)`

Data source definitions should be in format:
```js
{
  dataSources: [
    {
      name: 'my-api',
      type: 'longPoll' // longPoll, singlePoll, local
      refresh: 10000   // Interval to refresh the data from the endpoint, only required for longPoll
      request: { // for longPoll or singlePoll
        url: '/path/to/some/geojson/endpoint'
        // other options for xhr module (https://github.com/Raynos/xhr) can be passed in here e.g. headers: {}
      }
    }
  ]
}

```

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
      dataSource: 'my-api'
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

## External API
*Currently this API is fluid and should be considered unstable, though we will attempt to adhere to semver guidelines during ongoing development*

When creating an instance of Mappy from config, the return value is an object with a defined interface

Current API:
```js
showGeojsonLayer('layerName')
hideGeojsonLayer('layerName')

stopDataService('dataServiceName')
startDataService('dataServiceName')

pushToDataService('dataSourceName', geojsonData)
```

Example:
```js
// Will create map and load data from defined data sources
var map = window.Mappy.create(config);

map.hideGeojsonLayer('layerName') // assuming there was a layer called 'layerName' defined in config

// Example of how to add data manually using a local data source (or can overwrite data for any data source type)
$.getJSON(url).done(function (geojson) {
  pushToDataService('local-example', geojson)
})
```

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
```js
{
  domElementId: 'map',
  key: {
    domElementId: 'key',
    title: 'My map key'
  },
  tileLayers: {
    base-tiles: {
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '',
      maxZoom: 18,
      time: {
        on: '8:00',
        off: '11:00'
      },
      //any other leaflet tile layer options eg.
      zIndex: 100,
      opacity: 0.5
    }
  },
  bounds: [
    [-43.577988,172.515934],
    [-43.461397,172.749529]
  ],
  mapOptions: {
    maxZoom: 19
  }
}
```

### Layers
```js
[
    {
        name: 'Major Roadworks',
        description: 'This is layer 1',
        styles: {
            popup: {
                css: 'myPopupCssFile.css',
                template: 'myTemplate.html'
            },
            layer: {
                general: { // Roughly following leaflet dsl
                    stroke: true,
                    weight: 5
                },
                properties: {
                    weighting: {
                        2: {
                            stroke: true
                        },
                        5: {
                            stroke: false
                        }
                    },
                    lane: {
                        left: {
                            colour: 'green'
                        },
                        *: {
                            colour: 'black'
                        }
                    }
                }
            },
            icon: {
              general: {
                iconUrl: '/icons/leaf-green.png',
                shadowUrl: '/icons/leaf-shadow.png',
                iconSize: [38, 95],
                shadowSize: [50, 64],
                iconAnchor: [22, 94],
                shadowAnchor: [4, 62],
                popupAnchor: [-3, -76]
              },
              properties: {
                highway: {
                  traffic_signals: {
                    iconUrl: '/icons/leaf-red.png'
                  },
                  crossing: {
                    iconUrl: '/icons/leaf-orange.png'
                  }
                }
              },
              "cluster": {
                "showCoverageOnHover": false
              }
            }
        },
        sortOrder: 1, // used to order in key and map layer zindex
        startVisible: true // whether to display the layer on map load
        defaultLayerType: false || 'default', // false would mean this layer is off if the zoom level is outside
                                                // the levels defined in the 'zoom' config
                                                // 'default', 'heatmap', 'cluster', etc
        zoom: [
            {
                min: 4,
                max: 8,
                type: 'heatmap'
            },
            {
                min: 9,
                max: 16,
                type: 'cluster'
            }
        ],
        dataSource: 'name-of-defined-dataSource'
    }
]
```

#### Icon config for layer styles
The keys in 'general' and 'properties' basically follow the leaflet dsl for the [Icon](http://leafletjs.com/reference.html#icon) class, allowing you to change the icon and its positioning as required.

In the 'general' section if you specify a `type: 'divIcon'` then the [DivIcon](http://leafletjs.com/reference.html#divicon) class is used instead, allowing you to specify the html for the icon. This template will be compiled via Handlebars, so you can interpolate properties from the feature that the marker icon is related to, similar to popups.

NOTE: DivIcon does not have a `iconUrl` option, so you'll need to add any images using CSS (likely background: url...)


### Key
You can either use the default, or define custom html to render the layer key template. Custom templates are parsed through the [handlebars](http://handlebarsjs.com/) templating engine, refer to the handlebar docs for further details.
```js
// default
{
  domElementId: 'key', // The dom element used to render the key.
  title: 'My map key',
  layers: [
    {
      name: 'layer1',
      description: 'My Layer',
      checked: true
    }
  ]
}

// custom template
{
  domElementId: 'key', // The dom element used to render the key.
  title: 'My map key',
  template: '<ul class="items"><ul/>', // Handlebars template used to render the key wrapper.
  itemTemplate: '<li><label for="{{key}}">{{#if text}}<span>{{text}}</span>{{/if}}<input type="checkbox" id="{{key}}" {{#if checked}}checked="checked"{{/if}}></label></li>', // Handlebars template used to render the key items.
  listWrapperClass: '.items', // Dom element in 'template' key wrapper used to render the key items.
  layers: [
    {
      name: 'layer1',
      description: 'My Layer',
      checked: true,
      templateData: { // optional data to pass through to the 'itemTemplate'
        example1: 'test' // can be referenced thrigh the 'itemTemplate' with 'templateData.example1'
      }
    }
  ]
}

```

## Clustering

Enable clustering on a layer by setting the "cluster" property on layer icon config to 'true', alternatively you can pass through options to override the default cluster settings.
You can refer to the [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) module documentation for configuration options.

### Possible values

To enable clustering
```js
cluster: true //default options
cluster: { ... } //overide default options
```
The following will disable clustering
```
cluster: false
cluster: null
cluster: undefined
```
If you specify an icon it will override `iconCreateFunction` to create the icon with the given config. If `showClusterCount` is also truthy then it will render div's instead, with the cluster count inside. See the example below, with css to show an image AND cluster count.

**Note:** If you want to use clustering with the default styling you will need to include
the default marker clusterer stylesheet. eg.

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/0.4.0/MarkerCluster.Default.css" />
```

### Clustering example

```js
{
  layers: [
    {
      name: 'layer1',
      ...
      styles: {
        icon: {
          cluster: {
            showCoverageOnHover: false,
            icon: {
              showClusterCount: true, // if false, specify normal icon options e.g. iconUrl
              iconClass: 'leafy-background',
              iconSize: [38, 95],
              iconAnchor: [22, 94],
              popupAnchor: [-3, -76]
            }
          }
        }
      }
    }
  ]
}
```
with CSS for the cluster count icon
```css
.leaflet-div-icon {
  background-color: transparent;
  border: none;
}
.leafy-background {
  background-image: url(/icons/leaf-green.png);
  width: 100%;
  height: 100%;
}
.leafy-background .cluster-count {
  text-align: center;
  padding-top: 15px;
}
```

## Google
To generate a Google tile base layer specify the 'google' type on the map property tileLayers config.
Include the Google javascript api to your project html `<script src="http://maps.google.com/maps/api/js?v=3&sensor=false"></script>`.
You can also specify a 'mapType' to display (see the [Google API](https://developers.google.com/maps/documentation/javascript/maptypes) for different map types). This will default to ROADMAP.
```js
var config = {
  map: {
    domElementId: 'map',
    tileLayers: {
      base-tiles: {
        type: 'google',
        maxZoom: 18,
        zIndex: 10,
        mapType: 'SATELLITE'
      }
    },
    bounds: [
      [-43.577988,172.515934],
      [-43.461397,172.749529]
    ]
  }
}
```
