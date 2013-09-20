Ext.define('SeptaMobi.controller.Schedule', {
	extend: 'Ext.app.Controller',

	config: {
		views: [
			'Schedule.Index'
		],
		stores: [
			'Routes'
		],
		// refs: {

		// },
		control: {
			'scheduleindex': {
				activate: 'onScheduleIndexActivate'
			},
			'scheduleindex segmentedbutton': {
				toggle: 'onScheduleIndexSegmentedButtonToggle'
			}
		}
	},

	onScheduleIndexActivate: function(item, scheduleIndex) {
		var routeStore = Ext.getStore('Routes');

		scheduleIndex.setMasked({
			xtype: 'loadmask',
			message: 'Loading Routes&hellip;'
		});

		if (!routeStore.isLoaded()) {
			routeStore.load({
				callback: function(records, operation, success) {
					scheduleIndex.setMasked(false);
				}
			});
		}
	},

	onScheduleIndexSegmentedButtonToggle: function(segmentedButton, button, isPressed) {
		var routeStore = Ext.getStore('Routes'),
			routeType;

		if (isPressed) {
			routeType = button.routeType;
			
			routeStore.clearFilter(true);
			
			if (routeType) {
				routeStore.filter('routeType', routeType);
			}
		}
	}
});