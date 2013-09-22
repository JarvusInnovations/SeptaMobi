Ext.define('SeptaMobi.controller.Map', {
	extend: 'Ext.app.Controller',

	requires: [
		'Ext.util.Geolocation',
		'SeptaMobi.API',
		'SeptaMobi.ux.LeafletMap'
	],

	config: {
		devCoords: [39.965451, -75.142547],


		views: [
			'LeafletMap'
		],
		stores: [
			
		],
		refs: {
			leafletMap: 'leaflet-demo'
		},
		control: {
			'leaflet-demo': {
				maprender: 'onMapRender'
			}
		}
	},

	onMapRender: function() {
		var me = this,
			leafletDemo = me.getLeafletMap(),
			map = leafletDemo.getMap(),
			devCoords = me.getDevCoords();

		leafletDemo.setCurrentMarkers([(L.marker(devCoords).addTo(map))]);
		leafletDemo.getCurrentMarkers()[0].bindPopup('<a href="#">this is devnuts</a>').openPopup();
		
		Ext.Ajax.request({
			url: 'TripTemp.json',
			scope: this,
			callback: function(options, success, response) {
				var res = Ext.decode(response.responseText)
					,itineraries = res.plan.itineraries
					,i = 0, len;

				len = itineraries.length;
				
				for (; i < len; i++) {
					this.getLeafletMap().drawTrip(itineraries[i]);	
				}
				
			}
		});

		Ext.defer(function() {
			map.panTo(devCoords) 
		}, 1000, this);
		
	}
	
});