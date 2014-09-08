TFC MAP
=======

## Config details

- store user preferences (basemap/layers on)
- make use of config as much as possible

//map
{
    tileLayers: [
        {
            name: "Default",
            url: "http://...",
            time: {
                on: "8:00",
                off: "11:00"
            }
        }
    ]
}

//layers
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
        "refresh": false || {
            "type": "longPoll", //could be sse
            "time": 10000
        },
        "postProcess": {
            "laneSplit": true
        }
    }

]

- possiblity to have many maps generated from different geojson based data sets
- backend should be able to push updates
- default layer, on by default layers

Backend
- possibility to send updates to the client
- adaptors for feeds to node service which can then diff and send sses to connected clients


