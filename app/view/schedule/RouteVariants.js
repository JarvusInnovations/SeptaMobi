Ext.define('SeptaMobi.view.schedule.RouteVariants', {
	extend: 'Ext.dataview.DataView',
	xtype: 'schedule-routevariants',

	config: {
		detailsRecord: null,

		title: 'Route Variants (TEMP)',
		cls: 'list-style schedule',

		itemTpl: [
			'<div>',
			'<span>{data.name}</span>',
			'</div>'
		]
	},

	updateDetailsRecord: function(detailsRecord) {
		var data = Ext.Array.map(detailsRecord.variants().getRange(), function(r) {
			return {
				routeShortName: detailsRecord.get('routeShortName'),
				data: r.getData(),
				stops: r.stops(),
				encodedPoints: r.get('encodedPoints'),
				type: detailsRecord.get('type')
			};
		});

		this.setData(data);
	}
});