Ext.define('SeptaMobi.view.stops.RouteMap', {
	extend: 'Jarvus.touch.ux.LeafletMap',
	xtype: 'stops-routemap',
	requires: [
	   'Jarvus.touch.ux.LeafletMap'
	],

	config: {
		stopMarkers: [],
		encodedPoints: [],
		routePolyLine: null,
		busMarkers: [],

		title: 'Map',
        tileLayerOptions: { detectRetina: true},
		useCurrentLocation: true,
		autoMapCenter: false,
		enableOwnPositionMarker: true,
		mapOptions: {
			zoom: 15
		}
	},
	
	removeBusMarkers: function() {
		var mapCmp = this,
			map = mapCmp.getMap(),
			busMarkers = this.getBusMarkers(),
			marker;

		while(marker = busMarkers.pop()) {
			map.removeLayer(marker);
		}
	}
});