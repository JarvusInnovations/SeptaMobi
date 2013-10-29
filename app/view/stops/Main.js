Ext.define('SeptaMobi.view.stops.Main', {
    extend: 'Ext.tab.Panel',

    xtype:'stops-main',
    requires: [
    	'SeptaMobi.view.stops.NearbyList',
    	'SeptaMobi.view.schedule.RoutesList'
    ],

    config: {
        cls: 'stops-main',
    	items: [{
            title: 'Stops',
            //iconCls: 'stops-nearbylist',
            xtype: 'stops-nearbylist'
        }, {
            title: 'Schedule',
           // iconCls: 'tab-stops',
            xtype: 'schedule-routeslist'
        }]
    }
});