Ext.define('SeptaMobi.view.schedule.RouteVariants', {
	extend: 'Ext.dataview.DataView',
	xtype: 'schedule-routevariants',

	config: {
		detailsRecord: null,

		title: 'Route Variants (TEMP!)',

		itemTpl: [
			'<div>',
			'<span>{data.name}</span>',
			'</div>'
		]
	},

	updateDetailsRecord: function(detailsRecord) {
		var data = Ext.Array.map(detailsRecord.variants().getRange(), function(r) {
			return {
				data: r.getData(),
				stops: r.stops(),
				encodedPoints: r.get('encodedPoints')
			};
		});

		this.setData(data);
	}
});