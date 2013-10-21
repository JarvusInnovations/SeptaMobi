Ext.define('SeptaMobi.view.stops.RouteList', {
	extend: 'Ext.dataview.List',
	xtype: 'stops-routelist',
	
	config: {
        title: 'Routes',

		itemTpl: [
            '<div>',
                '<tpl if="this.isBus(values)">',
                    '<span class="bus-number">{routeShortName}</span>',
                '</tpl>',
                '<span>{displayName}</span>',
            '</div>',
            {
                isBus: function(record) {
                    return record.routeType == 3;
                }
            }
        ]
	}
});