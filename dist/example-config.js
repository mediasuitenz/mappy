'use strict';

var config = {
  map: {
    'domElementId': 'map',
    'tileLayers': {
      'base-tiles': {
        'url': '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'attribution': '',
        'maxZoom': 18,
        'zIndex': 10,
        'time': {
          'on': '00:00',
          'off': '08:46'
        }
      },
      'aux-tiles': {
        'url': '//{s}.tiles.mapbox.com/v3/digitalsadhu.jbf3mhe1/{z}/{x}/{y}.png',
        'attribution': '',
        'maxZoom': 18,
        'zIndex': 10,
        'time': {
          'on': '08:46',
          'off': '23:59'
        }
      }
    },
    'bounds': [
      [-43.577988,172.515934],
      [-43.461397,172.749529]
    ]
  },
  layers: [
    {
      'name': 'layer1',
      'type': 'geojson',
      'enabled': true,
      'listens': [
        {
          listensTo: 'layer2',
          type: 'click',
          handler: function (feature, map) {
            map.hideGeojsonLayer('layer1')
          }
        }
      ],
      'filter': {
        'geometry': ['Point', 'LineString'],
        'properties': {
          'highway': ['traffic_signals']
        }
      },
      'styles': {
        'popup': {
          'template': '<h1>{{highway}}</h1>{{junction}}<br>{{lanes}}<br>{{maxspeed}}<br>{{oneway}}<br>{{id}}<br>',
          'filter': {
            'geometry': ['LineString'],
            'properties': {
              'highway': ['trunk']
            }
          }
        },
        'layer': {
          'general': {
            'stroke': true,
            'weight': 15,
            'opacity': 0.8
          },
          'properties': {
            'highway': {
              'trunk': {
                'color': 'green',
                'weight': 5,
                'opacity': 0.2
              },
              'motorway': {
                'color': 'red'
              }
            }
          }
        },
        'icon': {
          'general': {
            'iconUrl': '/icons/leaf-green.png',
            'shadowUrl': '/icons/leaf-shadow.png',
            'iconSize': [38, 95],
            'shadowSize': [50, 64],
            'iconAnchor': [22, 94],
            'shadowAnchor': [4, 62],
            'popupAnchor': [-3, -76]
          },
          'properties': {
            'highway': {
              'traffic_signals': {
                'iconUrl': '/icons/leaf-red.png'
              },
              'crossing': {
                'iconUrl': '/icons/leaf-orange.png'
              }
            }
          }
        }
      },
      'dataSource': {
        'url': '//geojson-spew.msapp.co.nz',
        'type': 'longPoll',
        'refresh': 10000
      }
    },
    {
      'name': 'layer2',
      'type': 'geojson',
      'enabled': true,
      'notifies': ['click'],
      'filter': {
        'geometry': ['Point', 'LineString'],
        'properties': {
          'highway': ['trunk']
        }
      },
      'styles': {
        'popup': {
          'template': '<h1>{{highway}}</h1>{{junction}}<br>{{lanes}}<br>{{maxspeed}}<br>{{oneway}}<br>{{id}}<br>',
          'filter': {
            'geometry': ['LineString'],
            'properties': {
              'highway': ['trunk']
            }
          }
        },
        'layer': {
          'general': {
            'stroke': true,
            'weight': 15,
            'opacity': 0.8
          },
          'properties': {
            'highway': {
              'trunk': {
                'color': 'blue',
                'weight': 5,
                'opacity': 0.2
              },
              'motorway': {
                'color': 'orange'
              }
            }
          }
        },
        'icon': {
          'general': {
            'iconUrl': '/icons/leaf-green.png',
            'shadowUrl': '/icons/leaf-shadow.png',
            'iconSize': [38, 95],
            'shadowSize': [50, 64],
            'iconAnchor': [22, 94],
            'shadowAnchor': [4, 62],
            'popupAnchor': [-3, -76]
          },
          'properties': {
            'highway': {
              'traffic_signals': {
                'iconUrl': '/icons/leaf-red.png'
              },
              'crossing': {
                'iconUrl': '/icons/leaf-orange.png'
              }
            }
          }
        }
      },
      'dataSource': {
        'url': '//geojson-spew.msapp.co.nz',
        'type': 'longPoll',
        'refresh': 10000
      }
    },
    {
      'name': 'click-layer',
      'type': 'click',
      'enabled': true,
      'styles': {
        'layer': {
          'general': {
            'stroke': true,
            'weight': 1,
            'opacity': 0.8,
            'color': '#000000'
          }
        }
      },
      'dataSource': {
        'type': 'singlePoll',
        'url': '//parsnip.msapp.co.nz/{x}/{y}'
      }
    }
  ],
  key: {
    'domElementId': 'key',
    'title': 'My map key',
    'layers': [
      {
        'name': 'layer1',
        'description': 'My Layer',
        'checked': true
      },
      {
        'name': 'layer2',
        'description': 'My Other Layer',
        'checked': true
      }
    ]
  }
};

var map = Mappy.create(config);
