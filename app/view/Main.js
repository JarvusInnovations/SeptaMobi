Ext.define('SeptaMobi.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'SeptaMobi.view.TripPlanner.Form',
        'SeptaMobi.view.Schedule.Index',
        'Ext.TitleBar'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                title: 'Dashboard',
                iconCls: 'home',

                styleHtmlContent: true,
                scrollable: true,

                items: {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'SeptaMobi'
                }
            },
            {
                title: 'Schedule',
                iconCls: 'action',

                xtype: 'scheduleindex'
            }, {
                title: 'Trip Planner',
                iconCls: 'action',

                xtype: 'tripplanner'
            }
        ]
    }
});
