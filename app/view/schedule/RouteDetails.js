Ext.define('SeptaMobi.view.schedule.RouteDetails', {
	extend: 'Ext.tab.Panel',
	xtype: 'schedule-routedetails',
	requires: [
	   'Jarvus.touch.ux.LeafletMap'
	],

	config: {
		alert: null,
		stopMarkers: [],
		// encodedPoints: [],
		polylinePoints: [],
		routePolyLine: null,
		busMarkers: [],
		routeId: null,
		routeName: null,
		directionId: null,

		detailView: {
			xtype: 'dataview',
			itemId: 'detailView',
			cls: 'list-style',
			title: 'View'
		},

		title: 'Route Details',
		cls: 'schedule',
		items: [{
			xtype: 'leafletmap',
			title: 'Map',
	        tileLayerOptions: { detectRetina: true},
			useCurrentLocation: true,
			autoMapCenter: false,
			enableOwnPositionMarker: true,
			mapOptions: {
				zoom: 15
			}
		},{
			xtype: 'component',
			title: 'Alerts',
			itemId: 'alertsCmp'
		}]
	},
	
	// updateStops: function(stops) {
	// 	var data = Ext.Array.map(stops.getRange(), function(r) { return r.getData(); });

	// 	this.down('dataview').setData(data);
	// },

	applyDetailView: function(config) {
		return Ext.factory(config, Ext.dataview.DataView, this.getDetailView());
	},

	updateDetailView: function(newDetailView, oldDetailView) {
        if (oldDetailView) {
            this.remove(oldDetailView, true);
        }

        if (newDetailView) {
            this.insert(0, newDetailView);
        }
    },

	removeBusMarkers: function() {
		var mapCmp = this.down('leafletmap'),
			map = mapCmp.getMap(),
			busMarkers = this.getBusMarkers(),
			marker;

		while(marker = busMarkers.pop()) {
			map.removeLayer(marker);
		}
	},

	updateAlert: function(alert) {
		var alertsCmp = this.down('#alertsCmp');

		if(!alert) {
			alert = 'No Alerts At This Time';
		}

		alertsCmp.setHtml(alert);
	}
});