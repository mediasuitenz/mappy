'use strict';

var L = require('../vendor/leaflet.js');

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

		if (!this._ready) {
			L.Google.asyncWait.push(this);
		}

		this._type = type || 'SATELLITE';
	},

	onAdd: function(map) {
		this._map = map;

		// create a container div for tiles
		this._initContainer();
		this._initMapObject();

		map.on('zoomanim', this._handleZoomAnim, this);

		// Move is triggered by moving the map on x, y, and z axis.
		// When triggered by zooming, the event happens AFTER the zoomanim event.
		map.on('move', this._handleMove, this);

		//20px instead of 1em to avoid a slight overlap with google's attribution
		map._controlCorners.bottomright.style.marginBottom = '20px';

		this._resize();
		this._center();
	},

	onRemove: function(map) {
		map._container.removeChild(this._container);

		map.off('move', this._handleMove, this);

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

	_initMapObject: function() {

		if (!this._ready) {
			return;
		}

		this._google = new google.maps.Map(this._container, {
		    center: new google.maps.LatLng(0, 0),
		    zoom: this._map.getZoom(),
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

		//Reporting that map-object was initialized.
		this.fire('MapObjectInitialized', { mapObject: this._google });
	},

	_center: function () {
		var center = this._map.getCenter();

		this._google.setCenter(new google.maps.LatLng(center.lat, center.lng));
	},

	_resize: function() {
		var size = this._map.getSize();

		if (this._container.style.width === size.x + 'px' && this._container.style.height === size.y + 'px') {
			return;
		}

		this.setElementSize(this._container, size);
	},

	_handleMove: function () {
		this._resize();
		this._center();
	},

	_handleZoomAnim: function (e) {
		this._google.setZoom(Math.round(e.zoom));
	}
});

L.Google.asyncWait = [];
L.Google.asyncInitialize = function() {
	var i, o;
	for (i = 0; i < L.Google.asyncWait.length; i+= 1) {
		o = L.Google.asyncWait[i];
		o._ready = true;
		if (o._container) {
			o._initMapObject();
		}
	}
	L.Google.asyncWait = [];
};
