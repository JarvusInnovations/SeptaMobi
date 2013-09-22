Ext.define('SeptaMobi.view.schedule.RouteDetails', {
	extend: 'Ext.dataview.DataView',
	xtype: 'schedule-routedetails',

	config: {
		stops: null,

		title: 'Route Details (?!)',
		
		itemTpl: [
			'<div>',
				'<span>{name}</span>',
			'</div>'
		]
	},
	
	updateStops: function(stops) {
		var data = Ext.Array.map(stops.getRange(), function(r) { return r.getData(); });

		this.setData(data);
	}
});