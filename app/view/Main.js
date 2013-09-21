Ext.define('SeptaMobi.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'SeptaMobi.view.Dashboard',
        'SeptaMobi.view.TripPlanner.NavView',
        'SeptaMobi.view.schedule.Index',
        'SeptaMobi.view.TripTplTemp',
        'Ext.TitleBar'
    ],
    config: {
        tabBarPosition: 'bottom',

        tabBar: {
            defaults: {
                flex: 1
            }
        },

        items: [{
            title: 'Dashboard',
            iconCls: 'tab-dashboard',
            xtype: 'dashboard'
        }, {
            title: 'Schedule',
            iconCls: 'tab-schedule',
            xtype: 'scheduleindex'
        }, {
            title: 'Trip Planner',
            iconCls: 'tab-trip-planner',
            xtype: 'tripplanner'
        }, {
            title: 'Trip TPL',
            iconCls: 'tab-trip-planner',

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