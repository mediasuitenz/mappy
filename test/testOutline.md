# Test Outline

config
- read from file, holds values and supplies as needed

data service
- pull geojson data from various endpoints
- receives sse for updates

layer (controller)
- has own data service
- has config
- insert item in key
- style up items
- inject styled content into popup

layerMapPresenter (viewModel)
- new geojson layer (layer)
- provide style callback (layer.config)
- bind popup for each item (layer.config)
- map.add(layerMapPresenter)

layerKeyPresenter (viewModel)

map (view)
- set its base tilelayer

popup
- user clicks on map items
- open/close popup
- click events

key (view)
- user interactions
  - hide/show layers
  - hide/show key
