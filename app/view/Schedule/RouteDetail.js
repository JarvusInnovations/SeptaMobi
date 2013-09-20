Ext.define('SeptaMobi.view.Schedule.RouteDetail', {
	extend: 'Ext.dataview.List',

	xtype: 'routedetail',

	config: {
		title: 'Route Detail',
		
		itemTpl: [
			'<div>',
				'<span>{displayName}</span>',
			'</div>'
		]
	}
});