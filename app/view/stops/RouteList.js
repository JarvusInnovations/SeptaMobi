//TODO good candidate for reusable template with nearby list
Ext.define('SeptaMobi.view.stops.RouteList', {
	extend: 'Ext.dataview.List',
	xtype: 'stops-routelist',
	
	config: {
        stopId: null,
        title: 'Routes',

        cls: 'stops',
        itemHeight: 40,
		itemTpl: [
            //TODO change bus-number class to something else
            '<div class="routes">',
                '<tpl if="this.isBus(values)">',
                    '<span class="bus-number"><span class="number">{routeShortName}</span></span>',
                '</tpl>',
                '<p>{displayName}</p>',
            '</div>',
           {
                isBus: function(record) {
                    return record.routeType == 3;
                }
            }
        ]
	}
});