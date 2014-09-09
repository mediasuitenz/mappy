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
            //get design inputs, likely design of a popup etc.
            //title, description and a table of data?
            "h1": "#f3f3f3"
        },
        "priority": 1,
        "icon": "",
        "visiblebByDefault": true,
        "zoom": [
            {
                "min": 4,
                "max": 16,
                "type": "heatmap"
            },
            {
                "min": 4,
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
            "laneSplit": true
        }
    }
]
```
