Ext.define('SeptaMobi.view.schedule.RouteTimeDetails', {
	extend: 'SeptaMobi.view.schedule.RouteDetails',
	xtype: 'schedule-routetimedetails',
	requires: [
	   'SeptaMobi.view.schedule.RouteDetails'
	],
	
	config: {
		detailView: {
			store: 'StopTimes',
			title: 'Times',
			itemTpl: [
				'<div>',
					'<span>{time}</span>',
				'</div>'
			]
		}
	}
});