Ext.define('SeptaMobi.controller.Schedule', {
	extend: 'Ext.app.Controller',

	config: {
		views: [
			'schedule.RouteVariants',
			'schedule.RouteDetails',
		],
		stores: [
			'Routes'
		],
		models: [
			'RouteDetails'
		],
		refs: {
			navView: 'schedule-navview',
			routesList: 'schedule-routeslist',
			routeVariants: {
				selector: 'schedule-routevariants',
				autoCreate: true,

				xtype: 'schedule-routevariants'
			},
			routeDetails: {
				selector: 'schedule-routedetails',
				autoCreate: true,

				xtype: 'schedule-routedetails'
			}
		},
		control: {
			navView: {
				show: 'onScheduleShow'
			},
			'schedule-routeslist segmentedbutton': {
				toggle: 'onRoutesListSegmentedButtonToggle'
			},
			routesList: {
				select: 'onRoutesListSelect'
			},
			routeVariants: {
				select: 'onRoutesVariantsSelect'
			}
		}
	},

	onScheduleShow: function(navView, scheduleIndex) {
		var routeStore = Ext.getStore('Routes');

		if (!routeStore.isLoaded()) {
			navView.setMasked({
				xtype: 'loadmask',
				message: 'Loading Routes&hellip;'
			});
			
			routeStore.load({
				callback: function(records, operation, success) {
					navView.setMasked(false);
				}
			});
		}
	},

	onRoutesListSegmentedButtonToggle: function(segmentedButton, button, isPressed) {
		var navView = this.getNavView(),
			routeStore = Ext.getStore('Routes'),
			routeType;

		if (isPressed) {
			routeType = button.routeType;
			
			routeStore.clearFilter(!!routeType); // pass true to suppress update if we're going to apply a routeType filter next
			
			if (routeType) {
				routeStore.filter('routeType', routeType);
			}
		}
	},

	onRoutesListSelect: function(list, record) {
		var me = this,
			routeVariants = me.getRouteVariants(),
			navView = me.getNavView();
		
		routeVariants.setMasked({
			xtype: 'loadmask',
			message: 'Loading Details&hellip;'
		});
		
		navView.push(routeVariants);

		SeptaMobi.model.RouteDetails.load(record.getId(), {
			callback: function(detailsRecord) {
				routeVariants.setDetailsRecord(detailsRecord);
				routeVariants.setMasked(false);
			}
		});
	},

	onRoutesVariantsSelect: function(list, record) {
		var me = this,
			routeDetails = me.getRouteDetails(),
			routeVariants = me.getRouteVariants(),
			detailsRecord = routeVariants.getDetailsRecord(),
			navView = me.getNavView();

		routeDetails.setStops(record.get('stops'));

		navView.push(routeDetails);
	}
});