Ext.define('SeptaMobi.view.extras.Map', {
	extend: 'Jarvus.touch.ux.LeafletMap',
	xtype: 'extrasmap',

	config: {
		selectedId: null,
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