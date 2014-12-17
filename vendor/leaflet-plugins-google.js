'use strict';

var L = require('../vendor/leaflet.js')

/*
 * Google layer using Google Maps API, see https://github.com/shramov/leaflet-plugins
 * modified to work with Leaflet 0.8-dev.
 */

/* global google: true */

L.Google = L.Layer.extend({
	includes: L.Mixin.Events,

	options: {
		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,
		subdomains: 'abc',
		errorTileUrl: '',
		attribution: '',
		opacity: 1,
		continuousWorld: false,
		noWrap: false,
		mapOptions: {
			backgroundColor: '#dddddd'
		}
	},

	// Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
	initialize: function(type, options) {
		L.Util.setOptions(this, options);

		this._ready = google.maps.Map !== undefined;
		if (!this._ready) L.Google.asyncWait.push(this);

		this._type = type || 'SATELLITE';
	},

	onAdd: function(map, insertAtTheBottom) {
		this._map = map;
		this._insertAtTheBottom = insertAtTheBottom;

		// Make the zom level the same as the Leaflet map's zoom level
		this._zoomLevel = this._map.getZoom();

		// create a container div for tiles
		this._initContainer();
		this._initMapObject();

		// set up events
		map.on('viewreset', this._resetCallback, this);

		map.on('move', this._update, this);

		map.on('zoomanim', this._handleZoomAnim, this);

		//20px instead of 1em to avoid a slight overlap with google's attribution
		map._controlCorners.bottomright.style.marginBottom = '20px';

		this._reset();
		this._update();
	},

	onRemove: function(map) {
		map._container.removeChild(this._container);

		map.off('viewreset', this._resetCallback, this);

		map.off('move', this._update, this);

		map.off('zoomanim', this._handleZoomAnim, this);

		map._controlCorners.bottomright.style.marginBottom = '0em';
	},

	getAttribution: function() {
		return this.options.attribution;
	},

	setOpacity: function(opacity) {
		this.options.opacity = opacity;
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	setElementSize: function(e, size) {
		e.style.width = size.x + 'px';
		e.style.height = size.y + 'px';
	},

	_initContainer: function() {
		var tilePane = this._map._container,
			first = tilePane.firstChild;

		if (!this._container) {
			this._container = L.DomUtil.create('div', 'leaflet-google-layer leaflet-top leaflet-left');
			this._container.id = '_GMapContainer_' + L.Util.stamp(this);
			this._container.style.zIndex = 'auto';
		}

		tilePane.insertBefore(this._container, first);

		this.setOpacity(this.options.opacity);
		this.setElementSize(this._container, this._map.getSize());
	},

	_zoomLevel: 0,

	_initMapObject: function() {
		var self = this;

		if (!this._ready) {
			return;
		}

		this._google = new google.maps.Map(this._container, {
		    center: new google.maps.LatLng(0, 0),
		    zoom: this._zoomLevel,
		    tilt: 0,
		    mapTypeId: google.maps.MapTypeId[this._type],
		    disableDefaultUI: true,
		    keyboardShortcuts: false,
		    draggable: false,
		    disableDoubleClickZoom: true,
		    scrollwheel: false,
		    streetViewControl: false,
		    styles: this.options.mapOptions.styles,
		    backgroundColor: this.options.mapOptions.backgroundColor
		});

		this._reposition = google.maps.event.addListenerOnce(this._google, 'center_changed', function() { self.onReposition(); });

		google.maps.event.addListenerOnce(this._google, 'idle', function() { self._checkZoomLevels(); });

		//Reporting that map-object was initialized.
		this.fire('MapObjectInitialized', { mapObject: this._google });
	},

	_resetCallback: function(e) {
		this._reset(e.hard);
	},

	_reset: function(clearOldContainer) {
		this._initContainer();
	},

	_update: function(e) {
		var leafletZoomLevel, center;

		if (!this._google) {
			return;
		}

		leafletZoomLevel = this._map.getZoom();
		center = this._map.getCenter();

		this._resize();

		this._google.setCenter(new google.maps.LatLng(center.lat, center.lng));

		// Update the zoom level if the google map layer's zoom level
		// doesn't math the zoom level of the Leaflet map.
		if (this._zoomLevel !== leafletZoomLevel) {
			this._zoomLevel = leafletZoomLevel;
			this._google.setZoom(Math.round(this._zoomLevel));
		}
	},

	_resize: function() {
		var size = this._map.getSize();
		if (this._container.style.width === size.x &&
		    this._container.style.height === size.y)
			return;
		this.setElementSize(this._container, size);
		this.onReposition();
	},


	_handleZoomAnim: function (e) {
		var center = e.center;
		var _center = new google.maps.LatLng(center.lat, center.lng);

		this._google.setCenter(_center);
		this._google.setZoom(Math.round(e.zoom));
	},


	onReposition: function() {
		if (!this._google) return;
		google.maps.event.trigger(this._google, 'resize');
	}
});

L.Google.asyncWait = [];
L.Google.asyncInitialize = function() {
	var i;
	for (i = 0; i < L.Google.asyncWait.length; i++) {
		var o = L.Google.asyncWait[i];
		o._ready = true;
		if (o._container) {
			o._initMapObject();
			o._update();
		}
	}
	L.Google.asyncWait = [];
};
