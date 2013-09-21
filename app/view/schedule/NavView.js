Ext.define('SeptaMobi.view.schedule.NavView', {
	extend: 'Ext.navigation.View',
	xtype: 'schedule-navview',
	requires: [
		'SeptaMobi.view.schedule.RoutesList'
	],

	config: {
		items: [{
			xtype: 'schedule-routeslist'
		}]
	}
});