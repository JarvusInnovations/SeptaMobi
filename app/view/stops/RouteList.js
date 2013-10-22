Ext.define('SeptaMobi.view.stops.RouteList', {
	extend: 'Ext.dataview.List',
	xtype: 'stops-routelist',
	
	config: {
        title: 'Routes',

        cls: 'stops',
        itemHeight: 40,
		itemTpl: [
			//'<h3>{stopName}</h3>',
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