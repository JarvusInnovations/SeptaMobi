Ext.define('SeptaMobi.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'SeptaMobi.view.TripPlanner.Form',
        'SeptaMobi.view.TripTplTemp',
        'Ext.TitleBar'
    ],
    config: {
        tabBarPosition: 'bottom',

        activeItem: 3,

        items: [{
            title: 'Dashboard',
            iconCls: 'home',

            styleHtmlContent: true,
            scrollable: true,

            items: {
                docked: 'top',
                xtype: 'titlebar',
                title: 'SeptaMobi'
            }
        },{
            title: 'Schedule',
            iconCls: 'action',

            items: [{
                docked: 'top',
                xtype: 'titlebar',
                title: 'Schedule'
            }]
        },{
            title: 'Trip Planner',
            iconCls: 'action',

            xtype: 'tripplanner'
        },{
            title: 'Trip TPL',
            iconCls: 'action',

            scrollable: true,
            
            items: [{
                docked: 'top',
                xtype: 'titlebar',
                title: 'Trip TPL (Temp)'
            },{
                xtype: 'triptpltemp'
            }]
        }]
    }
});
