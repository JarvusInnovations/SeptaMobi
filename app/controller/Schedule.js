Ext.define('SeptaMobi.controller.Schedule', {
	extend: 'Ext.app.Controller',

	config: {
		views: [
			'Schedule.Index',
			'Schedule.RouteDetail'
		],
		stores: [
			'Routes',
			'RouteDetails'
		],
		refs: {
			scheduleIndex: 'scheduleindex',
			routeDetailList: {
				selector: 'routedetail',
				autoCreate: true,

				xtype: 'routedetail'
			}
		},
		control: {
			'scheduleindex': {
				activate: 'onScheduleIndexActivate'
			},
			'scheduleindex segmentedbutton': {
				toggle: 'onScheduleIndexSegmentedButtonToggle'
			},
			'scheduleindex list': {
				select: 'onScheduleIndexListSelect'
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
	},

	onScheduleIndexListSelect: function(list, record) {
		var me = this,
			routeDetailStore = Ext.getStore('RouteDetails'),
			routeDetailList = me.getRouteDetailList(),
			scheduleIndex = me.getScheduleIndex();

		routeDetailStore.getProxy().setExtraParam('id', record.get('id'));

		routeDetailStore.load({
			callback: function(records, operation, success) {
				// routeDetailList.setData(routeDetailStore.getAt(0).get('directions'));
			}
		});

		scheduleIndex.push(routeDetailList);
	}
});