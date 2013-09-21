Ext.define('SeptaMobi.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'SeptaMobi.view.Dashboard',
        'SeptaMobi.view.TripPlanner.NavView',
        'SeptaMobi.view.Schedule.Index',
        'SeptaMobi.view.TripTplTemp',
        'Ext.TitleBar'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [{
            title: 'Dashboard',
            iconCls: 'home',

            xtype: 'dashboard'
        }, {
            title: 'Schedule',
            iconCls: 'action',

            xtype: 'scheduleindex'
        }, {
            title: 'Trip Planner',
            iconCls: 'action',

            xtype: 'tripplanner'
        }, {
            title: 'Trip TPL',
            iconCls: 'action',

            scrollable: true,

            items: [{
                docked: 'top',
                xtype: 'titlebar',
                title: 'Trip TPL (Temp)'
            }, {
                xtype: 'triptpltemp'
            }]
        }]
    }
});