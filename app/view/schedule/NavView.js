Ext.define('SeptaMobi.view.schedule.NavView', {
	extend: 'Ext.navigation.View',
	xtype: 'schedule-navview',
	requires: [
		'SeptaMobi.view.schedule.RoutesList'
	],

	config: {
		navigationBar: {
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    align: 'right',
                    text: 'Bookmark',
                    action: 'toggleBookmark',
                    cls: 'bookmarks'
                }
            ]
        },
		items: [{
			xtype: 'schedule-routeslist'
		}]
	}
});