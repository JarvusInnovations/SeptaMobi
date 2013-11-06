Ext.define('SeptaMobi.view.Map', {
	extend: 'Jarvus.touch.ux.LeafletMap',
	xtype: 'map',

	config: {
		markers: null,
		title: 'Map',
		tileLayerOptions: {
			detectRetina: true
		},
		useCurrentLocation: true,
		autoMapCenter: false,
		enableOwnPositionMarker: true,
		mapOptions: {
			zoom: 15
		}
	}
});