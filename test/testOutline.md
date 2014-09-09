# Test Outline

config
- read from file, holds values and supplies as needed

data service
- pull geojson data from various endpoints
- receives sse for updates

layer
- has own data service
- has config
- insert item in key
- style up items
- inject styled content into popup

map
- set its base tilelayer

popup
- user clicks on map items
- open/close popup
- click events

key
- user interactions
  - hide/show layers
  - hide/show key
