Ext.define('SeptaMobi.controller.Stop', {
	extend: 'Ext.app.Controller',
	
	config: {
		views: [],
		stores: [
			'NearByStops'
		],
		refs: {
			navView: 'stops-navview'
		},
		control: {
			navView: {
				show: 'onStopsShow'
			},
			'stops-main': {
				leavescreen: 'onStopsMainLeaveScreen'
			}
		}
	},

	onStopsShow: function(navView, scheduleIndex) {
		var me = this;

		var routeStore = Ext.getStore('Routes');

		if (!routeStore.isLoaded()) {
			navView.setMasked({
				xtype: 'loadmask',
				message: 'Loading Routes&hellip;'
			});

			routeStore.load({
				callback: function(records, operation, success) {
					navView.setMasked(false);
					me.updateLocation();
				}
			});
		}
	},

	onStopsMainLeaveScreen: function(panel) {
		panel.down('schedule-routeslist').deselectAll();
	},

	updateLocation: function() {
		var me = this,
			navView = me.getNavView(),
			routeStore = Ext.getStore('Routes'),
			nearByStopsStore = Ext.getStore('NearByStops'),
			stopsLength, routesLength, i, j, routes;

		if (!nearByStopsStore.isLoaded()) {

			navView.setMasked({
				xtype: 'loadmask',
				message: 'Loading Near-By Stops&hellip;'
			});

			if (!me.geo) {
				me.geo = Ext.create('Ext.util.Geolocation', {
					autoUpdate: false,
					listeners: {
						locationupdate: function(geo) {
							SeptaMobi.API.getNearByStops(geo.getLatitude(), geo.getLongitude(), function() {
								navView.setMasked(false);	
							});
						},
						locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
							if (bTimeout) {
								alert('Location timeout occurred.');
							} else {
								alert('Location error occurred.');
							}
							navView.setMasked(false);
						}
					}
				});
			}
		}

		me.geo.updateLocation();
	}
});