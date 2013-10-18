Ext.define('SeptaMobi.view.stops.Main', {
    extend: 'Ext.tab.Panel',

    xtype:'stops-main',
    cls: 'stops-main',
    requires: [
    	'SeptaMobi.view.stops.NearbyList',
    	'SeptaMobi.view.schedule.RoutesList'
    ],

    config: {
    	items: [{
            title: 'Stops',
            iconCls: 'stops-nearbylist',
            xtype: 'stops-nearbylist'
        }, {
            title: 'Schedule',
            iconCls: 'tab-stops',
            xtype: 'schedule-routeslist'
        }]
    }
});