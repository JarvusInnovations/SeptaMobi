Ext.define('SeptaMobi.view.schedule.RouteDetails', {
	extend: 'Ext.tab.Panel',
	xtype: 'schedule-routedetails',

	config: {
		stops: null,
		stopMarkers: [],
		encodedPoints: null,
		routePolyLine: null,

		title: 'Route Details (?!)',
		items: [{
			xtype: 'dataview',
			title: 'Stops',
			itemId: 'routeDetailList',
			cls: 'list-view',
			itemTpl: [
				'<div>',
					'<span>{name}</span>',
				'</div>'
			]
		}, {
			xtype: 'leafletmap',
			title: 'Map',
			useCurrentLocation: true,
			autoMapCenter: false,
			enableOwnPositionMarker: true,
			mapOptions: {
				zoom: 15
			}
		}]
	},
	
	updateStops: function(stops) {
		var data = Ext.Array.map(stops.getRange(), function(r) { return r.getData(); });

		this.down('#routeDetailList').setData(data);
	}
});