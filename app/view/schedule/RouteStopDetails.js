Ext.define('SeptaMobi.view.schedule.RouteStopDetails', {
	extend: 'SeptaMobi.view.RouteDetails',
	xtype: 'schedule-routestopdetails',
	requires: [
	   'SeptaMobi.view.RouteDetails'
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