Ext.define('SeptaMobi.view.schedule.RoutesList', {
	extend: 'Ext.dataview.List',
	xtype: 'schedule-routeslist',
	requires: ['Ext.SegmentedButton'],

	config: {
		title: 'Schedule',
		
		loadingText: false,
		cls: 'schedule',
		store: 'BusRoutes',
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
				routeSlug: 'buses'
			}, {
				text: 'Subways',
				routeSlug: 'subways'
			}, {
				text: 'Trolleys',
				routeSlug: 'trolleys'
			}, {
				text: 'Rail',
				routeSlug: 'trains'
			}]
		}]
	}
});