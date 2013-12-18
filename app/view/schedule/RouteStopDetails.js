Ext.define('SeptaMobi.view.schedule.RouteStopDetails', {
	extend: 'SeptaMobi.view.schedule.RouteDetails',
	xtype: 'schedule-routestopdetails',
	requires: [
	   'SeptaMobi.view.schedule.RouteDetails'
	],
	
	config: {
		detailView: {
			store: 'Stops',
			title: 'Stops',
			itemTpl: [
				'<div>',
					'<span>{name}</span>',
				'</div>'
			]
		}
	}
});