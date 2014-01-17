Ext.define('SeptaMobi.view.RouteDirections', {
	extend: 'Ext.dataview.DataView',
	xtype: 'routedirections',

	config: {
		route: null,
		encodedPoints: [],
		store: 'StopDirections',
		title: 'Route Directions',
		cls: 'list-style schedule',

		itemTpl: [
			'<div>',
			'<span>to {name}</span>',
			'</div>'
		]
	}
});