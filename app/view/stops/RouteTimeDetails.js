Ext.define('SeptaMobi.view.stops.RouteTimeDetails', {
	extend: 'SeptaMobi.view.RouteDetails',
	xtype: 'stops-routetimedetails',
	requires: [
	   'SeptaMobi.view.RouteDetails'
	],
	
	config: {
		detailView: {
			store: 'RouteStopTimes',
			title: 'Times',
			itemTpl: [
				'<div>',
					'<span>{time}</span>',
				'</div>'
			],
			disableSelection: true
		}
	}
});