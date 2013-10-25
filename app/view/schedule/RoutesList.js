Ext.define('SeptaMobi.view.schedule.RoutesList', {
	extend: 'Ext.dataview.List',
	xtype: 'schedule-routeslist',
	requires: ['Ext.SegmentedButton'],

	config: {
		title: 'Schedule',
		
		loadingText: false,
		cls: 'schedule',
		store: 'Routes',
		itemHeight: 30,
		itemTpl: [
			'<div>',				
				'<tpl if="routeType == 3">',
				'<span class="bus-number">{routeShortName}</span>',
				'</tpl>',
				'<span>{displayName}</span>',
			'</div>'
		],
		items: [{
			xtype: 'segmentedbutton',
			docked: 'top',
			defaults: {
				flex: 1
			},
			items: [{
				text: 'Bus',
				pressed: true,
				routeType: 3 
			}, {
				text: 'Subway',
				routeType: 1
			}, {
				text: 'Rail',
				routeType: 2
			}]
		}]
	}
});