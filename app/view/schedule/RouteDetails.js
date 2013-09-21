Ext.define('SeptaMobi.view.schedule.RouteDetails', {
	extend: 'Ext.Container',
	xtype: 'schedule-routedetails',

	config: {
		title: 'Route Detail',
		
		detailsRecord: null,
		
		tpl: [
			'<div>',
				'<span>{routeLongName}</span>',
			'</div>'
		]
	},
	
	updateDetailsRecord: function(detailsRecord) {
		this.setData(detailsRecord.getData());
	}
});